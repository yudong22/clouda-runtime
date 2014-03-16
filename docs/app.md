### App ###
    clouda.mbaas.app

调起应用 

**方法：** 

- addShortcut(appid,options)

#### addShortcut #### 
  addShortcut(appid,options)

**功能描述：** 

创建轻应用的快捷方式到桌面

**参数说明：** 

- appid：为 string 类型，该轻应用的appid
- options：为 object 类型，其中包括以下参数： 


参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功
onfail | function(err){} | 操作失败，返回错误码信息 