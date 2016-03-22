var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
//var async = require('async');
const crypto = require('crypto');

// Connection URL
var url = 'mongodb://localhost:1863/smart';
var database = undefined;
var reqed = 0;

// Use connect method to connect to the Server
// MongoClient.connect(url, function(err, db) {
//     assert.equal(null, err);
//     console.log("Connected correctly to server");
//     database = db;
//     module.exports.db = db;
//     var collection = db.collection('users');
//     collection.findOne({
//         name: "admin"
//     }, function(err, doc) {
//         assert.equal(null, err);
//         if (doc == null) {
//             collection.insertOne({
//                 name: "admin",
//                 passwd: "111111",
//                 createtime: Date.parse(new Date())
//             });
//             console.log("add admin user");
//         }
//         else {
//             var date = new Date(doc.createtime);
//             console.log("found admin %s", date.toString());
//         }
//     });
// });

var waitdb = function(callback) {
    // console.log("timeout");
    if (database == undefined) {
        callback("can not connect to database", null);
    }
    else {
        callback(null, database);
    }
};

var init = function(callback) {
    if (reqed == 1) {
        // console.log("has required");
        if (typeof(callback) == 'function') {
            console.log("wait db");
            setTimeout(waitdb, 5000, callback);
        }

        return;
    }
    // console.log("first init");
    reqed = 1;
    if (database == undefined) {
        MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to mongodb");
            database = db;
            module.exports.db = database;
            //callback(err, db);
            if (typeof(callback) == 'function') {
                callback(null, database);
            }
            var collection = db.collection('users');
            collection.findOne({
                name: "admin"
            }, function(err, doc) {
                assert.equal(null, err);
                if (doc == null) {
                    collection.insertOne({
                        name: "admin",
                        passwd: crypto.createHash('sha256').update("111111").digest('hex'),
                        group: "admin",
                        createtime: Date.parse(new Date())
                    });
                    console.log("add admin user");
                }
                else {
                    var date = new Date(doc.createtime);
                    console.log("found admin %s", date.toString());
                }
            });
        });
    }
    else {
        if (typeof(callback) == 'function') {
            callback(null, database);
        }

    }
};

var checkuser = function(name, passwd, callback) {

    var collection = database.collection('users');
    collection.findOne({
        name: name,
        passwd: passwd
    }, function(err, doc) {
        assert.equal(null, err);
        if (doc == null) {
            callback(false);
        }
        else {
            console.log('found %s:%s.', name, passwd);
            callback(true);
        }
    });
};

var findEnergyStation = function(id, callback) {
    var collection = database.collection('EnergyStation');
    collection.findOne({
        id: id,
    }, function(err, doc) {
        assert.equal(null, err);
        callback(doc);
    });
};


init(function(err, dd) {
    console.log(err);
});
//module.exports = database;
module.exports.init = init;
module.exports.db = undefined;
module.exports.checkuser = checkuser;
module.exports.findEnergyStation = findEnergyStation;

//module.exports = database;
