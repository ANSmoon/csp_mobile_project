#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import datetime
import numpy as np
import matplotlib as mp
import matplotlib.pyplot as plt
import os
from prophet import Prophet
import pandas as pd


# In[2]:


df = pd.read_csv("Combined_Gwang.csv").iloc[:,:2]
real = pd.read_csv("11.csv").iloc[:7,:2]


# In[3]:


df['ds'] = pd.to_datetime(df['ds'], errors = 'coerce')
real['ds'] = pd.to_datetime(real['ds'], errors = 'coerce')


# In[4]:


df['y'] = df['y'].str.replace(',', '').astype('int64')
real['y'] = real['y'].str.replace(',', '').astype('int64')


# In[5]:


df.loc[df['y'] == 0, 'y'] = df['y'].mean()
df['y'] = df['y'].round(0)
real.loc[real['y'] == 0, 'y'] = real['y'].mean()
real['y'] = real['y'].round(0)


# In[6]:


model = Prophet()

model.fit(df)


# In[7]:


start_date='20231101'
end_date='20231107'
future_7days=pd.date_range(start=start_date, end=end_date, freq='D')
future_7days = pd.DataFrame(future_7days, columns = ['ds'])
future_7days['ds']= pd.to_datetime(future_7days['ds'])


# In[8]:


forecast = model.predict(future_7days) # 향후 11월 1일부터 11월 8일까지의 예측, dataFrame에 저장


# In[9]:


f_date = forecast['ds'] #날짜
f_min = forecast['yhat_lower'] #최솟값
f_max = forecast['yhat_upper'] #최댓값
f_mean = forecast['yhat'] #평균값


# In[10]:


Date = real['ds'].reset_index(drop = True)


# In[11]:


real


# In[12]:


Actual_Sales = real['y'].reset_index(drop = True)


# In[13]:


Expected_sales = f_mean.round(0)


# In[14]:


Error_Rate = ((Actual_Sales - f_mean.round(0))/f_mean.round(0)).mul(100).abs().round(0)


# In[15]:


verification = pd.DataFrame({'Date' : Date,'Actual_Sales' : Actual_Sales, 
                            'Expected_Sales' : Expected_sales, 'Error_Rate' : Error_Rate.astype('str') + '%'})


# In[16]:


verification


# In[17]:


Error_Rate_Mean = round(Error_Rate.mean())
Error_Rate_Mean


# In[18]:


mse = round(((f_mean - Actual_Sales) ** 2).mean())
mae = round(np.abs(f_mean - Actual_Sales).mean())
rmse = round(np.sqrt(mse))
print(mse,mae,rmse)


# In[72]:


forecast.plot()
all = pd.concat([df,real])
all = all.reset_index(drop = True)
test = Prophet()
test.fit(all)
test.plot(forecast)