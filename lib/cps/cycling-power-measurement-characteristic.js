var debugCSP = require('debug')('zwack:csp');
var Bleno = require('bleno');

// Spec
//https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.cycling_power_measurement.xml

class CyclingPowerMeasurementCharacteristic extends  Bleno.Characteristic {
 
  constructor() {
    super({
      uuid: '2A63',
      value: null,
      properties: ['notify'],
      descriptors: [
        new Bleno.Descriptor({
					uuid: '2901',
					value: 'Cycling Power Measurement'
				}),
        new Bleno.Descriptor({
          // Client Characteristic Configuration
          uuid: '2902',
          value: Buffer.alloc(2)
        }),
        new Bleno.Descriptor({
          // Server Characteristic Configuration
          uuid: '2903',
          value: Buffer.alloc(2)
        })
      ]
    });
    this._updateValueCallback = null;  
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    debugCSP('[CyclingPowerMeasurementCharacteristic] client subscribed to PM');
    this._updateValueCallback = updateValueCallback;
    return this.RESULT_SUCCESS;
  };

  onUnsubscribe() {
    debugCSP('[CyclingPowerMeasurementCharacteristic] client unsubscribed from PM');
    this._updateValueCallback = null;
    return this.RESULT_UNLIKELY_ERROR;
  };

  notify(event) {
    if (!('watts' in event) && !('rev_count' in event)) {
      // ignore events with no power and no crank data
      return this.RESULT_SUCCESS;;
    }
    var buffer = new Buffer(8);
    // flags
    // 00000001 - 1   - 0x001 - Pedal Power Balance Present
    // 00000010 - 2   - 0x002 - Pedal Power Balance Reference
    // 00000100 - 4   - 0x004 - Accumulated Torque Present
    // 00001000 - 8   - 0x008 - Accumulated Torque Source
    // 00010000 - 16  - 0x010 - Wheel Revolution Data Present
    // 00100000 - 32  - 0x020 - Crank Revolution Data Present
    // 01000000 - 64  - 0x040 - Extreme Force Magnitudes Present
    // 10000000 - 128 - 0x080 - Extreme Torque Magnitudes Present
    if ('rev_count' in event) { 
      buffer.writeUInt16LE(0x020, 0);
    }
    else {
      buffer.writeUInt16LE(0x00, 0);
    }
  
    if ('watts' in event) {
      var watts = event.watts;
      debugCSP("power: " + watts);
      buffer.writeInt16LE(watts, 2);
    }
  
    if ('rev_count' in event) {
      event.rev_count = event.rev_count % 65536;
      //debugCSP("rev_count: " + event.rev_count);
      
      buffer.writeUInt16LE(event.rev_count, 4);
  
      var now = Date.now();
      var now_1024 = Math.floor(now*1e3/1024);
      var event_time = now_1024 % 65536; // rolls over every 64 seconds
      debugCSP("event time: " + event_time);
      buffer.writeUInt16LE(event_time, 6);
    }
  
    if (this._updateValueCallback) {
      this._updateValueCallback(buffer);
    }
    return this.RESULT_SUCCESS;
  }
  
  
};

module.exports = CyclingPowerMeasurementCharacteristic;
