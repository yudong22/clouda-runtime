#百度轻应用API参考文档#

----------
更新日期： 2014/03/03 16:27:32  

问题反馈： [clouda-support@baidu.com](mailto:clouda-support@baidu.com)


## 概述 ##

百度轻应用API是一套使用JavaScript语言提供的应用工具接口，方便快捷的实现轻应用开发。

百度轻应用API包括三类API：

- 本地设备能力类： **clouda.device**
- 云服务类：   **clouda.mbaas**
- 触摸事件与手势处理类：  **clouda.touch**

## 命名空间

百度轻应用API统一使用的命名空间为：

    clouda

## 服务开启及设置

开发轻应用前，需要先到百度开放云[管理控制台](http://developer.baidu.com/console)<font color="red">创建应用，获取应用 API Key，并开启或设置相关服务</font>。

如需使用以下云服务的相关API，请点击百度开放云[管理控制台](http://developer.baidu.com/console)所创建的应用下的相关服务的管理控制台进行服务开启及设置相关操作（<font color="red">无需等待审核通过，即可使用</font>）：
	
- **语音识别服务（VTT）**：申请开启服务，详见：[《语音技术管理控制台》](http://developer.baidu.com/wiki/index.php?title=docs/cplat/media/voice/console)
	
## 引用JS API文件

在HTML页面中添加以下代码：

    <script name="baidu-tc-cerfication" type="text/javascript" charset="utf-8" src="http://apps.bdimg.com/cloudaapi/lightapp.js"></script>

如果页面是使用https加密链接的时，请内嵌如下代码

    <script name="baidu-tc-cerfication" type="text/javascript" charset="utf-8" src="https://openapi.baidu.com/cloudaapi/lightapp.js"></script>

## App信息注册API ##

调用以下接口，注册所要开发的轻应用的 App 信息：
 
	clouda.lightapp(apikey)

##系统通用的状态码信息
    clouda.STATUS.SUCCESS ： 成功(非0)
    clouda.STATUS.SYSTEM_FAILURE ： 系统错误
    clouda.STATUS.USER_CANCELED ： 用户取消操作

## 本地设备能力类API##
    clouda.device

本地设备能力类API目前支持以下功能：

- 调起应用 (Activity)
- 电池（Battery）
- 网络连接状态(Connection)
- 设备信息（Device）
- 文件管理（FileSystem）
- 系统语言信息 (Globalization)- 地理位置（Geolocation）
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
onsuccess | function(data){} | 操作成功，返回成功
onfail | function(err){} | 操作失败，返回错误码信息 
intent | object | 参考android调起应用参数[intent](http://developer.android.com/reference/android/content/Intent.html)



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

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>level</td>
			<td>float</td>          
			<td>电量百分比</td>  
		</tr>
        <tr>
			<td>isPlugged</td>
			<td>boolean</td>            
			<td>电池充电状态，默认false，未充电</td>  
		</tr>
    <tbody>
</table>

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

- options 是一个object，同get(options)中的options说明。


### Connection ###

     clouda.device.connection
    
网络连接

**方法：**

- get(options)
- startListen(options)
- stopListen()   

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
			<td>操作成功，data是返回的ConnectionStatus</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
	</tbody>
</table>

**返回的ConnectionStatus对象**

网络连接状态类型：

	clouda.device.CONNECTION_STATUS.UNKNOWN // 未知状态
    clouda.device.CONNECTION_STATUS.NONE // 断开状态
    clouda.device.CONNECTION_STATUS.WIFI // WIFI连通状态
    clouda.device.CONNECTION_STATUS.CELL_2G // 移动数据2G连通状态
    clouda.device.CONNECTION_STATUS.CELL_3G // 移动数据3G连通状态
    clouda.device.CONNECTION_STATUS.CELL_4G // 移动数据4G连通状态
	clouda.device.CONNECTION_STATUS.CELL // 移动数据通连通状态
	clouda.device.CONNECTION_STATUS.ETHERNET // 以太网连通状态


#### startListen ####
    startListen(options)

**功能描述：**

监听网络连接状态

**参数说明：**

options：参数说明同clouda.device.connection.get(options)中的options说明。

#### stopListen ####
    stopListen()

**功能描述：**

停止监听网络连接状态



### Device ###

	clouda.device.device

设备信息

**方法：**

- getUuid(options)
- getSysVersion(options)- getDeviceModelName(options)- getScreenSize(options)

#### getUuid ####
	getUuid(options)

**功能描述：**

获取设备的全球唯一标识符（UUID），UUID由设备生产商及特定设备平台或型号所决定

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


### FileSystem ###

    clouda.device.fs

文件管理

**方法：**

- post(path,target,options)
- download(url, name, options)
- abort()
- remove(path, options)
- empty()
- count(options)
- getInfo(path, options)  
- getInfoByOffset(offset, options) 

#### post ####
    post(path,target,options)

**功能描述：**

将本地文件以POST方式上传至指定URL

**参数说明：**

- path : 为 string 类型，本地文件的path(全路径，包含文件名)
- target : 为 string 类型，目标地址URL(仅HTTP/HTTPS)
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
			<td>操作成功，返回的 data 是目标URL返回的结果</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
        <tr>
			<td>param</td>
			<td>object</td>           
			<td>伴随文件上传，传递的POST数据（可选）</td>  
		</tr>
        <tr>
			<td>onprogress</td>
			<td>function(data){}</td>           
			<td>上传进度，返回的 data 是 Progress 对象</td>  
		</tr>
        <tr>
			<td>uploadKey</td>
			<td>string</td>           
			<td>上传表单中的key</td>  
		</tr>
	</tbody>
</table>

**返回的 Progress 对象：**

文件上传或下载进度信息

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>total</td>
			<td>int</td>           
			<td>文件大小总长，单位：字节；如果无法获取，则返回 -1 </td>  
		</tr>
        <tr>
			<td>loaded</td>
			<td>int</td>          
			<td>已传输的文件大小，单位：字节</td>  
		</tr>
	</tbody>
</table>

#### download ####
    download(url, name, options)

**功能描述：**

将指定URL的文件下载到本地

**参数说明：**

- url : 要下载文件的URL, string类型
- name : 下载后的文件名，string类型
- options :
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
			<td>操作成功，data是文件下载到本地存储的本地路径</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
        <tr>
			<td>onprogress</td>
			<td>function(data){}</td>           
			<td>下载进度，返回的 data 是 Progress 对象</td>  
		</tr>
	</tbody>
</table>

**返回的 Progress 对象：**

文件上传或下载进度信息

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>total</td>
			<td>int</td>           
			<td>文件大小总长，单位：字节；如果无法获取，则返回 -1 </td>  
		</tr>
        <tr>
			<td>loaded</td>
			<td>int</td>          
			<td>已传输的文件大小，单位：字节</td>  
		</tr>
	</tbody>
</table>

#### abort ####
    abort()

**功能描述：**

取消上传或下载

#### remove ####
    remove(path, options)

**功能描述：**

删除本地文件，仅支持移除当前API KEY所属应用的文件

**参数说明：**

- path : 本地文件的path(全路径，包含文件名), string 类型
- options :  为 object 类型，其中包含以下参数：
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
			<td>操作成功，返回clouda.STATUS.SUCCESS</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
	</tbody>
</table>

#### empty ####
    empty()

**功能描述：**

清空当前API KEY所属应用的所有本地文件

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
			<td>操作成功，返回SUCCESS状态码</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
	</tbody>
</table>

#### count ####
    count(options)

**功能描述：**

获取当前API KEY所属应用的所有本地文件数量

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
			<td>操作成功，返回总数量</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
	</tbody>
</table>

#### getInfo ####

	 getInfo(path, options) 或 getInfoByOffset(offset, options)

**功能描述：**

通过path或从零起始的offset获取本地文件信息

**参数说明：**

- path : 为 string 类型，本地文件的path(全路径，包含文件名)
- offset ： 为 int 类型，从零起始，获取第一个匹配元素的偏移坐标
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
			<td>操作成功，返回 File 对象</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
	</tbody>
</table>

**返回的 File 对象**

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>name</td>
			<td>string</td>          
			<td>文件名，不含路径信息</td>  
		</tr>
        <tr>
			<td>fullPath</td>
			<td>string</td>            
			<td>文件本地全路径（含文件名）</td>  
		</tr>
        <tr>
			<td>type</td>
			<td>string</td>            
			<td>文件的MIME类型</td>  
		</tr>
        <tr>
			<td>lastModifiedDate</td>
			<td>date</td>            
			<td>文件最后修改时间</td>  
		</tr>
        <tr>
			<td>size</td>
			<td>number</td>            
			<td>文件大小，单位：字节(bytes)</td>  
		</tr>
	</tbody>
</table>

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
onsuccess | function(data){} | 操作成功，返回用户语言信息
onfail | function(err){} | 操作失败，返回错误码信息 




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
		<td>获取地理信息成功</td>  
	</tr>
    <tr>
		<td>onfail</td>
		<td>function(err){}</td>            
		<td>获取地理信息失败，返回错误码</td>  
	</tr>
    <tr>
		<td>method</td>
		<td>number</td>          
		<td>定位的方式，可选择以下类型：<br>
		- clouda.device.LOCATION_METHOD.BASE_STATION : 基站<br>
		- clouda.device.LOCATION_METHOD.GPS : GPS(默认)
		</td>  
	</tr>
    <tr>
		<td>timeout</td>
		<td>number</td>          
		<td>接口超时最大时间，单位毫秒，超时后会执行onfail</td>  
	</tr>
    <tr>
		<td>maximumAge</td>
		<td>number</td>          
		<td>获取某个缓存地理位置信息的最大时间段，单位：毫秒，超出则进行重新获取</td>  
	</tr>
</tbody>
</table>

#### startListen ####
    startListen(options)

**功能描述：**

监听地理位置信息。

启动对有大幅变化的地理位置进行监听。调用后立即触发一次回调，报告当前位置，后续只在地理位置发生变动时方通知。

**参数说明：**

除significant以外，options其他字段同get(options)中的相关说明

- significant : 是否仅在位置发生大幅变化时进行回调，boolean类型，默认false(相当于省电模式)。<font color="red">目前大幅变化阈值设置为20米，不支持自定义配置。</font>

#### stopListen ####
    stopListen()

**功能描述：**

停止监听地理位置信息。



### Media ###
	clouda.device.media

本地媒体功能

**方法：**

- captureMedia(options)
- operateMedia(link, operator, options)    

#### CaptureMedia ####
    captureMedia(options)

**功能描述：**

调取本地录音、照相、视频功能；拍摄、录制、拍照及读取本地图片文件。

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
		<td>操作成功，返回 MediaFile 对象（适用于功能操作对象唯一，且options.details参数为true的情况下）或其组成的数组，如[MediaFile, MediaFile]</td>  
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
		 - clouda.device.MEDIA_TYPE.AUDIO  <br>  
		 - clouda.device.MEDIA_TYPE.VIDEO</td>  
	</tr>
	<tr>
		<td>source</td>
		<td>string</td>
		<td>仅在mediaType为IMAGE或VIDEO时可设置：<br>
		- clouda.device.MEDIA_SOURCE.CAMERA<br>
		- clouda.device.MEDIA_SOURCE.ALBUM 
		</td>  
	</tr>
    <tr>
		<td>limit</td>
		<td>number</td>
		<td>媒体文件个数限制，仅当source为ALBUM时可用，默认为1</td>  
	</tr>
    <tr>
		<td>duration</td>
		<td>number</td>      
		<td>录音或拍摄最大时长，单位为秒。仅AUDIO和VIDEO可用，默认为0，即不限时长</td>  
	</tr>
    <tr>
		<td>format</td>
		<td>string</td>
		<td>返回数据格式，参数如下：<br>
		- clouda.device.MEDIA_FORMAT.FILE：  MediaFile对象 (默认) <br>
		- clouda.device.MEDIA_FORMAT.BASE64：仅适用于image，即Base64编码字符串
		</td>  
	</tr>
    <tr>
		<td>details</td>
		<td>boolean</td>
		<td>是否返回文件的所有属性信息，默认：false，返回的 MediaFile 对象只显示5个基本信息
		</td>  
	</tr>
<tbody>
</table>

**返回的MediaFile对象**

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>name</td>
			<td>string</td>          
			<td>文件名，不含路径信息</td>  
		</tr>
        <tr>
			<td>fullPath</td>
			<td>string</td>            
			<td>文件本地全路径（含文件名）</td>  
		</tr>
        <tr>
			<td>type</td>
			<td>string</td>            
			<td>文件的MIME类型</td>  
		</tr>
        <tr>
			<td>lastModifiedDate</td>
			<td>date</td>            
			<td>文件最后修改时间</td>  
		</tr>
        <tr>
			<td>size</td>
			<td>number</td>            
			<td>文件大小，单位：字节(bytes)</td>  
		</tr>
        <tr>
			<td>height</td>
			<td>number</td>            
			<td>图像或视频高度，音频文件时该值为0，单位：像素, 仅在options.details为true时返回</td>  
		</tr>
        <tr>
			<td>width</td>
			<td>number</td>            
			<td>图像或视频宽度，音频文件时该值为0，单位：像素，仅在options.details为true时返回</td>  
		</tr>
        <tr>
			<td>duration</td>
			<td>number</td>            
			<td>视频或音频文件时长，图像文件时该值为0，单位：秒，仅在options.details为true时返回</td>  
		</tr>
    <tbody>
</table>


#### operateMedia ####
    operateMedia(link, operator, options)

**功能描述：**

录制和回放指定路径的音频文件

**参数说明：**

- link : 为 string 类型，本地音频文件路径或 Web 音频文件的 URI
- operator ： 为 string 类型，所支持的对音频文件的具体操作类型如下：
   <table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
   <tbody>
    <tr>
        <th>方法</th>
        <th>描述</th>
    </tr>
    <tr>
		<td>getCurrentPosition</td>      
		<td>返回音频文件的当前播放位置，操作成功的返回值为 int 类型的当前秒数（s）；操作失败，则返错误码
		</td>  
	</tr>
    <tr>
		<td>getDuration</td>         
		<td>返回音频文件的总时长，操作成功的返回值为 int 类型的总时长（单位：秒数）；操作失败，则返错误码</td>  
	</tr>
    <tr>
		<td>play</td>
		<td>开始或继续播放音频文件，操作成功返回SUCCESS状态码；操作失败，则返错误码</td>           
	</tr>
    <tr>
		<td>pause</td>
		<td>暂停播放音频文件，操作成功返回SUCCESS状态码；操作失败，则返错误码</td>          
	</tr>
    <tr>
		<td>release</td>
		<td>释放底层操作系统的音频资源，操作成功返回SUCCESS状态码；操作失败，则返错误码</td>          
	</tr>
    <tr>
		<td>seekTo</td>
		<td>移动音频文件的播放位置。此操作类型下，options中需包含以下三个参数：<br>
		- time: int 类型，设置音频文件重放位置，单位：毫秒  <br>
		- onsuccess:  操作成功返回SUCCESS状态码   <br>
		- onfail: 操作失败，则返错误码</td>          
	</tr>
    <tr>
		<td>setVolume</td>
		<td>设置播放音量，此操作类型下，options中需包含以下三个参数：<br>
		- volume: float 类型，设置音频文件播放音量，取值范围为[0.0, 1.0]  <br>
		- onsuccess:  操作成功返回SUCCESS状态码  <br>
		- onfail: 操作失败，则返错误码</td>           
	</tr>
    <tr>
		<td>startRecord</td>
		<td>开始录制音频文件，操作成功返回SUCCESS状态码；操作失败，则返错误码</td>            
	</tr>
    <tr>
		<td>stopRecord</td>
		<td>停止录制音频文件，操作成功返回SUCCESS状态码；操作失败，则返错误码</td>          
	</tr>
    <tr>
		<td>stop</td>
		<td>停止播放音频文件，操作成功返回SUCCESS状态码；操作失败，则返错误码</td>          
	</tr> 
	</tr>
	</tbody>
</table> 

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
		<td>操作成功，data返回信息，详见 operate 参数说明</td>  
	</tr>
    <tr>
		<td>onfail</td>
		<td>function(err){}</td>          
		<td>操作失败，返回错误码</td>  
	</tr>
    <tr>
		<td>onstatus</td>
		<td>function(data){}</td>          
		<td>可选，当音频文件状态发生变化的时候调用的回调函数，其返回值如下：<br>
		- clouda.device.MEDIA_STATUS.NONE = 0;<br>
		- clouda.device.MEDIA_STATUS.STARTING = 1;<br>
		- clouda.device.MEDIA_STATUS.RUNNING = 2;<br>
		- clouda.device.MEDIA_STATUS.PAUSED = 3;<br>
		- clouda.device.MEDIA_STATUS.STOPPED = 4;
	</td>  
	</tr>
<tbody>
</table>


### QRCode ###
     clouda.device.qr

二维码、条形码类

**方法：**

- startCapture(options)
- generate(content,options)

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

#### generate ####

    generate(content,options)

**功能描述：**

生成二维码或条形码

**参数说明：**

- content：string，二维码内容
- options：为object类型，其中包含以下参数：
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
			<td>二维码生成成功，返回base64编码的字符串</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>二维码生成失败</td>  
		</tr>
		
    <tbody>
</table>


## 云服务类API ##
	clouda.mbaas

云服务类API目前支持以下功能： 

- 订阅应用 (Scribe)
- 语音识别服务（VTT）

### Scribe
    clouda.mbaas.scribe

包含订阅轻应用，创建桌面快捷方式等方法 

**方法：** 

- register(id,options)
- checkStatus(id,options)
- addShortcut(id,options)

#### register #### 
  register(id,options)

**功能描述：** 

订阅轻应用

**参数说明：** 

- id：string，轻应用的id
- options：为 object 类型，其中包括以下参数： 

#### checkStatus #### 
  checkStatus(id,options)

**功能描述：** 

检查轻应用id是否已订阅

**参数说明：** 

- id：string，轻应用的id
- options：为 object 类型，其中包括以下参数： 


#### addShortcut #### 
  addShortcut(id,options)

**功能描述：** 

创建轻应用快捷方式到桌面

**参数说明：** 

- id：string，轻应用的id
- options：为 object 类型，其中包括以下参数： 



参数 | 类型 | 描述 
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功信息
onfail | function(err){} | 操作失败，返回错误码信息 

### VTT ###

    clouda.mbaas.vtt

语音识别服务
开发轻应用前，需要先申请语音服务的ak，sk和pid，并执行初始化init方法

**方法：**

- init(ak,sk,pid)
- showDialog(options)

#### init ####
	init(ak,sk,pid)

**功能描述：**

初始化所申请的ak，sk，pid等参数，然后方可使用语音识别服务

**参数说明：**

- ak ：所申请的语音服务的ak
- sk ：所申请的语音服务的sk
- pid：所申请的语音服务的pid

#### showDialog ####
    showDialog(options)

**功能描述：**

显示语音识别对话框，实现语音输入识别

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
			<td>识别成功，返回语音文字字符串</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>识别失败<br>
			- clouda.mbaas.VTT_STATUS.FAILED ：语音识别失败
			</td>  
		</tr>
        <tr>
			<td>speechMode</td>
			<td>int</td>            
			<td>设置识别模式，可选，其参数如下：<br>
			- clouda.mbaas.VTT_SPEECHMODE.SEARCH ：搜索模式 （默认）<br>
			- clouda.mbaas.VTT_SPEECHMODE.INPUT  ：文本输入模式
		</td>  
		</tr>
		<tr>
			<td>filename</td>
			<td>string</td>            
			<td>语音识别保存的文件名（可选）</td>  
			</td>  
		</tr>
		<tr>
			<td>uuid</td>
			<td>string</td>            
			<td>语音识别标识的uuid（可选）</td>  
		</tr>
		<tr>
			<td>sampleRate</td>
			<td>int</td>            
			<td>语音识别录音采样率（可选），其参数如下：<br>
			- clouda.mbaas.VTT_RATE.K8 ： （采样率8k）<br>
			- clouda.mbaas.VTT_RATE.K16  ：（采样率16k）</td>  
		</tr>
    </tbody>
</table>



## 手势事件处理类API ##
    clouda.touch

手势事件处理类API目前支持以下功能：

- 事件代理
- 事件绑定
- 解除事件代理
- 解除事件绑定
- 触发事件

### 事件代理

    touch.on( delegateElement, types, selector, callback );

**功能描述：** 

 事件代理方法。

**参数描述：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
			<th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
           <td>delegateElement</td>
           <td>element或string</td>
           <td>事件代理元素或选择器</td>
        </tr>
        <tr>
           <td>types</td>
           <td>string</td>
           <td>手势事件的类型, 可接受多个事件以空格分开；支持原生事件的透传。目前支持的具体事件类型，详见<a href="#001">《手势事件类型》</a>。</td>
        </tr>
        <tr>
           <td>selector</td>
           <td>string</td>
           <td>代理子元素选择器,</td>
        </tr>
        <tr>
           <td>callback</td>
           <td>function</td>
           <td>事件处理函数，如需了解手势库支持的新属性，详见<a href="#002">《事件对象》</a></td>
        </tr>
</tbody>
</table>

<a id='001'>**手势事件类型**</a>

支持的手势事件类型：

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>分类</th>
            <th>参数</th>
            <th>描述</th>
        </tr>
        <tr>
            <td rowspan="5">缩放</td>
            <td>pinchstart</td>
            <td>缩放手势起点</td>
        </tr>
        <tr>
            <td>pinchend</td>
            <td>缩放手势终点</td>
        </tr>
        <tr>
            <td>pinch</td>
            <td>缩放手势</td>
        </tr>
        <tr>
            <td>pinchin</td>
            <td>收缩</td>
        </tr>
        <tr>
            <td>pinchout</td>
            <td>放大</td>
        </tr>
		<tr>
            <td rowspan="3">旋转</td>
            <td>rotateleft</td>
            <td>向左旋转</td>
        </tr>
        <tr>
            <td>rotateright</td>
            <td>向右旋转</td>
        </tr>
        <tr>
            <td>rotate</td>
            <td>旋转</td>
        </tr>
		<tr>
            <td rowspan="8">滑动</td>
            <td>swipestart</td>
            <td>滑动手势起点</td>
        </tr>
        <tr>
            <td>swiping</td>
            <td>滑动中</td>
        </tr>
        <tr>
            <td>swipeend</td>
            <td>滑动手势终点</td>
        </tr>
        <tr>
            <td>swipeleft</td>
            <td>向左滑动</td>
        </tr>
        <tr>
            <td>swiperight</td>
            <td>向右滑动</td>
        </tr>
        <tr>
            <td>swipeup</td>
            <td>向上滑动</td>
        </tr>
        <tr>
            <td>swipedown</td>
            <td>向下滑动</td>
        </tr>
        <tr>
            <td>swipe</td>
            <td>滑动</td>
        </tr>
		<tr>
            <td>拖动</td>
            <td>drag</td>
            <td>拖动屏幕</td>
        </tr>
		<tr>
            <td>长按</td>
            <td>hold</td>
            <td>长按屏幕</td>
        </tr>
		<tr>
            <td rowspan="2">敲击</td>
            <td>tap</td>
            <td>单击屏幕</td>
        </tr>
        <tr>
            <td>doubletap</td>
            <td>双击屏幕</td>
        </tr>

</table>

<a id='002'>**事件对象**</a>

事件处理函数的第一个参数为事件对象，除了原生属性之外，百度手势库还提供了部分新属性。

以下为手势新增的属性：

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>属性</th>
            <th>描述</th>
        </tr>
        <tr>
           <td>originEvent</td>
           <td>触发某事件的原生对象</td>
        </tr>
		<tr>
           <td>type</td>
           <td>事件的名称</td>
        </tr>
		<tr>
           <td>rotation </td>
           <td>旋转角度</td>
        </tr>
		<tr>
           <td>scale</td>
           <td>缩放比例</td>
        </tr>
		<tr>
           <td>direction</td>
           <td>操作的方向属性</td>
        </tr>
		<tr>
           <td>fingersCount</td>
           <td>操作的手势数量</td>
        </tr>
		<tr>
           <td>position</td>
           <td>相关位置信息, 不同的操作产生不同的位置信息</td>
        </tr>
		<tr>
           <td>distance </td>
           <td>swipe类两点之间的位移</td>
        </tr>
		<tr>
           <td>distanceX</td>
           <td>swipe类事件x方向的位移</td>
        </tr>
		<tr>
           <td>distanceY</td>
           <td>swipe类事件y方向的位移</td>
        </tr>
		<tr>
           <td>angle</td>
           <td>swipe类事件触发时偏移角度</td>
        </tr>
		<tr>
           <td>duration</td>
           <td>touchstart 与 touchend之间的时间戳</td>
        </tr>
		<tr>
           <td>factor</td>
           <td>swipe事件加速度因子</td>
        </tr>
		<tr>
           <td>swipe事件加速度因子</td>
           <td>启动单指旋转方法，在某个元素的touchstart触发时调用</td>
        </tr>
    </tbody>
</table>

### 事件绑定

    touch.on( element, types, callback );

**功能描述：** 

事件绑定方法，根据参数区分事件绑定和事件代理。

**参数描述：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
           <td>element</td>
           <td>element或string</td>
           <td>事件绑定元素或选择器</td>
        </tr>
        <tr>
           <td>types</td>
           <td>string</td>
           <td>事件的类型, 可接受多个事件以空格分开，支持原生事件的透传。具体参数说明，同“事件代理”方法中的“types”参数说明。</td>
        </tr>
        <tr>
           <td>callback</td>
           <td>function</td>
           <td>事件处理函数，具体参数说明，同“事件代理”方法中的“callback”参数说明。
        </td>
        </tr>
</tbody>
</table>

### 解除事件代理

    touch.off( delegateElement, types, selector, callback )

**功能描述：** 

解除某元素上的事件代理。

**参数描述：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
           <td>delegateElement</td>
           <td>element或string</td>
           <td>元素对象或选择器</td>
        </tr>
        <tr>
           <td>types</td>
           <td>string</td>
           <td>事件的类型，具体参数说明，同“事件代理”方法中的“types”参数说明。</td>
        </tr>
        <tr>
           <td>selector</td>
           <td>string</td>
           <td>代理子元素选择器</td>
        </tr>
        <tr>
           <td>callback</td>
           <td>function</td>
           <td>事件处理函数, 移除函数与绑定函数必须为同一引用。具体参数说明，同“事件代理”方法中的“callback”参数说明。</td>
        </tr>
</tbody>
</table>

### 解除事件绑定

    touch.off( element, types, callback )

**功能描述：** 

解除某元素上的事件绑定，根据参数区分事件绑定和事件代理。

**参数描述：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
           <td>element</td>
           <td>element或string</td>
           <td>元素对象、选择器</td>
        </tr>
        <tr>
           <td>types</td>
           <td>string</td>
           <td>事件的类型，具体参数说明，同“事件代理”方法中的“types”参数说明。</td>
        </tr>
        <tr>
           <td>callback</td>
           <td>function</td>
           <td>事件处理函数, 移除函数与绑定函数必须为同一引用;具体参数说明，同“事件代理”方法中的“callback”参数说明。</td>
        </tr>
</tbody>
</table>

### 触发事件
    touch.trigger(element, type);

**功能描述：** 

触发某个元素上的某事件。

**参数描述：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
           <td>element</td>
           <td>element或string</td>
           <td>元素对象或选择器</td>
        </tr>
        <tr>
           <td>type</td>
           <td>string</td>
           <td>事件的类型，具体参数说明，同“事件代理”方法中的“types”参数说明。</td>
        </tr>
</tbody>
</table>
