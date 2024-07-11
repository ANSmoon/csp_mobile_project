from fastapi import FastAPI, HTTPException
from prophet import Prophet
import pandas as pd
from datetime import datetime, timedelta
from prophet.plot import add_changepoints_to_plot

app = FastAPI()
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

@app.get("/predict")
async def get_prediction_weekly(date: str):
    # 시작 날짜(오늘)와 종료 날짜(7일 후) 생성
    start_date = datetime.strptime(date, "%Y-%m-%d")
    start_date += timedelta(days=1)
    end_date = (start_date + timedelta(days=6)).strftime('%Y%m%d')

    future_7days=pd.date_range(start=start_date, end=end_date, freq='D')
    future_7days = pd.DataFrame(future_7days, columns = ['ds'])
    future_7days['ds']= pd.to_datetime(future_7days['ds'])

    forecast = mode2.predict(future_7days) # 향후 11월 1일부터 11월 8일까지의 예측, dataFrame에 저장
    result = {
        "mean": forecast['yhat'].tolist()
    }
    return result

@app.get("/predict-monthly")
async def get_prediction_monthly(date: str):
    # 시작 날짜(오늘)와 종료 날짜(7일 후) 생성
    start_date = datetime.strptime(date, "%Y-%m-%d")
    start_date += timedelta(days=1)
    end_date = (start_date + timedelta(days=29)).strftime('%Y%m%d')

    future_30days=pd.date_range(start=start_date, end=end_date, freq='D')
    future_30days = pd.DataFrame(future_30days, columns = ['ds'])
    future_30days['ds']= pd.to_datetime(future_30days['ds'])

    forecast = mode2.predict(future_30days) # 향후 11월 1일부터 11월 8일까지의 예측, dataFrame에 저장
    result = {
        "mean": forecast['yhat'].tolist()
    }
    return result
