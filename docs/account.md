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
redirect_uri | string | redirect_uri是第三方轻应用提供的授权后回跳地址，其值必须在开发者中心的安全设置中注册。
scope | (可选)string,默认"basic" | 权限以空格分隔，例子：获取个人云权限"basic netdisk" [更多权限](http://developer.baidu.com/wiki/index.php?title=docs/oauth#.E6.8E.88.E6.9D.83.E6.9D.83.E9.99.90.E5.88.97.E8.A1.A8)
login_mode | (可选)number, 默认为0 | login_mode表示登录策略，为0时，表示使用默认策略，即用户如果已登录，则直接使用该用户身份完成登录、授权操作；为1表示需要用户确认下是否用当前登录用户身份来授权，并提供切换账号的入口；为2表示无论如何都要用户重新用百度账号登录一遍。
login_type | (可选)string | login_type表示OAuth授权页面是否展示为手机号快捷登陆页，login_type=sms展示手机号快捷登陆。默认不传展示为正常页面。
onsuccess | function(){} | 登录成功的回调函数.
onfail | function(){} | 登录失败的回调函数.