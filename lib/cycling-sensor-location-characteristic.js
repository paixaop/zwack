var util = require('util');
var os = require('os');
var exec = require('child_process').exec;

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

// Profile:
// https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.sensor_location.xml
// 13 = rear hub

var CyclingSensorLocationCharacteristic = function() {
  CyclingSensorLocationCharacteristic.super_.call(this, {
    uuid: '2A5D',
    properties: ['read'],
    value: new Buffer([13])
  });
};

util.inherits(CyclingSensorLocationCharacteristic, Characteristic);

CyclingSensorLocationCharacteristic.prototype.onReadRequest = function(offset, callback) {
  // return hardcoded value
  callback(this.RESULT_SUCCESS, new Buffer([13]));
};

module.exports = CyclingSensorLocationCharacteristic;
