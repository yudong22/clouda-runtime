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
 
	clouda.lightapp(apikey); 

参数 | 类型 | 描述 
------------ | ------------- | ------------
apikey | string | 轻应用的APIKEY,获取方法参考[开发指南](http://cloudajs.org/lightapp/docs/dev_guide)

##系统通用的状态码信息

    clouda.STATUS.SUCCESS ： 成功(非0)
    clouda.STATUS.SYSTEM_FAILURE ： 系统错误
    clouda.STATUS.USER_CANCELED ： 用户取消操作(-2)
    
###系统通用的成功信息
具体格式参考文档，一般来说类型有string,object

###系统通用的取消码信息
当用户在使用设备能力api未完成而取消时，触发onfail函数，其中错误码信息如下

    {result:-2,error_info:"canceled."}

###系统通用的错误码信息
    
    {result:1,error_info:"some errors readable."}

## 本地设备能力类API##
    clouda.device

本地设备能力类API目前支持以下功能：

- 网络连接状态(Connection)
- 设备信息（Device）
- 地理位置(Geolocation)
- 本地媒体功能（Media）
- 二维码（QRCode）


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
- getSysVersion(options)- getDeviceModelName(options)- getScreenSize(options)

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

**返回的screen对象

参数 | 类型 | 描述 
------------ | ------------- | ------------
width | int | 宽度
height | int | 高度
pixelDepth | int | 颜色分辨率
colorDepth | int | 色深

### Geolocation ###
    clouda.device.geolocation

地理位置

**方法：**

- get(options)

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

**返回的地理信息对象

参数 | 类型 | 描述 
------------ | ------------- | ------------
accuracy | float | 精确度(单位米)
longitude | float | 经度
latitude | float | 纬度


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
        <td>操作成功，返回 MediaFile 对象</td>  
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
        - clouda.device.MEDIA_SOURCE.ALBUM
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
play | 开始或继续播放音频文件，操作成功播放完成后返回SUCCESS状态码；操作失败，则返错误码信息
stop | 停止播放音频文件，操作成功返回SUCCESS状态码；操作失败，则返错误码信息


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
