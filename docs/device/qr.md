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


