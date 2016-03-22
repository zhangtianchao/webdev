var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:1863/smart');

var Schema = mongoose.Schema;


const EnergyStationSchema = new Schema({
	id: String, 			// This is the unique id, can not changed after created
	name: String,			// Station Name
    location: String, 		// Location of Energy Station
	devices: String,		// Energy Devices List
    create: { type: Date, default: Date.now } // Create Time
}, { collection: 'EnergyStation' });

var EnergyStation = mongoose.model('EnergyStation', EnergyStationSchema);

const EnergyDeviceSchema = new Schema({
	id: String, 			// This is the unique id, can not changed after created
	name: String,			// Device Name
	location: String, 		// Location of Energy Device
	timestamp: { type: Date, default: Date.now }
});


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    // we're connected!
    console.log('mongodb connect ok');

    var station = new EnergyStation({
        id: "00001",
		name: "Tianjin Station",
		location: "Tianjin",
		devices: "{A1, A2, A3}",
    });

    station.save();
	
	var EnergyDevice = mongoose.model('EnergyDevice', EnergyDeviceSchema, "00001");
	
	var devcie = new EnergyDevice({
		id: "A1",
		name: "Carrer Heat Pump",
		location: "Location A",
	});
	
	devcie.save();

});
