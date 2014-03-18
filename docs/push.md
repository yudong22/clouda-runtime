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