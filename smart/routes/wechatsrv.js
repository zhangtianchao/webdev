var express = require('express');
var router = express.Router();
var assert = require('assert');
var database = require("./database");
var wechatapi = require('wechat-api');
var wechat = require('wechat');
var WechatOauth = require("wechat-oauth");
var config = {
  token: 'HelloTico',
  appid: 'wx2fd5141e2a8ebcaa',
  /*encodingAESKey: 'encodinAESKey'*/
};

const wechat_token = 'HelloTico';
const wechat_appid = 'wx2fd5141e2a8ebcaa';
const wechat_secret = 'fff1220ced0530ff1d464a5f495fdbfe';

var weapi;

//var api = new wechatapi('wx2fd5141e2a8ebcaa', 'fff1220ced0530ff1d464a5f495fdbfe');

// function initsrv(api)
// {
//   api.getFollowers(function(err, result) {
//     if (err != null) {

//     }
//     else {
//       console.log(result);
//     }
//   });
// }

database.init(function(err, db) {
  console.log("wechat database init");
  if (err != null) return;

  weapi = new wechatapi(
    'wx2fd5141e2a8ebcaa',
    'fff1220ced0530ff1d464a5f495fdbfe',
    function(callback) {
      var collection = database.db.collection('wechat_token');
      collection.findOne({
        name: "access_token"
      }, function(err, doc) {
        assert.equal(null, err);
        if (doc == null) {
          callback(null);
          console.log("no access token found");
        }
        else {
          callback(null, JSON.parse(doc.token));
          console.log("found token=" + doc.token);
        }
      });
    },
    function(token, callback) {
      var collection = database.db.collection('wechat_token');
      collection.findOne({
        name: "access_token"
      }, function(err, doc) {
        assert.equal(null, err);
        if (doc == null) {
          console.log("insert access_token");
          collection.insertOne({
            name: "access_token",
            token: JSON.stringify(token),
          });
          callback(null, token);
        }
        else {
          // 如果token过期了，会调用update吗？
          console.log("update access_token");
          collection.updateOne({
            name: "access_token"
          }, {
            $set: {
              token: JSON.stringify(token)
            }
          });
          callback(null, token);
        }
      });
    });

  weapi.getFollowers(function(err, result) {
    if (err != null) {
      console.log(err);
    }
    else {
      console.log(result);
      updateUserList(result, weapi, db);
    }
  });

  module.exports.weapi = weapi;

  var wechatoa = new WechatOauth(wechat_appid, wechat_secret);
  var overview_url = wechatoa.getAuthorizeURL('http://tico.coding.io/mobile_overview/', 'overview', 'snsapi_base');
  console.log(overview_url);
  var station_url = wechatoa.getAuthorizeURL('http://tico.coding.io/mobile_station/', 'station', 'snsapi_base');
  console.log(station_url);

  var menu = {
    "button": [{
      "type": "view",
      "name": "设备概况",
      "url": overview_url
    }, {
      "type": "view",
      "name": "详细数据",
      "url": station_url
    }]
  };
  
  weapi.createMenu(menu, function(err, result){
    if(err != null){
      console.log(result.errcode + ":" + result.errmsg);
    }else{
      console.log("create menu ok");
    }
  });
});


// setTimeout(function(){
//   weapi = new wechatapi(
//     'wx2fd5141e2a8ebcaa',
//     'fff1220ced0530ff1d464a5f495fdbfe',
//     function(callback) {
//       var collection = database.db.collection('wechat_token');
//       collection.findOne({
//         name: "access_token"
//       }, function(err, doc) {
//         assert.equal(null, err);
//         if (doc == null) {
//           callback(null);
//           console.log("no access token found");
//         }
//         else {
//           callback(null, JSON.parse(doc.token));
//           //console.log("found token=" + doc.token);
//           console.log("found token");
//         }
//       });
//     },
//     function(token, callback) {
//       var collection = database.db.collection('wechat_token');
//       collection.findOne({
//         name: "access_token"
//       }, function(err, doc) {
//         assert.equal(null, err);
//         if (doc == null) {
//           console.log("insert access_token");
//           collection.insertOne({
//             name: "access_token",
//             token: JSON.stringify(token),
//           });
//           callback(null, token);
//         }
//         else {
//           // 如果token过期了，会调用update吗？
//           console.log("update access_token");
//           collection.updateOne({
//             name: "access_token"
//           }, {
//             $set: {
//               token: JSON.stringify(token)
//             }
//           });
//           callback(null, token);
//         }
//       });
//     });
// }, 10000);


// setTimeout(function(){
//   if(weapi != undefined){
//     module.exports.weapi = weapi;
//     weapi.getFollowers(function(err, result) {
//       if (err != null) {
//         console.log(err);
//       }
//       else {
//         console.log(result);
//         updateUserList(result, weapi, database.db);
//       }
//     });
//   }else{
//     console.log("wechat api init fail");
//   }
// }, 15000);


function updateUserList(users, api, db) {
  for (var i = 0; i < users.count; i++) {
    // api.getUser(users.data.openid[i], function(err, result){
    //   if(err != null){

    //   }else{
    //     console.log(result);
    //   }
    // });
    api.getUser({
      openid: users.data.openid[i],
      lang: 'zh_CN'
    }, function(err, result) {
      if (err != null) {

      }
      else {
        //console.log(result);
        var collection = db.collection('wechat_users');
        collection.findOne({
          openid: result.openid
        }, function(err, doc) {
          assert.equal(null, err);
          if (doc == null) {
            console.log("insert " + result.openid);
            collection.insertOne(result);
          }
          else {
            console.log("found " + doc.openid);
          }
        });

      }
    });
  }
}




//router.use(express.query());
router.use('/', wechat(config, function(req, res, next) {
  var message = req.weixin;
  console.log(message);

  // event
  if (message.MsgType == 'event') {
    if (message.Event == 'subscribe') {
      res.reply('多谢关注');
      //res.end();
      insertUserToDB(message.FromUserName);
      return;
    }

    if (message.Event == 'unsubscribe') {
      res.reply("");
      //res.end();
      deleteUserFromDB(message.FromUserName);
      return;
    }

    //上报地理位置事件
    if (message.Event == 'LOCATION') {

    }

    //自定义菜单事件
    if (message.Event == 'CLICK') {

    }

    //点击菜单跳转链接时的事件推送
    if (message.Event == 'VIEW') {
      
    }
  }


  // 接收普通消息

  if (message.MsgType == 'text') {
    var collection = database.db.collection('wechat_users');
    collection.findOne({
      openid: message.FromUserName
    }, function(err, doc) {
      assert.equal(null, err);
      if (doc == null) {
        res.reply('???');
        //res.end();
        return;
      }
      else {
        res.reply(JSON.stringify(doc));
        //res.end();
        return;
      }
    });
    return;
  }

  if (message.MsgType == 'image') {

  }

  if (message.MsgType == 'voice') {

  }

  if (message.MsgType == 'video') {

  }

  if (message.MsgType == 'shortvideo') {

  }

  if (message.MsgType == 'location') {

  }

  if (message.MsgType == 'link') {

  }



  // // 微信输入信息都在req.weixin上
  // var message = req.weixin;
  // if (message.FromUserName === 'diaosi') {
  //   // 回复屌丝(普通回复)
  //   res.reply('hehe');
  // }
  // else if (message.FromUserName === 'text') {
  //   //你也可以这样回复text类型的信息
  //   res.reply({
  //     content: 'text object',
  //     type: 'text'
  //   });
  // }
  // else if (message.FromUserName === 'hehe') {
  //   // 回复一段音乐
  //   res.reply({
  //     type: "music",
  //     content: {
  //       title: "来段音乐吧",
  //       description: "一无所有",
  //       musicUrl: "http://mp3.com/xx.mp3",
  //       hqMusicUrl: "http://mp3.com/xx.mp3",
  //       thumbMediaId: "thisThumbMediaId"
  //     }
  //   });
  //   res.end();
  // }
  // else {
  //   // 回复高富帅(图文回复)
  //   res.reply([{
  //     title: '你来我家接我吧',
  //     description: '这是女神与高富帅之间的对话',
  //     picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
  //     url: 'http://nodeapi.cloudfoundry.com/'
  //   }]);
  //   res.end();
  // }

  res.reply("");
  //res.end();
}));


// var menu = 
// {
//     "button":[
//     {	
//           "type":"click",
//           "name":"今日歌曲",
//           "key":"V1001_TODAY_MUSIC"
//       },
//       {
//           "name":"菜单",
//           "sub_button":[
//           {	
//               "type":"view",
//               "name":"搜索",
//               "url":"http://www.soso.com/"
//             },
//             {
//               "type":"view",
//               "name":"视频",
//               "url":"http://v.qq.com/"
//             },
//             {
//               "type":"click",
//               "name":"赞一下我们",
//               "key":"V1001_GOOD"
//             }]
//       }]
// };

// api.createMenu(menu, function(err, result){
//   if(err != null){

//   }else{
//     console.log(result.errcode + ":" + result.errmsg);
//   }
// });

function insertUserToDB(openid) {
  weapi.getUser({
    openid: openid,
    lang: 'zh_CN'
  }, function(err, result) {
    if (err != null) {

    }
    else {
      var collection = database.db.collection('wechat_users');
      collection.findOne({
        openid: result.openid
      }, function(err, doc) {
        assert.equal(null, err);
        if (doc == null) {
          console.log("insert " + result.openid);
          collection.insertOne(result);
        }
        else {
          console.log("found " + doc.openid);
        }
      });

    }
  });
}

function deleteUserFromDB(openid) {
  var collection = database.db.collection('wechat_users');
  collection.deleteOne({
    openid: openid
  });
}

module.exports.router = router;
