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
  clouda.device.accelerometer 
  clouda.device.accelerometer.get 
  clouda.device.accelerometer.listen 
  clouda.device.accelerometer.stop 
  clouda.device.battery 
  clouda.device.battery.listen 
  clouda.device.battery.stop 
  clouda.device.compass 
  clouda.device.compass.get 
  clouda.device.compass.listen 
  clouda.device.compass.stop 
  clouda.device.contact 
  clouda.device.contact.find 
  clouda.device.fs 
  clouda.device.fs.postFile 
  clouda.device.geolocation 
  clouda.device.geolocation.get 
  clouda.device.geolocation.listen 
  clouda.device.geolocation.stop 
  clouda.device.globalization 
  clouda.device.globalization.getPreferredLanguage 
  clouda.device.globalization.getLocaleName 
  clouda.device.globalization.dateToString 
  clouda.device.globalization.stringToDate 
  clouda.device.globalization.getDatePattern 
  clouda.device.globalization.getDateNames 
  clouda.device.globalization.isDayLightSavingsTime 
  clouda.device.globalization.getFirstDayOfWeek 
  clouda.device.globalization.numberToString 
  clouda.device.globalization.stringToNumber 
  clouda.device.globalization.getNumberPattern 
  clouda.device.globalization.getCurrencyPattern 
  clouda.device.media 
  clouda.device.media.getPicture 
  clouda.device.media.captureMedia 
  clouda.device.MEDIA_DESTINATION 
  clouda.device.MEDIA_DESTINATION.DATA_URL 
  clouda.device.MEDIA_DESTINATION.FILE_URI 
  clouda.device.MEDIA_DESTINATION.NATIVE_URI 
  clouda.device.MEDIA_ENCODEING 
  clouda.device.MEDIA_ENCODEING.JPEG 
  clouda.device.MEDIA_ENCODEING.PNG 
  clouda.device.MEDIA_TYPE 
  clouda.device.MEDIA_TYPE.PICTURE 
  clouda.device.MEDIA_TYPE.VIDEO 
  clouda.device.MEDIA_TYPE.ALLMEDIA 
  clouda.device.MEDIA_TYPE.AUDIO 
  clouda.device.MEDIA_SOURCE 
  clouda.device.MEDIA_SOURCE.PHOTOLIBRARY 
  clouda.device.MEDIA_SOURCE.CAMERA 
  clouda.device.MEDIA_DIRECTION 
  clouda.device.MEDIA_DIRECTION.BACK 
  clouda.device.MEDIA_DIRECTION.FRONT 
  clouda.device.notification 
  clouda.device.notification.alert 
  clouda.device.notification.confirm 
  clouda.device.notification.beep 
  clouda.device.notification.vibrate 
  clouda.device.notification.prompt 
  clouda.device.reachability 
  clouda.device.reachability.ConnectionType 
  clouda.device.reachability.get 
  clouda.device.reachability.listen 
  clouda.device.reachability.stop 
  clouda.device.sqlite 
  clouda.mbaas.share 
  clouda.mbaas.qr 
  clouda.mbaas.qr.scanQrcode 
  clouda.mbaas.qr.scanBarcode 
  clouda.mbaas.qr.generate 
  clouda.mbaas.QR_TYPE 
  clouda.mbaas.QR_TYPE.BLACK 
  clouda.mbaas.QR_TYPE.COLOR 
  clouda.mbaas.QR_TYPE.DYNAMIC 
  clouda.mbaas.QR_DESTTYPE 
  clouda.mbaas.QR_DESTTYPE.GIF 
  clouda.mbaas.QR_DESTTYPE.PNG 
  clouda.mbaas.vtt 
  clouda.mbaas.vtt.startCapture 
  clouda.mbaas.vtt.speakFinish 
  clouda.mbaas.vtt.terminateCapture 
  clouda.mbaas.tts 
  clouda.mbaas.tts.say 
  clouda.mbaas.VVT_STATUS 
  clouda.mbaas.VVT_STATUS.START_RECORDING 
  clouda.mbaas.VVT_STATUS.NONE 
  clouda.mbaas.VVT_STATUS.SPEECH_START 
  clouda.mbaas.VVT_STATUS.SPEECH_END 
  clouda.mbaas.VVT_STATUS.FINISH 
  clouda.mbaas.VVT_STATUS.PLAY_BEGINE_TONE_START 
  clouda.mbaas.VVT_STATUS.PLAY_BEGINE_TONE_END 
  clouda.mbaas.VVT_STATUS.PLAY_END_TONE_START 
  clouda.mbaas.VVT_STATUS.PLAY_END_TONE_END 
  clouda.mbaas.VVT_STATUS.UPDATE_RESULTS 
  clouda.mbaas.VVT_STATUS.AUDIO_DATA 
  clouda.mbaas.VVT_STATUS.USER_CANCELED 
  clouda.mbaas.VVT_STATUS.ERROR 
  clouda.mbaas.TTS_TYPE 
  clouda.mbaas.TTS_TYPE.DICT_EN 
  clouda.mbaas.TTS_TYPE.DICT_UK 
  clouda.mbaas.TTS_TYPE.TRANS_EN 
  clouda.mbaas.TTS_TYPE.TRANS_ZH 
  clouda.touch.on 
  clouda.touch.off 
  clouda.touch.bind 
  clouda.touch.unbind 
  clouda.touch.live 
  clouda.touch.die 
  clouda.touch.config 
  clouda.touch.config.tap 
  clouda.touch.config.doubleTap 
  clouda.touch.config.tapMaxDistance 
  clouda.touch.config.hold 
  clouda.touch.config.holdTime 
  clouda.touch.config.maxDoubleTapInterval 
  clouda.touch.config.swipe 
  clouda.touch.config.swipeTime 
  clouda.touch.config.swipeMinDistance 
  clouda.touch.config.swipeFactor 
  clouda.touch.config.drag 
  clouda.touch.config.pinch 
  clouda.touch.config.minScaleRate 
  clouda.touch.config.minRotationAngle 
  clouda.touch.trigger 
```
