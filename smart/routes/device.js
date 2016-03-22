
/*
    EnergyStation {
        id: String, 			// This is the unique id, can not changed after created
    	name: String,			// Station Name
        location: String, 		// Location of Energy Station
    	devices: String,		// Energy Devices List
        createtime: Date.parse(new Date()) // Create Time
    }
    
    SmartDeviceData {
        ip: String,             //
        timestamp: String,
        digest: String,
        datatype: String,
        data: "{}"
    }
 */


const token = "61b55fd2-54f0-4c1f-a0db-88da9bba4222";
const crypto = require('crypto');
var express = require('express');
var router = express.Router();

var database = require("./database");

/* GET users listing. */
router.get('/', function(req, res, next) {
});

router.post('/', function(req, res, next) {
    var user_data = JSON.parse(req.body.user_data);
    var hash = crypto.createHash('sha256');
    hash.update(token);
    hash.update(user_data.timestamp);
    if(hash.digest('hex') == user_data.digest){
        // good packet
        res.send("success");
        
        if(user_data.datatype == "EnergyStation"){
            var station = user_data.data;
            database.findEnergyStation(station.id, function(doc){
                if(doc == null){
                    console.log("can not find station");
                    station.createtime = Date.parse(new Date());
                    //database.db.EnergyStation.insertOne(station);
                    var collection = database.db.collection('EnergyStation');
                    collection.insertOne(station);
                }else{
                    console.log("found station");
                }
            });
        }
    }else{
        // bad packet
        res.send("fail");
    }
});

module.exports = router;
