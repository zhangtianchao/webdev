var express = require('express');
var router = express.Router();

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
  
  if(type == "voltage"){
    for(var i=0; i<24; i++){
      lineChartData.labels.push(i);
      dataset1.data.push(randomScalingFactor());
    }
    dataset1.label = "Voltage";
    lineChartData.datasets.push(dataset1);
  }
  
  if(type == "temperature"){
    for(var i=0; i<24; i++){
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
  
  if(type == "humidity"){
    for(var i=0; i<24; i++){
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
  
  if(type == "pm"){
    for(var i=0; i<24; i++){
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

  if (action == "getsensordata") {
    mySensorData["Sensor #1"]["Voltage"] += 200;
    res.send(mySensorData);
  }

  if (action == "gethistorydata") {
    var index = req.query["index"];
    var type = req.query["type"];
    sendHistoryData(index, type, res);
  }
});

module.exports = router;
