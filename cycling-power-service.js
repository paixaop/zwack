var util = require('util');
var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var CyclingPowerMeasurementCharacteristic = require('./cycling-power-measurement-characteristic');
var CylingPowerFeatureCharacteristic = require('./cycling-power-feature-characteristic')
var CyclingSensorLocationCharacteristic = require('./cycling-sensor-location-characteristic')

// https://developer.bluetooth.org/gatt/services/Pages/ServiceViewer.aspx?u=org.bluetooth.service.cycling_power.xml
function CyclingPowerService() {
  this.pm = new CyclingPowerMeasurementCharacteristic();
  var self = this;
  CyclingPowerService.super_.call(this, {
      uuid: '1818',
      characteristics: [
          this.pm,
          new CylingPowerFeatureCharacteristic(),
          new CyclingSensorLocationCharacteristic()
      ]
  });
  this.notify = function(event) {
    this.pm.notify(event);
  };
}

util.inherits(CyclingPowerService, BlenoPrimaryService);

module.exports = CyclingPowerService;
