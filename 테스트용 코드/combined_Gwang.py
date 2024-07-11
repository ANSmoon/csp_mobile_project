import pandas as pd
import datetime
import numpy as np
import matplotlib as mp
import matplotlib.pyplot as plt
import os
from prophet import Prophet
import pandas as pd


df = pd.read_csv("Combined_Gwang.csv").iloc[:,:2]
df['ds'] = pd.to_datetime(df['ds'], errors = 'coerce')
df['y'] = df['y'].str.replace(',', '').astype('int64')
df.loc[df['y'] == 0, 'y'] = df['y'].mean()
df['y'] = df['y'].round(0)
model = Prophet()

model.fit(df)

start_date='20231118'
end_date='20231125'
future_7days=pd.date_range(start=start_date, end=end_date, freq='D')
future_7days = pd.DataFrame(future_7days, columns = ['ds'])
future_7days['ds']= pd.to_datetime(future_7days['ds'])

forecast = model.predict(future_7days) # 향후 11월 18일부터 11월 25일까지의 예측, dataFrame에 저장

f_date = forecast['ds'] #날짜
f_min = forecast['yhat_lower'] #최솟값
f_max = forecast['yhat_upper'] #최댓값
f_mean = forecast['yhat'] #평균값
    
expected_sales = forecast['yhat'] # 해당 변수가 사용하게 될 예측값 
print(expected_sales)