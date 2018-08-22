var BluetoothPeripheral = function(name) {
  var bleno = require('bleno');
  var CyclingPowerService = require('./cycling-power-service');
  var debug = require('debug')('ble');
  process.env['BLENO_DEVICE_NAME'] = name;
  this.primaryService = new CyclingPowerService();
  this.last_timestamp = 0;
  this.rev_count = 0;
  var self = this;

  bleno.on('stateChange', function(state) {
    console.log('BLE state change: ' + state);

    if (state === 'poweredOn') {
      bleno.startAdvertising(process.env['BLENO_DEVICE_NAME'],
        [self.primaryService.uuid]);
    } else {
      bleno.stopAdvertising();
    }
  });

  bleno.on('advertisingStart', function(error) {
    debug('advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
      bleno.setServices([self.primaryService], function(error){
        debug('setServices: '  + (error ? 'error ' + error : 'success'));
      });
    }
  });

  this.notify = function(event) {
    debug("[BLE] " + JSON.stringify(event));
    self.primaryService.notify(event);
    if (!('watts' in event) && !('heart_rate' in event)) {
      debug("unrecognized event: %j", event);
    } else {
      if ('rev_count' in event) {
        self.rev_count = event.rev_count;
      }
      self.last_timestamp = Date.now();
    }
  };

  var ping = function() {
    var TIMEOUT = 4000;
    // send a zero event if we don't hear for 4 seconds (15 rpm)
    if (Date.now() - self.last_timestamp > TIMEOUT) {
      self.notify({'heart_rate': 0,
                   'watts': 0,
                   'rev_count': self.rev_count})
    }
    setTimeout(ping, TIMEOUT);
  }
  ping();
};

module.exports.BluetoothPeripheral = BluetoothPeripheral;
