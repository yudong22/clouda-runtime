#百度轻应用API参考文档#

问题反馈： [clouda-support@baidu.com](mailto:clouda-support@baidu.com)


## 概述 ##

百度轻应用API是一套使用JavaScript语言提供的应用工具接口，方便快捷的实现轻应用开发。

百度轻应用API包括三类API：

- 本地设备能力类： **clouda.device**
- 云服务类：   **clouda.mbaas**

## 命名空间

百度轻应用API统一使用的命名空间为：

    clouda

## 服务开启及设置

参考[开发指南](http://cloudajs.org/lightapp/docs/dev_guide#h2_1)
    
## 引用JS API文件

在HTML页面中添加以下代码：

    <script name="baidu-tc-cerfication" type="text/javascript" charset="utf-8" src="http://apps.bdimg.com/cloudaapi/lightapp.js"></script>

如果页面是使用https加密链接的时，请内嵌如下代码

    <script name="baidu-tc-cerfication" type="text/javascript" charset="utf-8" src="https://openapi.baidu.com/cloudaapi/lightapp.js"></script>

## App信息注册API ##


初始化api，可以使用如下方法:
 
		clouda.lightInit({
			ak:apikey,
			module:["app","account"]//根据勾选的模块生成
		});

参数 | 类型 | 描述 
------------ | ------------- | ------------
apikey | string | 轻应用的APIKEY,获取方法参考[开发指南](http://cloudajs.org/lightapp/docs/dev_guide)
module | Array | 轻应用的具体模块,获取方法参考[勾选模块](http://cloudajs.org/lightapp/api-product)



##系统通用的状态码信息

    clouda.STATUS.SUCCESS ： 成功(非0)
    clouda.STATUS.SYSTEM_FAILURE ： 系统错误
    clouda.STATUS.USER_CANCELED ： 用户取消操作(-2)
    
###系统通用的成功信息
具体格式参考文档，一般来说类型有string,object

###系统通用的取消码信息
当用户在使用设备能力api未完成而取消时，触发onfail函数，错误码（-2）

    {result:-2,error_info:"canceled."}

###系统通用的错误码信息
    
    {result:1,error_info:"some errors readable."}

## 本地设备能力类API##
    clouda.device

本地设备能力类API目前支持以下功能：

- 调起应用 (Activity)
- 电池（Battery）
- 网络连接状态(Connection)
- 设备信息（Device）
- 文件系统（FileSystem）
- 系统语言信息 (Globalization)
- 地理位置（Geolocation）
- 本地媒体功能（Media）
- 二维码（QRCode）


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

**intent用法举例**

        var onsuccess = onfail = function(){};

        function setupCalender() {//新建日历

            var intent = {
                action: "android.intent.action.EDIT",
                type: "vnd.android.cursor.item/event",
                title: "Some title",
                description: "Some description",
                beginTime: 1384676947757,
                endTime: 1384680547757
            };
            clouda.device.activity.start({onsuccess:onsuccess,onfail:onfail,intent:intent});
            
        }

        function sendMessage() {//发送短信
            var intent = {
                action: "android.intent.action.SENDTO",
                uri: "smsto: 18600872789",
                sms_body: "How are you doing?"
            };
            clouda.device.activity.start({onsuccess:onsuccess,onfail:onfail,intent:intent});
        }

        function playVideo() {//播放视频
            var intent = {
                action: "android.intent.action.VIEW",
                uri: "http://bcs.duapp.com/jaketestbucket/BaiduXCloud%20v03.mp4?sign=MBO:B3cd3aed3bca93d78135c99c2ab8b5ce:3rCc42yqHZu6lOn7uuucEMSQzI8%3D",
                type: "video/*"
            };
            clouda.device.activity.start({onsuccess:onsuccess,onfail:onfail,intent:intent});
        }


### Battery ###

    clouda.device.battery

**方法：**

- get(options)
- startListen(options)
- stopListen(options)

#### get ####
    get(options)

**功能描述：**

获取电池状态信息

**参数说明：**

- options ： 为 object 类型，其中包含以下参数：

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>onsuccess</td>
            <td>function(data){}</td>  
            <td>获取电池状态信息成功，data是返回的BatteryStatus对象</td>  
        </tr>
        <tr>
            <td>onfail</td>
            <td>function(err){}</td>
            <td>获取失败，返回错误码</td>   
        </tr>
    </tbody>
</table>

**返回的BatteryStatus对象：**

参数 | 类型 | 描述 
------------ | ------------- | ------------
level | float | 电量百分比
isPlugged | boolean | 电池充电状态，默认false，未充电


#### startListen ####
    startListen(options)

**功能描述：**

监听电池状态

**参数说明：**

- options 是一个object，同get(options)中的options说明。

#### stopListen ####
    stopListen(options)

**功能描述：**

清除电池状态信息

**参数说明：**

- options是一个object，其中包括以下参数：

参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回SUCCESS状态码
onfail | function(err){} | 操作失败，返回错误码信息


### Connection ###

     clouda.device.connection
    
网络连接

**方法：**

- get(options)

#### get ####

    get(options)

**功能描述：**

获取当前网络状态

**参数说明：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>onsuccess</td>
            <td>function(data){}</td>           
            <td>操作成功，data是返回的当前网络的字符串</td>  
        </tr>
        <tr>
            <td>onfail</td>
            <td>function(err){}</td>          
            <td>操作失败，返回错误码</td>  
        </tr>
    </tbody>
</table>

**返回的网络类型字符串**

网络连接状态类型可能的取值：

    clouda.device.CONNECTION_STATUS.UNKNOWN // 未知状态
    clouda.device.CONNECTION_STATUS.NONE // 断开状态
    clouda.device.CONNECTION_STATUS.WIFI // WIFI连通状态
    clouda.device.CONNECTION_STATUS.CELL_2G // 移动数据2G连通状态
    clouda.device.CONNECTION_STATUS.CELL_3G // 移动数据3G连通状态
    clouda.device.CONNECTION_STATUS.CELL_4G // 移动数据4G连通状态
    clouda.device.CONNECTION_STATUS.CELL // 移动数据通连通状态
    clouda.device.CONNECTION_STATUS.ETHERNET // 以太网连通状态


### Device ###

    clouda.device.device

设备信息

**方法：**

- getImei(options)
- getSysVersion(options)
- getDeviceModelName(options)
- getScreenSize(options)

#### getImei ####
    getImei(options)

**功能描述：**

获取设备的imei号，imei由设备生产商及特定设备平台或型号所决定

**参数说明：**

- options : 为 object 类型，其中包含以下参数：
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>onsuccess</td>
            <td>function(data){}</td>           
            <td>操作成功，data返回的是一个string</td>  
        </tr>
        <tr>
            <td>onfail</td>
            <td>function(err){}</td>          
            <td>操作失败，返回错误码</td>  
        </tr>
    </tbody>
</table>

#### getSysVersion ####
    getSysVersion(options)

**功能描述：**

获取设备的系统版本信息

**参数说明：** 

- options：为 object 类型，其中包括以下参数： 


参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功信息
onfail | function(err){} | 操作失败，返回错误码信息 

#### getDeviceModelName ####
    getDeviceModelName(options)

**功能描述：**

获取设备的名称

**参数说明：** 

- options：为 object 类型，其中包括以下参数： 


参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功信息
onfail | function(err){} | 操作失败，返回错误码信息 

#### getScreenSize ####
    getScreenSize(options)

**功能描述：**

获取设备的屏幕分辨率

**参数说明：** 

- options：为 object 类型，其中包括以下参数： 


参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功信息
onfail | function(err){} | 操作失败，返回错误码信息 

**返回的screen对象**

参数 | 类型 | 描述 
------------ | ------------- | ------------
width | int | 宽度
height | int | 高度
pixelDepth | int | 颜色分辨率
colorDepth | int | 色深

### FileSystem ###

    clouda.device.fs

文件管理

**方法：**

- post(path,target,options)

#### post ####
    post(path,target,options)

**功能描述：**

将本地文件以POST方式上传至指定URL

**参数说明：**

- path : 为 string 类型，本地文件的path(全路径，包含文件名)
- target : 为 string 类型，目标地址URL(仅HTTP/HTTPS)
- options : 为 object 类型，其中包含以下参数：

参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，操作成功，返回的 data 是目标URL返回的结果
onfail | function(err){} | 操作失败，返回错误码信息 
param | object| 伴随文件上传，传递的POST数据（可选）
uploadKey | string | 上传表单中的key


### Geolocation ###
    clouda.device.geolocation

地理位置

**方法：**

- get(options)
- startListen(options)
- stopListen(options)

#### get ####
    get(options)

**功能描述：**

获取当前地理位置信息。

**参数说明：**

- options是一个object，其中包括以下参数：

参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回地理信息对象
onfail | function(err){} | 操作失败，返回错误码信息 

**返回的地理信息对象**

参数 | 类型 | 描述 
------------ | ------------- | ------------
accuracy | float | 精确度(单位米)
longitude | float | 经度
latitude | float | 纬度
coordtype | string | 坐标类型, 包括
| | clouda.device.COORDTYPE.BD 百度经纬度坐标
| | clouda.device.COORDTYPE.GCJ 国测局经纬度坐标
| | clouda.device.COORDTYPE.GPS GPS经纬度


#### startListen ####
    startListen(options)

**功能描述：**

监听地理位置信息。

使用场景分为步行（高灵敏度）和开车（低灵敏度）两种，

启动对有大幅变化的地理位置进行监听。调用后立即触发一次回调，报告当前位置，后续只在地理位置发生变动时方通知。

**参数说明：**

- options是一个object，其中包括以下参数：

参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回地理信息对象
onfail | function(err){} | 操作失败，返回错误码信息 
significant | bool | 是否仅在位置发生大幅变化时进行回调，boolean类型，默认true(相当于省电模式)。<font color="red">目前大幅变化阈值设置为20米，不支持自定义配置。</font>


#### stopListen ####
    stopListen(options)

**功能描述：**

停止监听地理位置信息。

**参数说明：**

- options是一个object，其中包括以下参数：

参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回SUCCESS状态码
onfail | function(err){} | 操作失败，返回错误码信息 


### Globalization ###
    clouda.device.globalization

系统语言信息 

**方法：** 

- getlocale(options)

#### getlocale #### 
  getlocale(options)

**功能描述：** 

获取本地语言种类

**参数说明：** 

- options：为 object 类型，其中包括以下参数： 


参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回当前用户语言，字符串格式，具体参见 [语言编码标准](http://zh.wikipedia.org/wiki/ISO_639-1)
onfail | function(err){} | 操作失败，返回错误码信息 


### Media ###
    clouda.device.media

本地媒体功能

**方法：**

- captureMedia(options)
- operateMedia(link, operator, options)    

#### CaptureMedia ####
    captureMedia(options)

**功能描述：**

调取本地照相、视频功能；拍摄、录制、拍照及读取本地图片文件。

**参数说明：**

- options ：为 object 类型，其中包含以下参数：

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
   <tbody>
    <tr>
        <th>参数</th>
        <th>类型</th>
        <th>描述</th>
    </tr>
    <tr>
        <td>onsuccess</td>
        <td>function(data){}</td>          
        <td>操作成功，返回 MediaFile 对象或其组成的数组，如[MediaFile, MediaFile]</td>  
    </tr>
    <tr>
        <td>onfail</td>
        <td>function(err){}</td>          
        <td>操作失败，返回错误码</td>  
    </tr>
    <tr>
        <td>mediaType</td>
        <td>string</td>          
        <td> 媒体类型，其值如下： <br>
         - clouda.device.MEDIA_TYPE.IMAGE(默认) <br>
         - clouda.device.MEDIA_TYPE.VIDEO</td>  
    </tr>
    <tr>
        <td>source</td>
        <td>string</td>
        <td>媒体文件来源，其值如下：：<br>
        - clouda.device.MEDIA_SOURCE.CAMERA<br>
        </td>  
    </tr>
</tbody>
</table>

**返回的MediaFile对象**

参数 | 类型 | 描述 
------------ | ------------- | ------------
name | string | 文件名，不含路径信息
fullPath | string | 文件本地全路径（含文件名）
type | string | 文件的MIME类型
lastModifiedDate | timestamp | 文件最后修改时间
size | int | 文件大小，单位：字节(bytes)



#### operateMedia ####
    operateMedia(link, operator, options)

**功能描述：**

录制和回放指定路径的音频文件

**参数说明：**

- link : 为 string 类型，本地音频文件路径
- operator ： 为 string 类型，所支持的对音频文件的具体操作类型如下：

方法 | 描述 
------------ | -------------
startRecord | 开始录制音频文件，操作成功返回SUCCESS状态码；操作失败，则返错误码信息
stopRecord | 停止录制音频文件，操作成功返回文件的绝对路径；操作失败，则返错误码信息 
play | 开始或继续播放音频文件，操作成功返回SUCCESS状态码；操作失败，则返错误码信息
stop | 停止播放音频文件，操作成功返回SUCCESS状态码；操作失败，则返错误码信息
seekTo | 移动音频文件的播放位置。此操作类型下，options中需包含以下三个参数：
       | time: int 类型，设置音频文件重放位置，单位：毫秒  
       | onsuccess:  操作成功返回SUCCESS状态码
       | onfail: 操作失败，则返错误码
setVolume | 设置播放音量，此操作类型下，options中需包含以下三个参数：
       | volume: float 类型，设置音频文件播放音量，取值范围为[0.0, 1.0]
       | onsuccess:  操作成功返回SUCCESS状态码
       | onfail: 操作失败，则返错误码
speedFF | 快进5s，操作成功返回SUCCESS状态码；操作失败，则返错误码信息


- options : 为 object 类型，其中包含以下参数：

参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，data返回信息，详见前述 operator 的参数说明
onfail | function(err){} | 操作失败，返回错误码信息 



### QRCode ###
     clouda.device.qr

二维码、条形码类

**方法：**

- startCapture(options)

#### startCapture ####

    startCapture(options)

**功能描述：**

启动二维码或条形码扫描与识别

**扫描对象类型：**

- clouda.device.QR_TYPE.QRCODE  ：二维码
- clouda.device.QR_TYPE.BARCODE  ： 条形码

**参数说明：**

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>onsuccess</td>
            <td>function(data){}</td>            
            <td>扫描成功，返回二维码内容字符串</td>  
        </tr>
        <tr>
            <td>onfail</td>
            <td>function(err){}</td>          
            <td>二维码扫描失败，返回错误码</td>  
        </tr>
        <tr>
            <td>type</td>
            <td>number</td>          
            <td>扫描对象类型</td>  
        </tr>
    <tbody>
</table>


## 云服务类API ##

云服务类API目前支持以下功能： 

- 帐号 (Account)
- 轻应用（App）
- 轻支付（Pay）


### Account ###
    clouda.mbaas.account

帐号登录

**方法：**

- login(options)
- closeLoginDialog()

#### login ####
    login(options)

**功能描述：**

调起帐号登录的浮层，成功返回登录用户信息

**参数说明：**

- options：为 object 类型，其中包括以下参数：


参数 | 类型 | 描述
------------ | ------------- | ------------
redirect_uri | string | redirect_uri是第三方轻应用提供的授权后回跳地址，其值必须在开发者中心的安全设置中注册。[了解注册相关流程](http://developer.baidu.com/wiki/index.php?title=docs/oauth/redirect)
scope | string(可选), 默认"basic"  | 权限以空格分隔，例子：获取个人云权限"basic netdisk" [更多权限](http://developer.baidu.com/wiki/index.php?title=docs/oauth#.E6.8E.88.E6.9D.83.E6.9D.83.E9.99.90.E5.88.97.E8.A1.A8)
login_mode | number(可选), 默认为0   | login_mode表示登录策略，为0时，表示使用默认策略，即用户如果已登录，则直接使用该用户身份完成登录、授权操作；为1表示需要用户确认下是否用当前登录用户身份来授权，并提供切换账号的入口；为2表示无论如何都要用户重新用百度账号登录一遍。
login_type | string(可选)  | login_type表示OAuth授权页面是否展示为手机号快捷登陆页，login_type=sms展示手机号快捷登陆,login_type=mobile展示移动快捷登录。默认不传展示为正常页面。
mobile | string(可选) | 在login_type 选择sms时，可以设置该参数，用于登录时预填手机号码。
state | string(可选) | 用于保持请求和回调的状态，授权服务器在回调时（重定向用户浏览器到“redirect_uri”时），会在Query Parameter中原样回传该参数。OAuth2.0标准协议建议，利用state参数来防止CSRF攻击
disable_third_login | number(可选),默认为1 | 当 disable_third_login = 1 时, 隐藏通过新浪,QQ等三方登录帐号区域. 当 disable_third_login = 0 时, 显示三方帐号登录区域.
onsuccess | function(){}  | 登录成功的回调函数. onsuccess函数体中,需要开发者手动调用一次`clouda.mbaas.account.closeLoginDialog()`方法.
onfail | function(){}  | 登录失败的回调函数. onfail函数体中,需要开发者手动调用一次`clouda.mbaas.account.closeLoginDialog()`方法

#### closeLoginDialog ####
    closeLoginDialog()

**功能描述：**

关闭帐号登录的浮层


### App ###
    clouda.mbaas.app

轻应用订阅相关接口
订阅及检测是否已订阅

**方法：** 

- followSite(appid,options)
- checkFollow(appid,options)

<!--#### addShortcut #### 
  addShortcut(appid,options)

**功能描述：** 

创建轻应用的快捷方式到桌面

**参数说明：** 

- appid：为 string 类型，该轻应用的appid
- options：为 object 类型，其中包括以下参数： 


参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回SUCCESS状态码
onfail | function(err){} | 操作失败，返回错误码信息 -->


#### followSite 
  followSite(appid,options)

**功能描述：** 

关注轻应用，同时添加轻应用到桌面

**参数说明：** 

- appid：为 string 类型，该轻应用的appid
- options：为 object 类型，其中包括以下参数： 


参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回SUCCESS状态码
onfail | function(err){} | 操作失败，返回错误码信息 

#### checkFollow 
  followSite(appid,options)

**功能描述：** 

检查是否已关注轻应用

**参数说明：** 

- appid：为 string 类型，该轻应用的appid
- options：为 object 类型，其中包括以下参数： 


参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回关注信息状态码
onfail | function(err){} | 操作失败，返回错误码信息 

**返回的关注信息状态码：**
stateCode表示是否关注轻应用的状态码，如下表

stateCode | 描述 
---------- | ------------- 
0 | 未添加
1 | 已添加
2 | 添加中

### 轻支付(PAY) ###
    clouda.mbaas.pay
    
PAY接口提供支付功能。

**方法：**

- init(parter_id,options)
- doPay(options)

#### init####
    init(parter_id,options)

**功能描述：**

传入parter_id ，初始化支付接口

**参数说明：**
- parter_id：为 string 类型，初始化合作方id
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功信息
onfail | function(err){} | 操作失败，返回错误码信息


#### doPay####
    doPay(options)

**功能描述：**

传入支付配置，调起支付

**参数说明：**
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回一个对象。
onfail | function(err){} | 操作失败，返回错误码信息
hide_loading | bool | 表示是否要隐藏加载支付插件的页面
orderInfo | string | 其中参数以“key=value”形式呈现，参数之间以“&”分割，所有参数不可缺。示例如下：（具体参数说明请见参数列表）

orderInfo为订单信息, 例如:
```
currency=1&extra=&goods_category=1&goods_channel=baidu&goods_channel_sp=0001&goods_desc=商品描述&goods_name=商品名称&goods_url=http://item.jd.com/736610.html&input_charset=1&order_create_time=20130508131702&order_no=1372323335119&pay_type=2&return_url=http://item.jd.com/736610.html&service_code=1&sign_method=1&sp_no=1210010002&total_amount=1&transport_amount=0&unit_amount=1&unit_count=1&sign=8bed1f925ccf534e9b6ee2d385c0c892
```
##### 参数列表
参数名 | 参数含义 | 格式说明 | 是否必须
---------- | ------------- | ------------ | ------------
service_code | 服务编号 | 整数，目前必须为1 | 是
sp_no | 百度钱包商户号 | 10位数字组成的字符串 | 是
order_create_time | 创建订单的时间 | YYYYMMDDHHMMSS | 是
order_no | 订单号，商户须保证订单号在商户系统内部唯一。 | 不超过20个字符 | 是
goods_category | 商品分类号。 | 取值由钱包系统分配 | 否
goods_channel_sp | 数字商品开发商 | 10位数字组成的字符串 | 否
goods_channel | 数字商品渠道 | 商户与渠道商提前约定好，字符串，字母和数字的组合，不能包含其他特殊字符,不超过20为字符串 | 否
goods_name | 商品的名称 | 允许包含中文；不超过128个字符或64个汉字 | 是
goods_desc | 商品的描述信息 | 允许包含中文；不超过255个字符或127个汉字 | 是
goods_url | 商品在商户网站上的URL。 | URL | 否
unit_amount | 商品单价，以分为单位 | 非负整数 | 否
unit_count | 商品数量 | 非负整数 | 否
transport_amount | 运费 | 非负整数 | 否
total_amount | 总金额，以分为单位 | 非负整数 | 是
currency | 币种，默认人民币 | 取值范围参见附录 | 是
buyer_sp_username | 买家在商户网站的用户名 | 允许包含中文；不超过64字符或32个汉字 | 否
return_url | 百度钱包主动通知商户支付结果的URL | 仅支持http(s)的URL。 | 是
pay_type | 支付方式 | 默认取值2 | 是
expire_time | 交易的超时时间 | YYYYMMDDHHMMSS，不得早于交易创建的时间。 | 否
input_charset | 请求参数的字符编码 | 取值范围参见附录 | 是
version | 接口的版本号 | 必须为2 | 是
sign | 签名结果 | 取决于签名方法 | 是
sign_method | 签名方法 | 取值范围参见附录 | 是
extra  | 商户自定义数据 | 不超过255个字符 | 否

##### 返回值
支付结束后返回一个对象(onsuccess的data信息)，格式如下
    
    `statecode:{状态码};order_no:{商户传入的订单号};notify:{订单签名}`
        
Statecode为状态码，表示支付结果，如下表

stateCode | 描述 
---------- | ------------- 
0 | 成功
1 | 支付中
2 | 取消
3 | 不支持此种支付方式（收银台前置的情况下才会出现）
4 | token失效（外部带登陆状态才会出现）
5 | 登陆失败

order_no为商户传入的订单号

notify为订单签名，需要通过notify以判断并确定支付结果。例如
```
notify="currency=1&extra=&order_no=1372852640712&pay_result=1&pay_time=20130703200113&pay_type=2&sign_method=1&sp_no=1210010002&total_amount=1&transport_amount=0&unit_amount=1&unit_count=1&sign=b3e35d180b747d5302d5ccbab6410c53"
```
在stateCode =0，并且验签成功的情况下，证明支付成功。如果是安全级别低的情况下可以只用stateCode =0证明支付成功。其它情况归为失败。

##### 说明： 
1. 商户通过上述参数拼成订单信息。如果只有1个商品，那么goods_desc和goods_url可以使该商品的名称和展现URL；如果包括多个商品，那么goods_desc和goods_url不可能与每个商品一一对应，具体内容由商户定义。
2. 该接口“可能包含中文”的参数包括：goods_name、goods_desc、buyer_sp_username，因此指定了input_charset参数。这三个参数值必须按input_charset编码后，才能参与签名。
3. goods_name和goods_desc同样都是商品的相关信息。区别在于，goods_name是商品名称，比较短；goods_desc是商品的描述，比较长。如果商户觉得goods_name不足以说明商品的信息，则可以使用goods_desc字段。
4. total_amount的值是必须提供的；unit_amount、unit_count和transport_amount的值或者都提供，或者都不提供。如果这4个参数都提供了，那么必须满足下面等式：
total_amount = unit_amount*unit_count+transport_amount
否则，百度支付SDK将拒绝该支付请求。
5. buyer_sp_username是买家在商户网站的用户名。如果商户需要在百度支付SDK的交易记录中保存该信息，则可以使用这个参数。
6. return_url用于后台通知。return_url的内容包括必要的文本信息即可。这个URL不应该带有参数。需要注意的是，return_url必须返回200，不能要求登录或重定向。
7. extra完全由商户自己使用，对百度支付SDK是透明的。如果提供了该参数，那么查单接口和通知接口将原样返回该参数。


##### 签名机制
于商户和百度安全支付之间的通信涉及到订单信息和支付信息，必须保证通信数据不被篡改和伪造。否则，将给商户和百度安全支付造成资金损失。

百度安全支付采用签名机制来保证通信安全。本文中的每个接口规范都包括两个参数：sign_method和sign。sign_method是摘要算法，sign是签名结果。商户或百度支付SDK向对方发送数据时，必须指定sign_method并生成相应的sign；对方接收到数据后，必须使用相同的签名算法对sign的值进行验证。如果验证不通过，则说明通信数据已经被篡改或伪造。


百度支付SDK没有使用RSA、DSA等给予非对称密钥的签名算法，而是使用了MD5、SHA-1等摘要算法。这些摘要算法本身并不能用作签名，但是结合百度支付SDK合作密钥，也可以起到签名的作用，进而达到防篡改和伪造的目的。


商户与百度支付SDK签约时，百度支付SDK会分配一个百度支付SDK合作密钥。每个
商户的密钥是唯一的，一定不能让第三方知道。如果密钥泄漏，必须及时通知百度支付SDK更换密钥。

签名机制包括拼接待签名数据和对待签名数据进行摘要两个步骤：

- 待签名数据由除sign之外的所有请求参数和百度支付SDK合作密钥按以下规则拼接而成：

    - 请求参数都按照名称字符升序排列（参数名称不允许相同 ）
    - 某些请求参数的值是允许包含中文的，为了避免中文的编码问题，我们规定所有参数的值必须按照input_charset进行编码（input_charset的含义请参见即时到帐接口规范）
    - 对于可选参数（接口规范中的非“必须”参数），如果没有使用，则无需参与拼接。这样可以增强接口参数的可扩展性。
    - 将百度支付SDK合作密钥作为最后一个参数，参数名为key，参数值就是百度支付SDK合作密钥本身
    - 将请求参数按上述顺序用&拼接起来

需要注意的是：在签名时，如果参数的值包括&、@等特殊字符或中文，这些字符需要保持原样，不要做URL编码。发送HTTP请求时，是需要进行URL编码的。

- 用指定的摘要算法对待签名数据进行摘要，生成签名数据（不区分大小写），作为附加的请求参数sign的值。

##### 下面是一个使用MD5算法进行签名的示例：

```
gn = 
MD5(currency=1&extra=&goods_category=1&goods_channel=baidu&goods_channel_sp=0001&goods_desc=商品描述 &goods_name=商品1&goods_url=http://item.jd.com/736610.html&input_charset=1&order_create_time=20130508131702&order_no=1372323335119&pay_type=2&return_url=http://item.jd.com/736610.html&service_code=1&sign_method=1&sp_no=1210010002&total_amount=1&transport_amount=0&unit_amount=1&unit_count=1&key=XXXXXXXXXXXXXXXX)
= 39375042FD5F801C2B0A128B145589C3
其中，goods_name和goods_desc的值（红字部分）应该是按照input_charset编码后的结果。
```


下面解释一下为什么签名之前，需要对中文进行特定的编码。
相同的字符串(包括中文)，如果内部编码格式不同，那么对应的字节流可能也不相同。MD5等摘要算法是对字节流进行操作的。因此，相同字符串的摘要结果未必相同，取决于内部编码。
商户和百度支付SDK必须协商好中文的编码，才能成功验签。如果商户的请求参数中可能包含中文，那么必须指定input_charset参数，并按照input_charset进行编码后，才能签名。百度支付SDK收到请求数据后，使用相同的编码进行验签。

##### 签名参数
参数名 | 参数含义 | 格式说明 | 是否必须
---------- | ------------- | ------------ | ------------
service_code | 服务编号 | 整数，目前必须为1 | 是
_no | 百度钱包商户号 | 10位数字组成的字符串 | 是
order_create_time | 创建订单的时间 | YYYYMMDDHHMMSS | 是
order_no | 订单号，商户须保证订单号在商户系统内部唯一。 | 不超过20个字符 | 是
goods_category | 商品分类号。 | 取值由钱包系统分配 | 否
goods_name | 商品的名称 | 允许包含中文；不超过128个字符或64个汉字 | 是
goods_desc | 商品的描述信息 | 允许包含中文；不超过255个字符或127个汉字 | 是
goods_url | 商品在商户网站上的URL。 | URL | 否
unit_amount | 商品单价，以分为单位 | 非负整数 | 否
unit_count | 商品数量 | 非负整数 | 否
transport_amount | 运费 | 非负整数 | 否
total_amount | 总金额，以分为单位 | 非负整数 | 是
currency | 币种，默认人民币 | 取值范围参见附录 | 是
buyer_sp_username | 买家在商户网站的用户名 | 允许包含中文；不超过64字符或32个汉字 | 否
return_url | 百度钱包主动通知商户支付结果的URL | 仅支持http(s)的URL。 | 是
pay_type | 支付方式 | 默认取值2 | 是
expire_time | 交易的超时时间 | YYYYMMDDHHMMSS，不得早于交易创建的时间。 | 否
input_charset | 请求参数的字符编码 | 取值范围参见附录 | 是
version | 接口的版本号 | 必须为2 | 是
sign_method | 签名方法 | 取值范围参见附录 | 是
extra  | 商户自定义数据 | 不超过255个字符 | 否


- 说明：上述这些参数需要参照签名机制生成sign参数。


##### 不参与签名参数


参数名 | 参数含义 | 格式说明 | 是否必须
---------- | ------------- | ------------ | ------------
goods_channel_sp | 数字商品开发商 | 10位数字组成的字符串 | 否
goods_channel | 数字商品渠道 | 商户与渠道商提前约定好，字符串，字母和数字的组合，不能包含其他特殊字符,不超过20为字符串 | 否


- 说明：这俩个参数主要用于数字产品的交易统计。

##### 附录
- 币种列表

取值 | 含义
---------- | ------------- 
1 | 人民币

- 摘要算法列表

取值 | 含义
---------- | ------------- 
1 | MD5
2 | SHA-1

- 字符编码列表

取值 | 含义
---------- | ------------- 
1 | GBK
