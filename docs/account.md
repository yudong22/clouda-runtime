### Account ###
    clouda.mbaas.account

帐号登录

**方法：**

- login(options)

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


**login返回对象：**

成功:

```js
{
    "status": 1, 
    "message": {
        "account_info": {
            "uid": "798803966", 
            "app": "runtime-demo", 
            "username": "hxhitest", 
            "displayname": "hxhitest"
        }, 
        "expires_in": 2592000, 
        "scope": "basic", 
        "session_key": "9mtqBCLwiNr+KWBmSGJm63/ztF+Ln86hG5uGYu81fDUM+seTldu4hrrKo4IDtr9Qj0lQz3Lg54sTnTF2CCPjIoiY8Cb7CZ/RyQ", 
        "access_token": "23.a1b89d39e9cf222b780125b3f9352dc5.2592000.1397710551.33415291551913594", 
        "session_secret": "6d14317363e89bf556bd355a10184d91"
    }, 
    "keepCallback": false
}
```

失败:

```js
{
    "status": 9, 
    "message": {
        "error_code": 1, 
        "error_message": "login canceled"
    }, 
    "keepCallback": false
}
```