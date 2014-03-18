### Account ###
    clouda.mbaas.account

帐号登录

**方法：**

- login(options)
- logout(options)
- getStatus(options)
- getUserInfo(options)

#### login ####
	login(options)

**功能描述：**

调起帐号登录的浮层，成功返回登录用户信息

**参数说明：**

- options：为 object 类型，其中包括以下参数：


参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回登录用户信息
onfail | function(err){} | 操作失败，返回错误码信息
scope | string,默认"basic" | 权限以空格分隔，例子：获取个人云权限"basic netdisk" [更多权限](http://developer.baidu.com/wiki/index.php?title=docs/oauth#.E6.8E.88.E6.9D.83.E6.9D.83.E9.99.90.E5.88.97.E8.A1.A8)

#### logout ####
	logout(options)

**功能描述：**

调起帐号登出功能，成功返回成功状态吗

**参数说明：**

- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息

#### getStatus ####
	getStatus(options)

**功能描述：**

调起帐号登出功能，成功返回成功状态吗

**参数说明：**

- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回登录状态
onfail | function(err){} | 操作失败，返回错误码信息

#### getUserInfo ####
	getUserInfo(options)

**功能描述：**

获取登录用户个人信息

**参数说明：**

- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回登录用户信息
onfail | function(err){} | 操作失败，返回错误码信息