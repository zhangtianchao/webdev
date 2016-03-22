

var PORT = process.env.PORT || 3000;

var express = require('express');
var app = express();

var wechat = require('wechat');
var config = {
  token: 'HelloTico',
  appid: 'wx2fd5141e2a8ebcaa',
  //encodingAESKey: 'encodinAESKey'
};

app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
    console.log('got a wechat request');
    
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  console.log("User Name:" + message.FromUserName);
  
  if (message.FromUserName === 'tico') {
    // 回复屌丝(普通回复)
    res.reply('hello tico');
  } else if (message.FromUserName === 'text') {
    //你也可以这样回复text类型的信息
    res.reply({
      content: 'text object',
      type: 'text'
    });
  } else if (message.FromUserName === 'hehe') {
    // 回复一段音乐
    res.reply({
      type: "music",
      content: {
        title: "来段音乐吧",
        description: "一无所有",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3",
        thumbMediaId: "thisThumbMediaId"
      }
    });
  } else {
    // 回复高富帅(图文回复)
    res.reply([
      {
        title: 'Welcome',
        description: 'Please check the sensor view',
        picurl: 'https://webdev-zhangtianchao1.c9users.io/images/wechat.jpg',
        url: 'https://webdev-zhangtianchao1.c9users.io/'
      }
    ]);
  }
}));

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

module.exports = app;
