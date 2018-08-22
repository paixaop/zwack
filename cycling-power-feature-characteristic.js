var util = require('util');
var os = require('os');
var exec = require('child_process').exec;

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

// Profile:
// https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.sensor_location.xml
// 13 = rear hub

var CyclingPowerFeatureCharacteristic = function() {
  CyclingPowerFeatureCharacteristic.super_.call(this, {
    uuid: '2A65',
    properties: ['read']
  });
};

util.inherits(CyclingPowerFeatureCharacteristic, Characteristic);

CyclingPowerFeatureCharacteristic.prototype.onReadRequest = function(offset, callback) {
  // return hardcoded value
  // 0001 - 0x01 - pedal power balance
  // 0010 - 0x02 - torque
  // 0100 - 0x04 - wheel revolutions
  // 1000 - 0x08 - crank revolutions
  var value = new Buffer(4);
  value.writeUInt32LE(0x08);
  callback(this.RESULT_SUCCESS, value);
};

module.exports = CyclingPowerFeatureCharacteristic;
