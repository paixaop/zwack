var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

// Profile:
// https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.body_sensor_location.xml
// 1 = chest

var SensorLocationCharacteristic = function() {
  SensorLocationCharacteristic.super_.call(this, {
    uuid: '2A38',
    properties: ['read'],
    value: new Buffer([1])
  });
};

util.inherits(SensorLocationCharacteristic, Characteristic);

SensorLocationCharacteristic.prototype.onReadRequest = function(offset, callback) {
  // return hardcoded value
  callback(this.RESULT_SUCCESS, new Buffer([1]));
};

module.exports = SensorLocationCharacteristic;
