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

调用以下接口，注册所要开发的轻应用的 App 信息：
 
	clouda.lightapp(apikey,callback) //callback是js全部加载完执行的回调函数

参数 | 类型 | 描述 
------------ | ------------- | ------------
apikey | string | 轻应用的APIKEY,获取方法参考[开发指南](http://cloudajs.org/lightapp/docs/dev_guide)
callback | function(){} | 加载完成，执行api方法 

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
- stopListen()

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
    stopListen()

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

- 轻应用（App）

### App ###
    clouda.mbaas.app

轻应用相关接口，关注，检查是否关注等功能 

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
