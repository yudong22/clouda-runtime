clouda-runtime 
==============
### 目录说明:

#### 源文件路径，模块化存储
```code
src/
src/device
src/mbaas
```

#### 源文件build未压缩文件

```code
dist/built.js
```

#### 源文件build后压缩文件

```code
build/clouda-runtime.min.js
```

#### 示例入口（使用百度浏览器或百度客户端）

```code
examples/index.html
```

### clouda-runtime用法:

#### 1.使用前注册，使用百度开发者的ak进行注册:
```code
clouda.lightapp("your_pk_here");
```
  
#### 2.runtime接口列表:
```code
  clouda.device.accelerometer.clearWatch 
  clouda.device.accelerometer.getCurrentAcceleration 
  clouda.device.accelerometer.watchAcceleration 
  clouda.device.battery.start 
  clouda.device.battery.stop 
  clouda.device.camera.getPicture 
  clouda.device.camera.cleanup 
  clouda.device.capture.captureAudio 
  clouda.device.capture.captureImage 
  clouda.device.capture.captureVideo 
  clouda.device.contact.create 
  clouda.device.contact.find 
  clouda.device.geolocation.clearWatch 
  clouda.device.geolocation.getCurrentPosition 
  clouda.device.geolocation.watchPosition 
  clouda.device.globalization.dateToString 
  clouda.device.globalization.getCurrencyPattern 
  clouda.device.globalization.getDateNames 
  clouda.device.globalization.getDatePattern 
  clouda.device.globalization.getFirstDayOfWeek 
  clouda.device.globalization.getLocaleName 
  clouda.device.globalization.getNumberPattern 
  clouda.device.globalization.getPreferredLanguage 
  clouda.device.globalization.isDayLightSavingsTime 
  clouda.device.globalization.numberToString 
  clouda.device.globalization.stringToDate 
  clouda.device.globalization.stringToNumber 
  clouda.device.network.getInfo 
  clouda.device.notification.alert 
  clouda.device.notification.confirm 
  clouda.device.notification.prompt 
  clouda.device.notification.beep 
  clouda.device.notification.vibrate 
  clouda.device.sqlite.openDatabase 
```
