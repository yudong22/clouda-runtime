#百度轻应用开发指南#

----------
更新日期：  2013/12/20 13:57:28       

问题反馈： [clouda-support@baidu.com](mailto:clouda-support@baidu.com)

## 概述 ##

轻应用是通过 HTML 及 JavaScript 开发的无需下载、即搜即用的全功能 App；既有媲美甚至超越 Native App 的用户体验，又具备 Web App 的可被检索与智能分发的特性，将有效解决优质应用和服务与移动用户需求对接的问题。

百度在2013年8月的百度世界大会上宣布推出“轻应用”，可实现无需下载，即搜即用和通过移动搜索智能分发。

为帮助广大开发者简单、便捷、快速开发轻应用，百度为开发者提供一个带GUI的轻应用调试环境、并提供轻应用开发框架支持开发者开发。轻应用调试环境，以.apk形式提供给开发者使用。

此文档即是对轻应用的开发指南进行了详细说明，供开发者参考使用。

## 开发流程 ##

轻应用的开发流程可分为以下五个阶段：

开发前准备、开发、调试、部署、接入

### 开发前准备 ###

开发轻应用，请先完成以下操作：

1. 访问百度开放云[管理控制台](http://developer.baidu.com/console)，获取应用API Key；了解详细信息，请参考[ "《帮助文档》"](http://developer.baidu.com/wiki/index.php?title=docs/cplat/bae/start#.E5.88.9B.E5.BB.BA.E5.BA.94.E7.94.A8)。
	
2. 开启或设置相关服务（<font color="red">无需等待审核通过，即可使用</font>）：
	
	- **人脸识别（FaceRecognition）**：申请开启服务，详见：[《人脸识别管理控制台》](http://developer.baidu.com/wiki/index.php?title=docs/cplat/media/face/console)
	- **推送服务（Push）**： 无需申请开启服务，但需要通过管理控制台进行推送，详见：[《轻应用推送操作手册》](http://bcs.duapp.com/clouda-api/%E8%BD%BB%E5%BA%94%E7%94%A8%E6%8E%A8%E9%80%81%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf)
	- **语音识别服务（VTT）**：申请开启服务，详见：[《语音技术管理控制台》](http://developer.baidu.com/wiki/index.php?title=docs/cplat/media/voice/console)
	- **百度地图（Map）**: 申请百度地图的密钥（API Key）：[申请地址](http://lbsyun.baidu.com/apiconsole/key?application=key）

3. 目前只支持Android端

### 开发轻应用 ###

开发轻应用目前有两种方式，二者可以任选其一：

1.	直接调用轻应用接口进行开发
2.	使用 Clouda 开发框架进行开发

#### 直接调用轻应用接口进行开发 ####

开发者也可完全自己调用轻应用接口、实现轻应用相关功能的开发：

1. 创建一个index.html；

2. 引用轻应用API地址，通过CDN公共库地址访问示例如下：

		<script type="text/javascript" src="http://bcscdn.baidu.com/bcs-cdn/clouda/api-0.2.6.js"></script>

3. 调用轻应用App信息注册接口；详见[ "《轻应用API参考文档》"](http://cloudajs.org/lightapp/docs/api)。

4. 选择调用API，实现功能开发；
   有关API信息，详见[ "《轻应用API参考文档》"](http://cloudajs.org/lightapp/docs/api)。
 
**代码示例**

为帮助开发者入门，下面提供了一些基本代码，介绍如何引用轻应用API，获取系统信息。

示例： 获取本地相机图片

		<!DOCTYPE html>		
		<html>
		    <head>
		        <title>轻应用开发JavaScript代码示例</title>
				// 引用轻应用API的JS文件
		        <script type="text/javascript" src="http://bcscdn.baidu.com/bcs-cdn/clouda/api-latest.js"></script>
		    </head>
		    <body>
		        <img id="photo"></img>
		        <script>
					//读取本地相机图片
		           clouda.device.media.captureMedia({
				   		mediaType : clouda.device.MEDIA_TYPE.IMAGE,
						source : clouda.device.MEDIA_SOURCE.CAMERA,
						onfail : function(err){},
						onsuccess : function(mediaFile){
							//返回读取到的图片文件的本地全路径
							document.getElementById('photo').src= mediaFile[0].fullPath;
						} 
				   })
		        </script>                   
		    </body>
		</html>

#### 使用Clouda开发框架 ####

Clouda开发框架是一个实时的JavaScript开发框架；使用该框架，可方便开发者开发。

<font color="red">说明：</font>

<font color="red">开发者也可不使用该开发框架进行开发；这不是轻应用开发的必要条件。</font>

如果通过Clouda开发框架开发轻应用，则具体步骤如下：

1.	安装Clouda
2.	参考示例进行开发
3.	API reference （会包含轻应用API），
详见：[http://cloudajs.org/docs](http://cloudajs.org/docs)

### 调试轻应用 ###

开发轻应用时，在将该应用部署到 Web 服务器之前，您可以方便地在本地计算机上对应用进行测试。

您的本地计算机的 Web 服务器很可能使用类似 http://localhost 的默认地址。

#### 安装调试环境 ####

1. 点击[这里](http://bcscdn.baidu.com/bcs-cdn/clouda-runtime/SplashScreenActivity03111706.apk)下载.apk或使用移动设备扫描下面的二维码，进入轻应用调试环境安装文件（.apk）下载界面；<br>
<img style="width: 20%; height:30%; margin-left:20;" src="http://bcscdn.baidu.com/bcs-cdn/clouda-runtime/qr140312.png">


2. 点击下载界面中的“**直接下载**”，下载apk到开发机（Android系统）；<br>
<img style="width: 30%; height:30%; margin-left:20;" src="http://bcs.duapp.com/clouda-api/start.png">

3. 点击安装 apk，安装调试环境；

4. 安装成功会在桌面生成“**轻应用调试**”图标。<br>
<img style="max-width: 10%;margin-left:20;" src="http://bcscdn.baidu.com/bcs-cdn/clouda-runtime/icon20140312.png">

#### 远程调试 ####

#### 安装远程调试工具 ####

安装调试工具Weinre：

**在 Windows下安装 Weinre：**

1. 首先，访问 [http://nodejs.org/download/](http://nodejs.org/download/)，下载并安装Node.js;

2. 安装好后，在 Windows 命令行中运行：

     npm install weinre

**其他安装说明：**

可参考： [http://people.apache.org/~pmuellr/weinre/docs/latest/Installing.html](http://people.apache.org/~pmuellr/weinre/docs/latest/Installing.html)

#### 远程调试操作 ####

1. 在 PC 上启动运行 Weinre 命令：

		node_modules\.bin\weinre\weinre --boundHost <调试的IP地址>

  	 例如： 若本地IP地址为172.22.113.220,则命令如下：

		node_modules\.bin\weinre\weinre --boundHost 172.22.113.220

2. 在需要调试的页面中添加以下调试代码（<font color="red">**调试完成后请删除**</font>）：

		<script src="http://172.22.113.220:8080/target/target-script-min.js#mobile"></script>

3. 点击移动设备桌面的“**轻应用调试**”图标，进入以下界面；<br>
<img style="max-width: 30%;;" src="http://bcs.duapp.com/clouda-api/debug.png">

4. 在 PC 浏览器中输入“`http://<调试的IP地址>:8080/client/#mobile`”，出现以下调试界面：<br>
<img style="max-width: 50%;" src="http://bcs.duapp.com/clouda-api/remote_debug.PNG">

5. 点击调试界面的顶部的“Elements”，即可进行页面调试（效果如下图所示）：<br>
<img style="max-width: 50%;" src="http://bcs.duapp.com/clouda-api/debugUI.png">

6. 调试完成时，请删除调试代码。

### 部署轻应用 ###

1.	登录百度开放云“[管理控制台](http://developer.baidu.com/console)”；

2.	创建一个轻应用，并将该应用托管到BAE3.0的Node.js执行环境下；

3.	发布版本，并获取应用对应的URL；

4.	通过“运行轻应用”按钮访问该应用的URL，验证发布效果。

### 接入轻应用 ###

接入轻应用，获取更多被搜索机会。

如果您是第一次将开发的应用**接入轻应用，**请按照下面步骤操作：

1. 如果您的应用还没有托管到BAE，请先将您的[应用托管到BAE](http://cloudajs.org/docs/upload_to_BAE_3.0)上，然后进入第二步；

2. 进入[百度开放云的应用管理界面](http://developer.baidu.com/console)，在应用列表中找到托管的应用，并点击轻应用的**“接入”**按钮<br>
<img style="max-width: 50%;margin-left:20;" src="http://cloudajs.org/assets/md/docs/images/accesslightapp.png">

3. 在“接入轻应用”页面填入相关的信息，完成后点击**“保存”**；<br>
<img style="max-width: 50%; margin-left:20;" src="http://cloudajs.org/assets/md/docs/images/addinformation.png">

4. 当看到下面信息时，表示保存成功，后面大家可以根据自己的实际需求选择“**对接移动搜索**”。<br>
<img style="max-width: 50%;margin-left:20;" src="http://cloudajs.org/assets/md/docs/images/access_success.png">

## 附录 ##

### UI界面底部使用统一标签栏

1.	标签栏规范说明

	- 标签栏位于屏幕底部，并应该保证在应用内任何位置都可用。
	- 标签栏是半透明的，展示图标和文字内容，每一项均保持等宽。当用户选中某个标签时，该标签呈现适当的高亮状态。
	- 标签栏是半透明的，始终与屏幕等宽以通栏显示。因为不同界面所对应的操作不不同，工具栏中的控件可能随着界面的切换而进行相应调整。
	- 标签栏的高度不随着屏幕方向的改变而改变。

2. 示例

<img style="margin-left:50px; max-width: 50%;" src="http://bcs.duapp.com/clouda-api/sample.png">

### 应用图标及信息规范 

开发者所开发及发布的轻应用必须提供符合如下规范的图标及信息：

1.	应用图标需为：
	- 512*512 规格
	- jpg、png、gif格式
	- 图像精度大于72dpi

2.	开发者发布轻应用需同时提供以下信息：
	-	应用名称
	-	应用图标
	-	开发者信息
	-	应用类型
	-	应用描述
	-	发布版本
	-	发布时间
	-	更新说明
	-	应用关键词
	-	其他信息

### 轻应用API参考文档

请参考：[百度轻应用API参考文档](http://cloudajs.org/lightapp/docs/api "《百度轻应用API参考文档》")


##如何推送消息

###登陆开放云平台
访问百度开放云平台官网：http://developer.baidu.com/

![dev](http://bs.baidu.com/runtime-images/dev.jpg "开放云平台")

###进入管理控制台
点击管理控制台，进入云推送服务的管理控制台，点击您使用推送服务的轻应用，进入基本信息页。进入应用基本信息页，点击左侧边栏中的 “__开发者服务__”->“__云推送__”.

![appinfo](http://bs.baidu.com/runtime-images/app_detial.jpg "应用信息")

###推送设置
点击“__云推送__”->“__推送设置__”，进入推送设置页面

![setting1](http://bs.baidu.com/runtime-images/setting1.jpg)

![setting2](http://bs.baidu.com/runtime-images/setting2.jpg)

进入推送设置页面，您需要随意设置一个android包名（可参考包名：com.light.hackathon），点击保存设置，进入云推送管理控制界面，才可进行轻应用的推送。

###轻应用推送
进入云推送管理控制界面（如下图），点击“__+通知__”，即可进行推送轻应用的通知（目前轻应用仅支持推送通知）：

![console](http://bs.baidu.com/runtime-images/push_console.jpg "云推送管理控制台")

轻应用推送您需关注以下几点：

* 标题、消息内容填写
* 设备范围：选择Android
* 用户范围：选择所有人（目前不支持广播）
* 发送时间：即时发送
* 高级设置

![notification](http://bs.baidu.com/runtime-images/notification.jpg "轻应用通知")

高级设置：

你需要设置通知后续行为，其它设置项保持默认，可不做任何修改和设置。

* 通知后续行为：现在只支持使用打开网页方式，您需要输入应用的入口URL，或者也可以指定你想要打开的其它URL。用户在通知栏点击通知时，将用Runtime打开该URL。
* 轻应用推送仅支持（如下图）红色框中的选项，不支持以下三点：
    * Android平台下
        * 通知栏样式：自定义样式不可用，轻应用不支持自定义样式
        * 通知后续行为：自定义打开行为不可用，轻应用不支持自定义打开行为
    * iOS平台：轻应用暂不支持iOS平台推送，不用做任何设置
    * 附件字段：轻应用不支持自定义字段，不用做任何设置


![advance](http://bs.baidu.com/runtime-images/advance.jpg "高级设置")

点击发送，即完成轻应用的通知推送，在云推送主界面可查看推送消息记录，目前暂不支持轻应用推送报表的查看。

![msglist](http://bs.baidu.com/runtime-images/msg_list.jpg "消息记录")
