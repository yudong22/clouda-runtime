#百度轻应用开发指南#

----------

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

 1. 访问百度开放云[轻应用管理](http://developer.baidu.com/console#app/light)，
 2. 创建轻应用或者进入已有轻应用，在手机端能力页面中获取手机端能力的API key。
 3. 本地设备能力类API目前只支持Android端

### 开发轻应用 ###

开发轻应用目前有两种方式，二者可以任选其一：

1.	直接调用轻应用接口进行开发
2.	使用 Clouda 开发框架进行开发

#### 直接调用轻应用接口进行开发 ####

开发者也可完全自己调用轻应用接口、实现轻应用相关功能的开发：

1. 创建一个index.html；

2. 内嵌如下代码：


		<script name="baidu-tc-cerfication" type="text/javascript" charset="utf-8" src="http://apps.bdimg.com/cloudaapi/lightapp.js"></script>

2. 如果页面是使用https加密链接的时，请内嵌如下代码

		<script name="baidu-tc-cerfication" type="text/javascript" charset="utf-8" src="https://openapi.baidu.com/cloudaapi/lightapp.js"></script>

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
                <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                <meta content="width=device-width,initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no" name="viewport" />
                <!-- 引用轻应用API的JS文件 -->
                <script type="text/javascript" charset="utf-8" src="http://apps.bdimg.com/cloudaapi/lightapp.js"></script>
            </head>
            <body>
                <script>
                   //首先输入轻应用的ak
                   clouda.lightInit({
                        ak:"iUQs1O9pmkIvfZ1zmy8sm7Gk",
                        module:["media"]
                    });

                    //加载完api js后，立即执行读取本地相机图片
                    var openCamera = function(){
                        clouda.device.media.captureMedia({
                                mediaType : 0,//IMAGE
                                source : 0,//CAMERA
                                onfail : function(err){
                                        alert(JSON.stringify(err));
                                },
                                onsuccess : function(mediaFile){
                                        //返回读取到的图片文件的本地全信息
                                        alert(JSON.stringify(mediaFile));
                                } 
                        });
                    };
                    openCamera();

                </script>
                <button onclick = "openCamera()">openCamera</button>
                <hr/>
                <h2 id="runtime"></h2>
            </body>
        </html>


#### 添加统计功能 ####

如果不需要统计页面加载，可以跳过此步骤。

1. 访问百度开放云[轻应用管理](http://developer.baidu.com/console#app/light)，接入或者编辑轻应用时，可以看到如下代码标识

        <script name="baidu-tc-cerfication" src="http://apps.bdimg.com/cloudaapi/lightapp.js#xxxxxx"></script>
        <script>
            window.bd && bd._qdc && bd._qdc.init({
                app_id : 'yyyyyyy'
            });
        </script>
    
2. 获取其中的 `yyyyyyy` , 使用yyyyy+下划线+自定义页面标识字符串,并将代码嵌入<head>与</head>之间，形如
    
        <script>
            window.bd && bd._qdc && bd._qdc.init({
                app_id : 'yyyyyyy_yourcustomkey'
            });
        </script>
    
3. 统计监控

对于同步加载的应用，在首屏屏幕高度的位置添加如下这句脚本监控首屏
    
        <script>
            window.bd && bd._qdc && bd._qdc.first_screen && bd._qdc.first_screen();
        </script>
        
对于首屏内容为ajax异步渲染的应用，需要在首屏渲染完成后调用接口中标记首屏时间，代码形如
        
        yourcallbackfunction = function(data){
            window.bd && bd._qdc && bd._qdc.mark && bd._qdc.mark("fs");
            //deal with data
        }
    
#### 使用Clouda开发框架 ####

Clouda开发框架是一个实时的JavaScript开发框架；使用该框架，可方便开发者开发。

<font color="red">说明：</font>

<font color="red">开发者也可不使用该开发框架进行开发；这不是轻应用开发的必要条件。</font>

如果通过Clouda开发框架开发轻应用，则具体步骤如下：

1.	安装Clouda
2.	参考示例进行开发
3.	API reference （会包含轻应用API），
详见：[Clouda开发框架文档](http://cloudajs.org/docs)

### 调试轻应用 ###

开发轻应用时，在将该应用部署到 Web 服务器之前，您可以方便地在本地计算机上对应用进行测试。需要注意的是，调试工具必须联网才能正确运行。


#### 安装调试环境 ####

1. 点击[这里](http://cloudajs.org/lightapp/api/download/lightapp_debug.apk)下载.apk或使用移动设备扫描下面的二维码，进入轻应用调试环境安装文件（.apk）下载界面；<br>
<img style="width: 20%; height:30%; margin-left:20;" src="http://bcscdn.baidu.com/bcs-cdn/clouda-runtime/qr-download.png">


2. 点击下载界面中的“**直接下载**”，下载apk到开发机（Android系统）；<br>

3. 点击安装 apk，安装调试环境；

4. 安装成功会在桌面生成“**轻应用调试**”图标。<br>
<img style="max-width: 10%;margin-left:20;" src="http://bcscdn.baidu.com/bcs-cdn/clouda-runtime/icon20140312.png">

#### 调试轻应用
1. 点击移动设备桌面的“**轻应用调试**”图标，进入以下界面；<br>
<img style="max-width: 30%;;" src="http://bcscdn.baidu.com/bcs-cdn/clouda-runtime/app-debug.jpg">
2. 可以通过二维码扫码调试链接或输入url开始调试
3. 本地调试通过后，可以部署或者接入轻应用

### 部署轻应用 ###

可以使用百度云提供的应用托管引擎托管，如果你已部署到自己的服务器，可以跳过这一步直接接入轻应用。

1.	登录百度开放云“[管理控制台]((http://developer.baidu.com/console#app/project))”；

2.	创建一个轻应用，并将该应用托管到BAE3.0的Node.js执行环境下；

3.	发布版本，并获取应用对应的URL；

4.	通过“运行轻应用”按钮访问该应用的URL，验证发布效果。


### 接入轻应用 ###

接入轻应用，获取更多被搜索机会。

如果您是第一次将开发的应用**接入轻应用，**请按照下面步骤操作：

1. 进入[百度开放云的轻应用管理界面](http://developer.baidu.com/console#app/light)，点击**“接入轻应用”**按钮<br>

2. 在“接入轻应用”页面填入相关的信息，完成后点击**“保存”**；<br>

3. 保存成功后，后面大家可以根据自己的实际需求，管理“**渠道分发**”。<br>

## 附录 ##



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
