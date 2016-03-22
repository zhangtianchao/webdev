var express = require('express');
var router = express.Router();

var database = require("./database");
var wechatsrv = require("./wechatsrv");

/* GET users listing. */
router.get('/', function(req, res, next) {
  var sensor_index = req.query["sensor"];
  if (sensor_index != null) {
    res.render('history', {
      sensor: sensor_index
    });
  }
  else {
    res.render('users');
  }
});

var mySensorData = {
  "Sensor #1": {
    "Status": "info",
    "Voltage": 3000,
    "Temperature": "25.1&#176;C",
    "Humidity": "25%",
    "PM2.5": "50",
    "PM10": "100"
  },
  "Sensor #2": {
    "Status": "warning",
    "Voltage": "2800",
    "Temperature": "26.1&#176;C",
    "Humidity": "25%",
    "PM2.5": "50",
    "PM10": "100"
  },
  "Sensor #3": {
    "Status": "danger",
    "Voltage": "2800",
    "Temperature": "26.1&#176;C",
    "Humidity": "25%",
    "PM2.5": "50",
    "PM10": "100"
  }
};


function sendHistoryData(index, type, res) {
  var randomScalingFactor = function() {
    return Math.round(Math.random() * 100)
  };

  var lineChartData = {
    labels: [],
    datasets: []
  };

  var dataset1 = {
    label: "???",
    fillColor: "rgba(220,220,220,0.2)",
    strokeColor: "rgba(220,220,220,1)",
    pointColor: "rgba(220,220,220,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(220,220,220,1)",
    data: []
  };

  var dataset2 = {
    label: "???",
    fillColor: "rgba(151,187,205,0.2)",
    strokeColor: "rgba(151,187,205,1)",
    pointColor: "rgba(151,187,205,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(151,187,205,1)",
    data: []
  };

  if (type == "voltage") {
    for (var i = 0; i < 24; i++) {
      lineChartData.labels.push(i);
      dataset1.data.push(randomScalingFactor());
    }
    dataset1.label = "Voltage";
    lineChartData.datasets.push(dataset1);
  }

  if (type == "temperature") {
    for (var i = 0; i < 24; i++) {
      lineChartData.labels.push(i);
      dataset1.data.push(randomScalingFactor());
      //dataset2.data.push(randomScalingFactor());
    }
    dataset1.label = "Temperature";
    //dataset2.label = "Humidity";
    //dataset2.fillColor = "rgba(249,38,114,0.2)";
    //dataset2.strokeColor = "rgba(249,38,114,1)";
    //dataset2.pointColor = "rgba(249,38,114,1)";
    lineChartData.datasets.push(dataset1);
    //lineChartData.datasets.push(dataset2);
  }

  if (type == "humidity") {
    for (var i = 0; i < 24; i++) {
      lineChartData.labels.push(i);
      //dataset1.data.push(randomScalingFactor());
      dataset2.data.push(randomScalingFactor());
    }
    //dataset1.label = "Temperature";
    dataset2.label = "Humidity";
    dataset2.fillColor = "rgba(249,38,114,0.2)";
    dataset2.strokeColor = "rgba(249,38,114,1)";
    dataset2.pointColor = "rgba(249,38,114,1)";
    //lineChartData.datasets.push(dataset1);
    lineChartData.datasets.push(dataset2);
  }

  if (type == "pm") {
    for (var i = 0; i < 24; i++) {
      lineChartData.labels.push(i);
      dataset1.data.push(randomScalingFactor());
      dataset2.data.push(randomScalingFactor());
    }
    dataset1.label = "PM10";
    dataset2.label = "PM2.5";
    lineChartData.datasets.push(dataset1);
    lineChartData.datasets.push(dataset2);
  }

  res.send(lineChartData);
}

router.post('/', function(req, res, next) {

  var action = req.query["action"];

  var i;
  var data = [];
  var item = {};

  if (action == "getsensordata") {
    mySensorData["Sensor #1"]["Voltage"] += 200;
    res.send(mySensorData);
  }

  if (action == "gethistorydata") {
    var index = req.query["index"];
    var type = req.query["type"];
    sendHistoryData(index, type, res);
  }

  if (action == "getStationList") {
    var collection = database.db.collection('EnergyStation');
    collection.find().toArray(function(err, docs) {
      if (err != null) {

      }
      else {

        docs.sort(function(a, b) {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        data = [];
        for (i = 0; i < docs.length; i++) {
          item = {};
          item.id = docs[i].id;
          item.name = docs[i].name;
          item.wechats = docs[i].wechats;
          data.push(item);
        }
        res.send(data);
      }
    });
  }

  // if(action == "saveStationList"){
  //   data = JSON.parse(req.body.data);
  //   console.log(data);
  //   for(i=0; i<data.length; i++){
  //     console.log(data[i].id)
  //   }
  //   var collection = database.db.collection('EnergyStation');
  //   for(i=0; i<data.length; i++){
  //     console.log(data[i].id);
  //     var did = data[i].id;
  //     collection.findOne({
  //       id: did
  //     }, function(err, doc) {
  //       if (doc == null) {
  //         console.log("what happen");
  //       }
  //       else {
  //         console.log("update user " + did);
  //         collection.updateOne({
  //           id: did
  //         }, {
  //           $set: JSON.stringify(data[i])
  //         });
  //         if(i == (data.length-1)) res.send(data);
  //       }
  //     });
  //   }

  // }

  if (action == "saveStationList") {
    data = JSON.parse(req.body.data);
    collection = database.db.collection('EnergyStation');

    for (i = 0; i < data.length; i++) {
      console.log(JSON.stringify(data[i]));
      collection.updateOne({
        id: data[i].id
      }, {
        $set: data[i]
      });
    }
    
    res.send(data);

  }



  if (action == "getOverviewData") {

    for (i = 0; i < 15; i++) {
      item = {};
      item.id = i;
      item.name = i + 1;
      item.price = Math.random()*100;
      if(item.price > 95){
        item.status = "danger";
      }if(item.price > 85){
        item.status = "warning";
      }else{
        item.status = ""; //['active', 'success', 'info', 'warning', 'danger']
      }
      data.push(item);
    }
    res.send(data);
  }

  if (action == "getStationData") {
    var id = req.body.id;
    data = [];
    for (i = 0; i < 5; i++) {
      item = {};
      item.id = i;
      item.name = id;
      item.price = Math.random()*100;
      if(item.price > 95){
        item.status = "danger";
      }if(item.price > 85){
        item.status = "warning";
      }else{
        item.status = ""; //['active', 'success', 'info', 'warning', 'danger']
      }
      data.push(item);
    }
    res.send(data);
  }



  if (action == "getUserList") {
    collection = database.db.collection('users');
    collection.find().toArray(function(err, docs) {
      if (err === null) {
        data = [];
        for (var i = 0; i < docs.length; i++) {
          item = {};
          item.name = docs[i].name;
          item.group = docs[i].group;
          item.wechat = docs[i].wechat;
          data.push(item);
        }
        res.send(data);
      }
    });
  }

  if (action == "getWechatUserList") {
    collection = database.db.collection('wechat_users');
    collection.find().toArray(function(err, docs) {
      if (err === null) {
        data = [];
        for (var i = 0; i < docs.length; i++) {
          item = {};
          //item.id = docs[i].openid;
          item.nickname = docs[i].nickname;
          item.group = docs[i].group;
          item.headimgurl = '<img src="' + docs[i].headimgurl + '" alt="Smiley face" height="42" width="42" />';
          data.push(item);
        }
        res.send(data);
      }
    });
  }

  if (action == "sendmsg") {
    var stationid = req.body.stationid;
    var msg = req.body.msg;
    console.log(stationid);
    collection = database.db.collection('EnergyStation');
    
    collection.findOne({
      id: stationid
    }, function(err, doc) {
      if (doc == null) {
        res.send("fail");
      }
      else {
        var wechatUsers = doc.wechats.split(',');
        var okindex = wechatUsers.length;
        var errmask = 1;
        for(i=0; i<wechatUsers.length; i++){
          var cl = database.db.collection('wechat_users');
          cl.findOne({
            nickname: wechatUsers[i]
          }, function(err, doc) {
              if(doc != null){
                var openid = doc.openid;
              //   wechatsrv.weapi.sendText(openid, msg, function(err, result) {
              //   //console.log(err);
              //   //console.log(result);
              //   if (err != null) {
              //     console.log("send to " + openid + " fail");
              //     console.log(err);
              //     console.log(result);
              //     // try again
              //     wechatsrv.weapi.sendText(openid, msg, function(err, result) {
              //       if (err != null) {
              //         res.send("fail");
              //       }
              //       else {
              //         //res.send("ok");
              //       }
              //     });
              //   }
              //   else {
              //     //res.send("ok");
              //     console.log("send to " + openid + " ok");
              //   }
              // });
                var tid = "jiuX8HvvYZhNXK-X0T7D1f0DbIIxVetjLvNlkgFFlwM";
                var tdata = {
                   "first": {
                       "value":msg,
                       "color":"#173177"
                   }};
                wechatsrv.weapi.sendTemplate(openid, tid, "", tdata, function(err, result) {
                  if(err != null){
                    if(errmask == 1){
                      res.send("fail");
                      errmask--;
                    }
                    okindex+=10;
                  }
                  if((--okindex) == 0){
                    res.send("ok");
                  }
                  console.log(err);
                  console.log(result);
                });
              }
          })
        }
      }
    });
    
    //var openid = getOpenidByStationID(stationid);
    //console.log(openid);
    //console.log(msg);
    //console.log(wechatsrv.weapi);
    
    // wechatsrv.weapi.sendText(openid, msg, function(err, result) {
    //   //console.log(err);
    //   //console.log(result);
    //   if (err != null) {
    //     // try again
    //     wechatsrv.weapi.sendText(openid, msg, function(err, result) {
    //       if (err != null) {
    //         res.send("fail");
    //       }
    //       else {
    //         res.send("ok");
    //       }
    //     });
    //   }
    //   else {
    //     res.send("ok");
    //   }
    // });
    //res.send("ok");
  }
});

module.exports = router;
