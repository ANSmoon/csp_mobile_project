import pandas as pd
import datetime
import numpy as np
import matplotlib as mp
import matplotlib.pyplot as plt
import os
from prophet import Prophet
import pandas as pd
from prophet.plot import add_changepoints_to_plot


df = pd.read_csv("Combined_Ap.csv").iloc[:,:2]
real = pd.read_csv("12.csv").iloc[:8,:2]


df['ds'] = pd.to_datetime(df['ds'], errors = 'coerce')
real['ds'] = pd.to_datetime(real['ds'], errors = 'coerce')


df['y'] = df['y'].str.replace(',', '').astype('int64')
real['y'] = real['y'].str.replace(',', '').astype('int64')


df.loc[df['y'] == 0, 'y'] = df['y'].mean()
df['y'] = df['y'].round(0)
real.loc[real['y'] == 0, 'y'] = real['y'].mean()
real['y'] = real['y'].round(0)


model = Prophet()
model.fit(df)


future = model.make_future_dataframe(periods=8)
forecast = model.predict(future)


fig = model.plot(forecast)
fig1 = model.plot_components(forecast)


fig2 = model.plot_components(forecast)

fig = model.plot(forecast)
fig1 = model.plot_components(forecast)


model1 = Prophet(changepoint_prior_scale=1) # 값 증가에 따라 trend 변화점 민감하게 반응[default = 0.05]
# model = Prophet(changepoints = ) # 트렌드가 바뀌는 지점(특정 지정날) 직접 추가
# model = Prophet(n_changepoints=) # changepoint 수 지정
# model = Prophet(changepoint_range=0.8) # 기본적으로 데이터 중 80% 범위 내 changepoint 설정

model1.fit(df)

fig = model1.plot(forecast)
a = add_changepoints_to_plot(fig.gca(), model1, forecast)

fig2 = model1.plot_components(forecast)


mode2 = Prophet(
    changepoint_prior_scale=0.5,
    weekly_seasonality=10,
    daily_seasonality=False,
    #seasonality_mode='multiplicative'
)

mode2.add_seasonality(name = 'monthly', period = 30.5, fourier_order=5)

mode2.fit(df)
forecast = mode2.predict(future)
fig = mode2.plot_components(forecast)
fig = mode2.plot(forecast)
a = add_changepoints_to_plot(fig.gca(), model1, forecast)


f_date = forecast['ds'].iloc[-8:] #날짜
f_min = forecast['yhat_lower'].iloc[-8:] #최솟값
f_max = forecast['yhat_upper'].iloc[-8:] #최댓값
f_mean = forecast['yhat'].iloc[-8:] #평균값


f_mean = f_mean.reset_index(drop = True) # 예측값입니다.

Date = real['ds'].reset_index(drop = True)
Date = Date.iloc[:8]

real = real.iloc[:8]

Actual_Sales = real['y'].reset_index(drop = True)


Expected_sales = f_mean.round(0)


Error_Rate = ((Actual_Sales - f_mean.round(0))/f_mean.round(0)).mul(100).abs().round(0)

verification = pd.DataFrame({'Date' : Date,'Actual_Sales' : Actual_Sales, 
                            'Expected_Sales' : Expected_sales, 'Error_Rate' : Error_Rate.astype('str') + '%'})

verification

Error_Rate_Mean = round(Error_Rate.mean())

print("")
print("실제값은 Expected_sales 에 저장되어 있습니다.")
print("")
print(verification)
print("")
print("오차율 = ",Error_Rate_Mean, "%")