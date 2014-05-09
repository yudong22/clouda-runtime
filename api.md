#百度轻应用API参考文档#

----------
更新日期： 2013/12/20 14:27:32  

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
	
- **人脸识别（FaceRecognition）**：申请开启服务，详见：[《人脸识别管理控制台》](http://developer.baidu.com/wiki/index.php?title=docs/cplat/media/face/console)
- **推送服务（Push）**： 无需申请开启服务，但需要通过管理控制台进行推送，详见：[《轻应用推送操作手册》](http://bcs.duapp.com/clouda-api/%E8%BD%BB%E5%BA%94%E7%94%A8%E6%8E%A8%E9%80%81%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf)
- **语音识别服务（VTT）**：申请开启服务，详见：[《语音技术管理控制台》](http://developer.baidu.com/wiki/index.php?title=docs/cplat/media/voice/console)
- **百度地图（Map）**: 申请百度地图的密钥（API Key）：[申请地址](http://lbsyun.baidu.com/apiconsole/key?application=key）

## 引用JS API文件

在HTML页面中添加以下代码：

    <script name="baidu-tc-cerfication" type="text/javascript" charset="utf-8" src="http://apps.bdimg.com/cloudaapi/lightapp.js"></script>

如果页面是使用https加密链接的时，请内嵌如下代码

    <script name="baidu-tc-cerfication" type="text/javascript" charset="utf-8" src="https://openapi.baidu.com/cloudaapi/lightapp.js"></script>

## App信息注册API ##

注册API的方法有以下两种，区别在于第一种是全功能的，而第二种功能仅支持勾选的模块。

1. 注册所要开发的轻应用的 App 信息，并下载全功能的api：
 
		clouda.lightapp(apikey); 

参数 | 类型 | 描述 
------------ | ------------- | ------------
apikey | string | 轻应用的APIKEY,获取方法参考[开发指南](http://cloudajs.org/lightapp/docs/dev_guide)

2. 如果仅使用几个模块，初始化api，可以使用如下方法:
 
		clouda.lightInit({
			ak:apikey,
			module:["app","account"]//根据勾选的模块生成
		});

参数 | 类型 | 描述 
------------ | ------------- | ------------
apikey | string | 轻应用的APIKEY,获取方法参考[开发指南](http://cloudajs.org/lightapp/docs/dev_guide)
module | Array | 轻应用的具体模块,获取方法参考[模块化加载](http://http://cloudajs.org/lightapp/api-product)


##系统通用的状态码信息
    clouda.STATUS.SUCCESS ： 成功(非0)
    clouda.STATUS.SYSTEM_FAILURE ： 系统错误
    clouda.STATUS.USER_CANCELED ： 用户取消操作

## 本地设备能力类API##
    clouda.device

本地设备能力类API目前支持以下功能：

- 加速感应器(Accelerometer)
- 电池（Battery）
- 指南针(Compass)
- 网络连接状态(Connection)
- 联系人(Contact)
- 设备信息（Device）
- 文件管理（FileSystem）
- 地理位置（Geolocation）
- 陀螺仪感应器（Gyroscope）
- 本地存储（LocalStorage）
- 本地媒体功能（Media）
- 消息通知(Notification)
- 二维码（QRCode）
- 截屏分享（Screen）

### Accelerometer ###

    clouda.device.accelerometer

**功能描述：**

加速感应器

**方法：**

- get(options)
- startListen(options)
- stopListen()

#### get ####
	get(options)

**功能描述：**

捕获设备x,y,z轴方向的加速度信息

**参数说明：**

- options： 为 object 类型，其中包含以下参数：

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>返回</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>onsuccess</td>
			<td>function(data){}</td>          
			<td>获取加速度信息成功，data是返回的Acceleration对象信息</td>  
		</tr>
		<tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>获取失败，返回错误码</td>  
		</tr>
        <tr>
			<td>frequency</td>
			<td>number</td>            
			<td>加速度信息获取频率设置，默认为10000，单位：毫秒</td>  
		</tr>
    <tbody>
</table>

**返回的Acceleration对象：**

特定时间点采集到的加速度信息。
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>x</td>
			<td>number</td>          
			<td>x轴加速度数据，[0,1)之间</td>  
		</tr>
        <tr>
			<td>y</td>
			<td>number</td>            
			<td>y轴加速度数据，[0,1)之间</td>  
		</tr>
		<tr>
			<td>z</td>
			<td>number</td>          
			<td>z轴加速度数据，[0,1)之间</td>  
		</tr>
		<tr>
			<td>timestamp</td>
			<td>number</td>          
			<td>获取加速度数据时的时间戳，单位：毫秒</td>  
		</tr>
    <tbody>
</table>

#### startListen ####

    startListen(options)

**功能描述：**

监听设备x,y,z轴方向的加速度信息

**参数说明：**

同get(options)中的参数说明。


#### stopListen ####

    stopListen()

**功能描述：**

停止监听设备x,y,z轴方向的加速度信息


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

### Compass ###

    clouda.device.compass

**功能描述：**
指南针功能

**方法：**

- get(options)
- startListen(options)
- stopListen()

#### get ####
    get(options)

**功能描述：**

获取设备当前朝向信息

**参数说明：**

options ： 为 object 类型，其中包括以下参数：

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
			<td>操作成功，data是返回的Compass对象</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>
			<td>操作失败，获取方向信息失败，返回错误码</td>  
		</tr>
	</tbody>
</table>

**返回的Compass对象**

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>magneticHeading</td>
			<td>number</td>          
			<td>指南针在某一时刻的朝向，范围[0-359.99]度</td>  
		</tr>
        <tr>
			<td>trueHeading</td>
			<td>number</td>            
			<td>指南针在某一时刻相对于北极的朝向，取值范围是[0-359.99]度；若为负值则表明该参数不确定</td>  
		</tr>
        <tr>
			<td>headingAccuracy</td>
			<td>number</td>            
			<td>实际度数和记录度数之间的偏差</td>  
		</tr>
        <tr>
			<td>timestamp</td>
			<td>number</td>            
			<td>指南针朝向信息的获取时间，精确到毫秒</td>  
		</tr>
    <tbody>
</table>

#### startListen ####
    startListen(options)

**功能描述：**

监听指南针信息

**参数说明：**

options是一个对象，其中包括以下参数：

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
			<td>操作成功，获取方向信息；同compass.get(options)中的参数说明。</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>           
			<td>操作失败，获取方向信息失败，返回错误码</td>  
		</tr>
        <tr>
			<td>frequency</td>
			<td>number</td>          
			<td>获取方向信息频率设置，可选，单位毫秒，默认100 </td>  
		</tr>
	</tbody>
</table>

#### stopListen ####
    stopListen()

**功能描述：**

停止监听指南针信息

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


### Contact ###
    clouda.device.contact

联系人类。

**方法：**

- find(field, options)
- count(options)    
- getCursor(field, cursorOffset, length， options)    
- insert(data, options)
- update(contact, data, options)
- remove(contact, options)

#### find ####
    find(field, options)

**功能描述：**

查找并选择联系人

**参数说明：**

- field: 为array类型, 其中的元素是“Contact对象”中的“参数”字段组合。表示查找条件。
		
   举例：

   1.全选：可用`["*"]`

   2.自定义选择：
	["displayName", "phoneNumbers", "emails"]

- options: 为object，其中包括以下参数：

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
			<td>操作成功，data是返回的是“Contact对象”组成的数组</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
		<tr>
			<td>filter</td>
			<td>string</td>          
			<td>筛选条件，可选参数，默认为空</td>  
		</tr>
		<tr>
			<td>multiple</td>
			<td>boolean</td>          
			<td>是否返回多个返回联系人信息，默认：flase</td>  
		</tr>
    <tbody>
</table>

**Contact对象：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>id</td>
			<td>string</td>           
			<td>联系人ID，全局唯一标识符，标识通讯录中的一个联系人</td>  
		</tr>
        <tr>
			<td>displayName</td>
			<td>string</td>           
			<td>姓名</td>  
		</tr>
        <tr>
			<td>nickname</td>
			<td>string</td>           
			<td>昵称</td>  
		</tr>
        <tr>
			<td>phoneNumbers</td>
			<td>array</td>           
			<td>电话（座机、手机等相同），详细说明参考“ContactField”对象</td>  
		</tr>
        <tr>
			<td>addresses</td>
			<td>array</td>           
			<td>联系地址，详细说明参考“ContactAddress”对象</td>  
		</tr>
        <tr>
			<td>emails</td>
			<td>array</td>           
			<td>电子邮件地址，详细说明参考“ContactField”对象</td>  
		</tr>
        <tr>
			<td>organizations</td>
			<td>array</td>           
			<td>组织，详细说明参考“ContactOrg”对象</td>  
		</tr>	
        <tr>
			<td>birthday</td>
			<td>string</td>           
			<td>生日</td>  
		</tr>
        <tr>
			<td>photos</td>
			<td>array</td>           
			<td>头像，详细说明参考“ContactField”对象</td>  
		</tr>
        <tr>
			<td>ims</td>
			<td>array</td>           
			<td>IM信息，详细说明参考“ContactField”对象</td>  
		</tr>
        <tr>
			<td>urls</td>
			<td>array</td>           
			<td>相关网页，如博客，详细说明参考“ContactField”对象</td>  
		</tr>
        <tr>
			<td>note</td>
			<td>string</td>           
			<td>备注</td>  
		</tr>
        <tr>
			<td>categories</td>
			<td>array</td>           
			<td>自定义类别，详细说明参考“ContactField”对象</td>  
		</tr>
	</tbody>
</table>

**ContactField对象：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>type</td>
			<td>string</td>           
			<td>字段类型，如“住宅”、“单位”等</td>  
		</tr>
        <tr>
			<td>value</td>
			<td>string</td>           
			<td>字段值（电话号码或email）</td>  
		</tr>
        <tr>
			<td>pref</td>
			<td>boolean</td>           
			<td>用户是否设置为首选项，true：设置为首选项</td>  
		</tr>
	</tbody>
</table>

**ContactAddress对象：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>type</td>
			<td>string</td>           
			<td>字段类型，如“住宅”、“单位”等</td>  
		</tr>
        <tr>
			<td>pref</td>
			<td>boolean</td>           
			<td>用户是否设置为首选项，true：设置为首选项</td>  
		</tr>
        <tr>
			<td>formatted</td>
			<td>string</td>           
			<td>完整地址显示格式</td>  
		</tr>
        <tr>
			<td>streeAddress</td>
			<td>string</td>           
			<td>完整街道地址</td>  
		</tr>
        <tr>
			<td>locality</td>
			<td>string</td>           
			<td>城市或地区</td>  
		</tr>
        <tr>
			<td>region</td>
			<td>string</td>           
			<td>省</td>  
		</tr>
        <tr>
			<td>country</td>
			<td>string</td>           
			<td>国家</td>  
		</tr>
        <tr>
			<td>postalCode</td>
			<td>string</td>           
			<td>邮编</td>  
		</tr>

	</tbody>
</table>

**ContactOrg对象：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>type</td>
			<td>string</td>           
			<td>字段类型，如“住宅”、“单位”等</td>  
		</tr>
        <tr>
			<td>name</td>
			<td>string</td>           
			<td>组织名称</td>  
		</tr>
        <tr>
			<td>pref</td>
			<td>boolean</td>           
			<td>用户是否设置为首选项，true：设置为首选项</td>  
		</tr>
        <tr>
			<td>department</td>
			<td>string</td>           
			<td>部门</td>  
		</tr>
        <tr>
			<td>title</td>
			<td>string</td>           
			<td>职务</td>  
		</tr>
	</tbody>
</table>

#### count ####
    count(options)

**功能描述：**

获取通讯录中的条目总数。

**参数说明：**

options: 为object，参数说明同find(field, options)中的options说明。

#### getCursor ####
    getCursor(field, cursorOffset, length， options)

**功能描述：**

读取联系人信息

**参数说明：**

- field : 同 find(field, options)中的field说明
- cursorOffset：为 int 类型， 指定位移的联系人，表示从第几个开始
- length : 为 int 类型，设置查询个数
- options：
   参数说明同find(field, options)中的options说明。

#### insert ####
    insert(data, options)

**功能描述：**

新增一个联系人条目

**参数说明：**

- data： find(field, options)接口中返回的“Contact对象”中的data信息。
- options：参数说明同clouda.device.contact.find(field, options)中的options说明。

#### update ####
    update(contact, data, options)

**功能描述：**

保存一个联系人条目

**参数说明：**

- contact： 为 array 类型，即 find(field, options)接口中所返回的Contact对象中的参数所组成的数组
- data： find(field, options)接口中返回的Contact对象中的data信息。
- options：参数说明同clouda.device.contact.find(field, options)中的options说明。

#### remove ####
    remove(contact, options)

**功能描述：**

删除一个联系人条目

**参数说明：**

- contact： 为 array 类型，即 find(field, options)接口中所返回的Contact对象中的参数所组成的数组
- options：参数说明同find(field, options)中的options说明。

### Device ###

	clouda.device.device

设备信息

**方法：**

- getUuid(options)

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

### Gyroscope ###
    clouda.device.gyro

陀螺仪感应器

**方法：**

- get(options)
- startListen(options)
- stopListen()

#### get ####
get(options)

**功能描述：**

捕获设备x,y,z轴方向的转动角度信息

**参数说明：**

- options ： 为 object 类型，其中包含以下参数：

<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>返回</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>onsuccess</td>
			<td>function(data){}</td>          
			<td>获取陀螺仪转动角度信息成功，data是返回的Gyroscope对象信息</td>  
		</tr>
		<tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>获取失败，返回错误码</td>  
		</tr>
        <tr>
			<td>frequency</td>
			<td>number</td>            
			<td>陀螺仪转动角度信息获取频率设置，默认为10000，单位：毫秒</td>  
		</tr>
    <tbody>
</table>

**返回的Gyroscope对象：**

特定时间点采集到的陀螺仪转动角度信息。
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>alpha</td>
			<td>number</td>          
			<td>x轴方向转动角度数据，[0,1)之间</td>  
		</tr>
        <tr>
			<td>beta</td>
			<td>number</td>            
			<td>beta轴方向转动角度数据，[0,1)之间</td>  
		</tr>
		<tr>
			<td>gamma</td>
			<td>number</td>          
			<td>gamma轴方向转动角度数据，[0,1)之间</td>  
		</tr>
		<tr>
			<td>timestamp</td>
			<td>number</td>          
			<td>获取陀螺仪转动角度数据数据时的时间戳，单位：毫秒</td>  
		</tr>
    <tbody>
</table>

#### startListen ####

    startListen(options)

**功能描述：**

监听设备x,y,z轴方向转动角度信息

**参数说明：**

同get(options)中的参数说明。

#### stopListen ####

    stopListen()

**功能描述：**

停止监听设备x,y,z轴方向转动角度信息

### LocalStorage ###
    clouda.device.localStorage

本地存储

**方法：**

- set(key,value, options)
- get(key,options)
- remove(key,options)
- count(options)
- empty()

#### set ####
    set(key, value, options)

**功能描述：**

保存数据到本地

**参数说明：**

- options(可选)：为object类型，其中包含以下参数：
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
			<td>操作成功，返回的data为SUCCESS状态码</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
	</tbody>
</table>

#### get ####
    get(key,options)

**功能描述：**

读取本地指定key的数据

**参数说明：**

options：为object类型，其中包含以下参数：
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>onsuccess</td>
			<td>function(value){}</td>           
			<td>操作成功，返回数据</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
	</tbody>
</table>

#### remove ####
    remove(key,options)

**功能描述：**

删除本地指定key的数据

**参数说明：**

同set(key, value, options)中的 key 和 options 参数说明

#### count ####
    count(options)

**功能描述：**

获取本地数据项的个数

**参数说明：**

options：是一个object类型，其中包含以下参数：
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
			<td>操作成功，返回总数</td>  
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

清空本地所有数据

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

### Notification ###
    
    clouda.device.notification

本地设备通知，可设置通知、震动或蜂鸣声提示。

**方法：**

- alert(msg, options)
- confirm(msg, options)
- beep(time)
- vibrate(time)
- prompt(msg, options)
- startLoad(title, msg, options)
- stopLoad(options)
- progress(title, msg, options)
- startProgress(title, msg, options)
- updateProgress(value)
- stopProgress()

#### alert ####
    alert(msg, options)

**功能描述：**

显示一个定制的警告或对话框

**参数说明：**

- msg : 为 string 类型，对话框信息
- options：为object类型，其中包括以下参数：
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>onsuccess</td>
			<td>function(){}</td>           
			<td>用户点击“OK”按钮</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码</td>  
		</tr>
        <tr>
			<td>title</td>
			<td>string</td>          
			<td>对话框标题，可选项，默认为：Alert</td>  
		</tr>
        <tr>
			<td>buttonName</td>
			<td>string</td>          
			<td>按钮名称，可选项，默认为：OK</td>  
		</tr>
	</tbody>
</table>

#### confirm ####
    confirm(msg, options)

**功能描述：**

显示一个可定制的确认对话框

**参数说明：**

- msg : 为 string 类型，对话框信息
- options ：为一个object，其中包括以下参数：
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>onsuccess</td>
			<td>function(){}</td>           
			<td>用户点击“OK”按钮 </td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败或用户点击“Cancel”，返回错误码</td>  
		</tr>
        <tr>
			<td>title</td>
			<td>string</td>          
			<td>对话框标题，可选项，默认为：Confirm</td>  
		</tr>
        <tr>
			<td>buttonLabels</td>
			<td>array</td>          
			<td>自定义按钮标签名，可选项，默认为：[OK，Cancel]</td>  
		</tr>
	</tbody>
</table>

#### beep ####
    beep(time)

**功能描述：**

设备将发出蜂鸣声，且可设定持续时长

**参数说明：**

- time : 为 int 类型， 蜂鸣的持续时间，单位：毫秒

#### vibrate ####
    vibrate(time)

**功能描述：**

使设备震动，且可设置指定的震动时长。

**参数说明：**

- time ： 为 int 类型， 设备震动时长，单位： 毫秒

#### prompt ####
    prompt(msg, options)

**功能描述：**

弹出一个定制化对话框

**参数说明：**

- msg : 为 string 类型，对话框信息
- options :为一个object，其中包括以下参数：
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>onsuccess</td>
			<td>function(){}</td>           
			<td>用户点击“确定”按钮 </td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败或用户点击取消，返回错误码</td>  
		</tr>
        <tr>
			<td>title</td>
			<td>string</td>          
			<td>对话框标题，可选项，默认为：OK</td>  
		</tr>
        <tr>
			<td>buttonLabels</td>
			<td>array</td>          
			<td>自定义按钮标签名，可选项，默认为：[OK，Cancel]</td>  
		</tr>
		<tr>
			<td>defaultText</td>
			<td>string</td>          
			<td>输入框默认文字， 默认为空</td> 
	</tbody>
</table>

#### startLoad ####
	startLoad(title, msg, options)

**功能描述：**

启动加载界面

**参数说明：**

- title : 为 string 类型， 对话框标题，可选项，默认为：OK
- msg : 为 string 类型，对话框信息
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
	</tbody>
</table>

#### stopLoad ####
	stopLoad(options)

**功能描述：**

停止加载界面

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
	</tbody>
</table>

#### progress ####
	progress(title, msg, options)

**功能描述：**

显示进度条

**参数说明：**

- title : 为 string 类型， 对话框标题，可选项，默认为：OK
- msg : 为 string 类型，对话框信息
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
	</tbody>
</table>

#### startProgress #### 
	startProgress(title, msg, options)

**功能描述：**

开始进度显示

**参数说明：**

- title : 为 string 类型， 对话框标题，可选项，默认为：OK
- msg : 为 string 类型，对话框信息
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
	</tbody>
</table>

#### updateProgress #### 
	updateProgress(value)

**功能描述：**

更新进度显示

**参数说明：**

- value : 为 int 类型，取值范围为[0,100]，进度数值

#### stopProgress #### 
	stopProgress()

**功能描述：**

关闭进度显示


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
		<tr>
			<td>offline</td>
			<td>boolean</td>           
			<td>设置offline为true，直接使用本地能力生成二维码，不依赖在runtime，默认：false</td>  
		</tr>
        <tr>
			<td>mono</td>
			<td>boolean</td>           
			<td>是否生成黑白二维码，默认：true, 即默认生成黑白二维码</td>  
		</tr>
        <tr>
			<td>animate</td>
			<td>boolean</td>           
			<td>是否生成彩色动画二维码，默认：false</td>  
		</tr>
        <tr>
			<td>backgroundUrl</td>
			<td>string</td>           
			<td>二维码背景文件的URL路径，可选</td>  
		</tr>
    <tbody>
</table>

### Screen ###
	clouda.device.screen

截屏分享

**方法：**

- captureScreen(options)
- shareImage(data, options)
- shareScreen(options)

#### captureScreen ####
	capture(options)

**功能描述：**

获取截屏

**参数说明：**

- options：为 object 类型，其中包括以下参数：

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
			<td>获取成功，返回的 data 为一个base64 string 的 jpeg 文件流</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>


#### shareImage ####
	shareImage(data, options)

**功能描述：**

分享图片

**参数说明：**

- data : 为 base64 的 string 类型，captureScreen接口中返回的data信息
- options：为 object 类型，其中包括以下参数：

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
			<td>分享成功，返回SUCCESS状态码</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

#### shareScreen ####
	shareScreen(options)

**功能描述：**

获取并分享截屏

**参数说明：**

- options：为 object 类型，其中包括以下参数：
- 
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
			<td>分享成功，返回SUCCESS状态码</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

## 云服务类API ##

云服务类API目前支持以下功能：

- 人脸识别（FaceRecognition）
- 帐号登录（Account）
- 百度地图（Map）
- 播放器（MediaPlayer）
- 轻支付（Pay）
- 个人云存储（Pcs）
- 推送服务（Push） 
- 文本语音服务（TTS）
- 语音识别服务（VTT）

### FaceRecognition ###
    clouda.mbaas.face

人脸识别

**方法：**

- register(uid, options)
- verify(uid, options)
- checkBlink(uid, options)
- authorizeDevice(uid, options)
- listDevice(uid, options)

#### register ####
	register(uid, options)

**功能描述：**

注册人脸识别服务，启动摄像功能获取人脸信息，并与UID建立绑定关系

**参数说明：**

- uid： 为 string 类型（32个字符以内），开发者为其人脸识别服务的用户所赋予的唯一识别标识
- options：为 object 类型，其中包括以下参数：

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
			<td>注册成功，返回SUCCESS状态码</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

#### verify ####
	verify(uid, options)

**功能描述：**

启动摄像功能获取人脸信息，并与register接口中已注册的人脸信息进行验证

**参数说明：**

- uid： 为 string 类型（32个字符以内），开发者为其人脸识别服务的用户所赋予的唯一识别标识
- options：为object类型，其中包括以下参数：

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
			<td>验证成功，返回SUCCESS状态码</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

#### checkBlink ####
	checkBlink(uid, options)

**功能描述：**

检查眨眼情况，用于活体检测或者通过眼睛活动状态进行远程控制操作

**参数说明：**

- uid： 为 string 类型（32个字符以内），开发者为其人脸识别服务的用户所赋予的唯一识别标识
- options：为object类型，其中包括以下参数：

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
			<td>操作成功，返回SUCCESS状态码，存在眨眼情况</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回系统错误码信息</td>  
		</tr>
    </tbody>
</table>

#### authorizeDevice ####
	authorizeDevice(uid, options)

**功能描述：**

绑定设备，认证该用户可使用人脸识别服务的具体采集设备

**参数说明：**

- uid ： 为 string 类型（32个字符以内），开发者为其人脸识别服务的用户所赋予的唯一识别标识
- options：为object类型，其中包括以下参数：

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
			<td>绑定成功，返回SUCCESS状态码</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>绑定失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

#### listDevice ####
	listDevice(uid, options)

**功能描述：**

查看该用户使用人脸服务所认证的设备列表信息

**参数说明：**

- uid ： 为 string 类型（32个字符以内），开发者为其人脸识别服务的用户所赋予的唯一识别标识
- options：为object类型，其中包括以下参数：

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
			<td>获取成功，data 返回 string 类型设备UUID信息，以逗号分隔</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>获取失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>
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



### Map ###
    clouda.mbaas.map

百度地图

**注意：**
**您需先申请百度地图密钥（API Key）才可使用**
**目前百度地图的密钥（API Key）需额外申请：[申请地址](http://lbsyun.baidu.com/apiconsole/key?application=key)**

**在页面内引入**
```code
<script src="http://api.map.baidu.com/api?v=2.0&ak=your_lbs_apikey_here"></script>
```

**方法：**

- start(options)
- stop(options)
- locationRequest(options)
- poiRequest(options)

#### start ####
    start(options)

**功能描述：**

开启定位获取经纬度信息，由于已知原因（不同坐标系），不能与geolocation混合使用

**参数说明：**

- options：为 object 类型，其中包括以下参数：

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
            <td>启动成功，返回百度地图坐标对象</td>  
        </tr>
        <tr>
            <td>onfail</td>
            <td>function(err){}</td>          
            <td>操作失败，返回错误码信息</td>  
        </tr>
    </tbody>
</table>
**返回的百度地图坐标对象：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>lng</td>
            <td>float</td>            
            <td>经度</td>  
        </tr>
        <tr>
            <td>lat</td>
            <td>float</td>          
            <td>纬度</td>  
        </tr>
    </tbody>
</table>

#### stop ####
    stop(options)

**功能描述：**

定位开启后，可以停止定位开启状态

**参数说明：**

- options：为 object 类型，其中包括以下参数：

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
            <td>操作失败，返回错误码信息</td>  
        </tr>
    </tbody>
</table>

#### locationRequest ####
    locationRequest(options)

**功能描述：**

定位开启后，可以立即获取一次经纬度信息，由于已知原因（不同坐标系），不能与geolocation混合使用

**参数说明：**

- options：为 object 类型，其中包括以下参数：

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
            <td>启动成功，返回百度地图坐标对象</td>  
        </tr>
        <tr>
            <td>onfail</td>
            <td>function(err){}</td>          
            <td>操作失败，返回错误码信息</td>  
        </tr>
    </tbody>
</table>
**返回的百度地图坐标对象：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>lng</td>
            <td>float</td>            
            <td>经度</td>  
        </tr>
        <tr>
            <td>lat</td>
            <td>float</td>          
            <td>纬度</td>  
        </tr>
    </tbody>
</table>

#### poiRequest ####
    poiRequest(options)

**功能描述：**

定位开启后，可以通过此方法获取周边商家信息对象

**参数说明：**

- options：为 object 类型，其中包括以下参数：

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
            <td>获取成功，返回对象{poi:{p:[{商家对象},{商家对象}]}}</td>  
        </tr>
        <tr>
            <td>onfail</td>
            <td>function(err){}</td>          
            <td>操作失败，返回错误码信息</td>  
        </tr>
    </tbody>
</table>
**返回的商家对象：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
            <td>x</td>
            <td>float</td>            
            <td>经度</td>  
        </tr>
        <tr>
            <td>y</td>
            <td>float</td>          
            <td>纬度</td>  
        </tr>
        <tr>
            <td>dis</td>
            <td>float</td>            
            <td>距离，单位米</td>  
        </tr>
        <tr>
            <td>name</td>
            <td>string</td>            
            <td>商家名称</td>  
        </tr>
    </tbody>
</table>



### MediaPlayer ###
	clouda.mbaas.mediaplayer

播放器

**方法：**

- play(link, options)

#### play ####
	play(link, options)

**功能描述：**

播放媒体文件

**参数说明：**

- link ： 为string类型，所要播放的媒体文件链接（本地媒体文件路径或 Web URL均可）
- options：为object类型，其中包括以下参数：

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
			<td>播放成功，返回SUCCESS状态码</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

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
```
{
	statecode : {状态码},
	order_no : {商户传入的订单号},
	notify : {订单签名}
}
```
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



### 个人云存储(PCS) ###
    clouda.mbaas.pcs

使用PCS接口实现文件上传，文件操作，文件下载，离线下载等功能，步骤如下：

- 用户登录授权得到密钥（token）
- 使用密钥（token）执行初始化函数init

**方法：**

- init(token,options)
- mkdir(path,options)
- getQuota(options)
- uploadFile(localpath,serverpath,options)
- downloadFile(serverpath,localpath,options)
- deleteFiles(patharr,options)
- getMeta(path,options)
- getList(path,options)
- getListByCategory(mediaType,options)
- getStreamingURL(serverpath,codeType,options)
- search(serverpath,key,recursive,options)
- thumbnail(serverpath,options)
- move(patharr,options)
- rename(patharr,options)
- copy(patharr,options)
- createFileLink(path,options)
- deleteFileLink(path,options)
- cloudMatch(localpath,serverpath,options)
- cloudMatchAndUploadFile(localpath,serverpath,options)
- listRecycle(options)
- restore(filesukarr,options)
- cleanRecycle(options)
- cloudDownload(url,serverpath,options)
- cancelCloudDownload(path,options)
- cloudDownloadTaskList(options)
- queryCloudDownloadTaskProgress(filesukarr,options)
- queryCloudDownloadTaskStatus(filesukarr,options)
- diff(cursor,options)


#### init####
	init(token,options)

**功能描述：**

通过帐号登录（Account）获得的token，初始化PCS

**参数说明：**
- token：为 string 类型，

- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回登录用户信息
onfail | function(err){} | 操作失败，返回错误码信息

#### mkdir ####
	mkdir(path,options)

**功能描述：**

创建文件夹，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- path：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息

#### getQuota ####
	getQuota(options)

**功能描述：**

返回pcs空间使用情况，单位字节

**参数说明：**
- options：为 object 类型，其中包括以下参数：


参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回空间使用情况Quota对象
onfail | function(err){} | 操作失败，返回错误码信息

**返回的Quota对象：**


参数 | 类型 | 描述
------------ | ------------- | ------------
used | int | 已使用空间，单位字节
total | int | 空间总大小，单位字节


#### uploadFile ####
	uploadFile(localpath,serverpath,options)

**功能描述：**

上传文件，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- localpath：为 string 类型，位于手机文件系统的绝对路径
- serverpath：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息
onprogress | function(status){} | 返回上传进度Progress对象

**返回的Progress对象：**


参数 | 类型 | 描述
------------ | ------------- | ------------
progress | int | 已上传的大小，单位字节
total | int | 空间总大小，单位字节


#### downloadFile ####
	downloadFile(serverpath,localpath,options)
**功能描述：**
下载文件到本地，权限仅限于token所获得的路径下`/apps/your_app_dir/`
**参数说明：**
- serverpath：为 string或Array 类型，位于个人云存储的绝对路径，若是Array类型，则自动打包下载
- localpath：为 string 类型，位于本地的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息
onprogress | function(status){} | 返回上传进度Progress对象
asStream | boolean | 可选参数，默认是false
codecType | string | 可选参数，默认为空，可选值如下：
		 - clouda.mbaas.CODEC_TYPE.M320
		 - clouda.mbaas.CODEC_TYPE.M480224
		 - clouda.mbaas.CODEC_TYPE.M480360
		 - clouda.mbaas.CODEC_TYPE.M640
		 - clouda.mbaas.CODEC_TYPE.M854


#### deleteFiles ####
	deleteFiles(patharr,options)

**功能描述：**

批量删除文件，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- patharr：为 Array 类型，由个人云存储上文件或文件夹的绝对路径组成
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回登录用户信息
onfail | function(err){} | 操作失败，返回错误码信息

#### getMeta ####
	getMeta(path,options)


**功能描述：**

获取文件信息，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- path：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回meta对象
onfail | function(err){} | 操作失败，返回错误码信息

**返回的Meta对象：**


参数 | 类型 | 描述
------------ | ------------- | ------------
hasSubFolder | booleanen | 是否有子文件夹
blockList | string | md5值
path | string | 绝对路径
isDir | booleanen | 是否是文件夹
fsId | string | 文件的唯一id
mTime | string | 修改时间戳
mediaType | int | 媒体类型
cTime | string | 创建时间戳
size | int | 文件大小，单位字节

#### getList ####
	getList(path,options)


**功能描述：**

获取文件夹下的信息，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- path：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数： 

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回文件列表，由Meta对象组成的数组
onfail | function(err){} | 操作失败，返回错误码信息
order | string | 可选参数asc,desc
by | string | 可选参数time,size


#### getListByCategory ####
	getListByCategory(mediaType,options)

**功能描述：**

分类浏览，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- mediaType：为 string 类型，位于个人云存储的绝对路径,其值如下：
		 - clouda.mbaas.MEDIA_TYPE.IMG
		 - clouda.mbaas.MEDIA_TYPE.AUD
		 - clouda.mbaas.MEDIA_TYPE.VID
		 - clouda.mbaas.MEDIA_TYPE.DOC 
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回文件列表，由Meta对象组成的数组
onfail | function(err){} | 操作失败，返回错误码信息


#### getStreamingURL ####
	getStreamingURL(serverpath,codeType,options)


**功能描述：**

获得文件播放流，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- serverpath： string 类型，位于个人云存储的绝对路径
- codeType：播放流类型，其值如下：
		 - clouda.mbaas.VIDEO_STREAM.P360(默认)
		 - clouda.mbaas.VIDEO_STREAM.P480  
		
- options： object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回文件流信息
onfail | function(err){} | 操作失败，返回错误码信息

#### search ####
	search(serverpath,key,recursive,options)

**功能描述：**

搜索文件夹，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- serverpath：为 string 类型，位于个人云存储的绝对路径
- key：为 string 类型，搜索关键字
- recursive：为 boolean 类型，是否递归查询
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回文件列表，由Meta对象组成的数组
onfail | function(err){} | 操作失败，返回错误码信息

#### thumbnail ####
	thumbnail(serverpath,options)

**功能描述：**

缩略图，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- serverpath：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回图片base64
onfail | function(err){} | 操作失败，返回错误码信息
quality | int | 0-100 缩略图品质
width | int | 缩略图宽度，单位像素
height | int | 缩略图高度，单位像素

#### move ####
	move(patharr,options)

**功能描述：**

移动文件，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- patharr：为 Array 类型，由**Path**对象组成:


参数 | 类型 | 描述
------------ | ------------- | ------------
from | string | 源文件的绝对路径
to | string | 目标地址的绝对路径


- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息

#### rename ####
	rename(patharr,options)

**功能描述：**

重命名文件，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- patharr：为 Array 类型，由**PathRename**对象组成:

参数 | 类型 | 描述
------------ | ------------- | ------------
oldName | string | 源文件的绝对路径
newName | string | 新文件名


- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息

#### copy ####
	copy(patharr,options)

**功能描述：**

移动文件，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- patharr：为 Array 类型，由**Path**对象组成:

参数 | 类型 | 描述
------------ | ------------- | ------------
from | string | 源文件的绝对路径
to | string | 目标地址的绝对路径


- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息



#### createFileLink ####
	createFileLink(path,options)

**功能描述：**

创建文件，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- path：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息

#### deleteFileLink ####
	deleteFileLink(path,options)

**功能描述：**

删除文件，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- path：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息



#### cloudMatch ####
	cloudMatch(localpath,serverpath,options)

**功能描述：**

云端匹配，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- localpath：为 string 类型，位于本地的绝对路径
- serverpath：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回是否匹配
onfail | function(err){} | 操作失败，返回错误码信息

#### cloudMatchAndUploadFile ####
	cloudMatchAndUploadFile(localpath,serverpath,options)

**功能描述：**

云端匹配文件并上传，权限仅限于token所获得的路径下`/apps/your_app_dir/`

**参数说明：**
- localpath：为 string 类型，位于本地的绝对路径
- serverpath：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回操作成功状态码
onfail | function(err){} | 操作失败，返回错误码信息
onprogress | function(status){} | 返回上传进度Progress对象

**返回的Progress对象：**


参数 | 类型 | 描述
------------ | ------------- | ------------
progress | int | 已上传的大小，单位字节
total | int | 空间总大小，单位字节

#### listRecycle ####
	listRecycle(options)
**功能描述：**
列出回收站的文件列表
**参数说明：**
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回文件列表，由Meta对象组成的数组
onfail | function(err){} | 操作失败，返回错误码信息

#### restore####
	restore(filesukarr,options)
**功能描述：**
回收站还原文件，权限仅限于token所获得的路径下`/apps/your_app_dir/`
**参数说明：**
- filesukarr：为 Array 类型，由fsId字符串组成
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功信息
onfail | function(err){} | 操作失败，返回错误码信息

#### cleanRecycle ####
	cleanRecycle(options)
**功能描述：**
清空回收站，权限仅限于token所获得的路径下`/apps/your_app_dir/`
**参数说明：**
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息


#### cloudDownload ####
	cloudDownload(url,serverpath,options)
**功能描述：**
启动离线下载任务，权限仅限于token所获得的路径下`/apps/your_app_dir/`
**参数说明：**
- url：为 string 类型，外网地址
- serverpath：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息

#### cancelCloudDownload ####
	cancelCloudDownload(serverpath,options)
**功能描述：**
取消离线下载任务，权限仅限于token所获得的路径下`/apps/your_app_dir/`
**参数说明：**
- serverpath：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回成功状态码
onfail | function(err){} | 操作失败，返回错误码信息

#### cloudDownloadTaskList ####
	cloudDownloadTaskList(options)
**功能描述：**
获取离线下载任务列表，权限仅限于token所获得的路径下`/apps/your_app_dir/`
**参数说明：**
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回cloudDownloadList对象
onfail | function(err){} | 操作失败，返回错误码信息
order | string | 可选asc,desc
start | int | 列表查找句柄的开始位置
limit | int | 列表查找句柄的个数限制
needTaskInfo | boolean | 是否需要文件详细信息，默认true
status | int | 0-10

#### queryCloudDownloadTaskStatus ####
	queryCloudDownloadTaskStatus(filesukarr,options)
**功能描述：**
查询给定文件的离线下载状态，权限仅限于token所获得的路径下`/apps/your_app_dir/`
**参数说明：**
- filesukarr：为 Array 类型，由下载任务id组成
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回所查询任务的状态
onfail | function(err){} | 操作失败，返回错误码信息


#### queryCloudDownloadTaskProgress ####
	queryCloudDownloadTaskProgress(filesukarr,options)
**功能描述：**
查询给定文件的离线下载进度，权限仅限于token所获得的路径下`/apps/your_app_dir/`
**参数说明：**
- filesukarr：为 Array 类型，由下载任务id组成
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，所查询任务的进度
onfail | function(err){} | 操作失败，返回错误码信息


#### diff ####
	diff(cursor,options)
**功能描述：**
历史版本库变更的查询管理
功能第一次调用时，传入的参数为null。后续调用，需要使用前一次调用返回的data.cursor作为参数传入
查询，两次diff调用之间，有哪些操作被执行了
**参数说明：**
- serverpath：为 string 类型，位于个人云存储的绝对路径
- options：为 object 类型，其中包括以下参数：

参数 | 类型 | 描述
------------ | ------------- | ------------
onsuccess | function(data){} | 操作成功，返回Diff对象
onfail | function(err){} | 操作失败，返回错误码信息

**返回的Diff对象：**


参数 | 类型 | 描述
------------ | ------------- | ------------
list | Array | 由Meta对象组成
cursor | string | 供函数diff对比的句柄

**Meta对象：**


参数 | 类型 | 描述
------------ | ------------- | ------------
hasSubFolder | booleanen | 是否有子文件夹
blockList | string | md5值
path | string | 绝对路径
isDir | booleanen | 是否是文件夹
fsId | string | 文件的唯一id
mTime | string | 修改时间戳
mediaType | int | 媒体类型
cTime | string | 创建时间戳
size | int | 文件大小，单位字节


### Push ###

    clouda.mbaas.push

推送服务

**方法：**

- register(options)
- unregister(options)
- checkStatus(options)
- setTag(tags, options)  
- removeTag(tags, options)
- listTag(options)

#### register ####
    register(options)

**功能描述：**

注册设备

**参数说明：**

options：为object类型，其中包括以下参数：

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
			<td>注册成功，返回PushInfo对象</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>注册失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

**返回的PushInfo对象：**
<table style="border-style: solid; border-width: 0pt;" border="1" cellspacing="0" cellpadding="5px">
    <tbody>
        <tr>
            <th>参数</th>
            <th>类型</th>
            <th>描述</th>
        </tr>
        <tr>
			<td>uid</td>
			<td>string</td>            
			<td>用户ID信息</td>  
		</tr>
        <tr>
			<td>channelID</td>
			<td>string</td>          
			<td>channel ID信息</td>  
		</tr>
        <tr>
			<td>appID</td>
			<td>string</td>          
			<td>应用ID信息</td>  
		</tr>
    </tbody>
</table>

#### unregister ####

    unregister(options)

**功能描述：**

解绑设备

**参数说明：**

- options：为object类型，其中包括以下参数：

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
			<td>解绑成功，返回SUCCESS状态码</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

#### checkStatus ####

    checkStatus(options)

**功能描述：**

检查设备绑定状态

**参数说明：**

options：为object类型，其中包括以下参数：

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
			<td>注册成功，返回的data为boolean类型</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>注册失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>


#### setTag ####
    setTag(tags, options)

**功能描述：**

设置一个或多个广播组标签

**参数说明：**

- tags： 广播组标签，为array类型，由广播组标签字符串组成
- options：为object类型，其中包括以下参数：

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
			<td>设置成功，返回的data为设置成功的标签数据</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>设置失败，返回错误码信息或设置失败的标签数据</td>  
		</tr>
    </tbody>
</table>

#### removeTag ####

    removeTag(tags, options)

**功能描述：**

删除一个或多个广播组标签

**参数说明：**

- tags： 广播组标签，为array类型，由广播组标签字符串组成
- options：为object类型，其中包括以下参数：

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
			<td>删除成功，返回删除信息</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>操作失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

#### listTag ####

    listTag(options)

**功能描述：**

获取所有标签

**参数说明：**

- options：为object类型，其中包括以下参数：

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
			<td>获取成功，返回的data为array类型，由广播组标签string类型组成</td>  
		</tr>
        <tr>
			<td>onfail</td>
			<td>function(err){}</td>          
			<td>获取失败，返回错误码信息</td>  
		</tr>
    </tbody>
</table>

### TTS ###
    clouda.mbaas.tts

文本发音类

**方法：**

- say(word, options)

#### say ####
    say(word, options)

**功能描述：**

启动文本语音功能

**参数说明：**

- word： string类型，文本信息
- options： object类型，其中包括以下参数：

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
			<td>function(data){}</td>            
			<td>操作失败，返回错误码信息</td>  
		</tr>
        <tr>
			<td>type</td>
			<td>number</td>            
			<td>朗读文本的语音类型：<br>
			- clouda.mbaas.tts.TYPE_DICT_US ： 美式英语发音<br>
			- clouda.mbaas.tts.TYPE_DICT_UK ： 英式英语发音<br>
			- clouda.mbaas.tts.TYPE_DICT_ZH ： 中文发音<br>
		</td>  
		</tr>
	</tbody>
</table>

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
			<td>dialogTheme</td>
			<td>int</td>            
			<td>语音识别对话框主题样式，取值如下：<br>
				- 0 ： 浅蓝色  <br>
				- 1 ： 深蓝色  <br>
				- 2 ： 浅绿色  <br>
				- 3 ： 深绿色  <br>
				- 4 ： 浅橘黄色 <br>
				- 5 ： 橘黄色  <br>
				- 6 ： 浅红色  <br>
				- 7 ： 红色 
			</td>  
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
