### Activity ###
    clouda.device.activity

调起应用 

**方法：** 

- start(options)

#### start #### 
  start(options)

**功能描述：** 

根据传递参数调起本地应用

**参数说明：** 

- options：为 object 类型，其中包括以下参数： 


参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回SUCCESS状态码
onfail | function(err){} | 操作失败，返回错误码信息 
intent | object | 参考android调起应用参数[intent](http://developer.android.com/reference/android/content/Intent.html)