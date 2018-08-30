/* Running Speed and Cadence Service
 * Assigned Number: 0x1814
 * 
 * Supported Characteristics:
 *  0x2A53 - RSC Measurement
 *  0x2A54 - RSC Feature
 *  0x2A5D - Sensor Location
 *  0x2A55 - SC Control Point
 * 
 * Spec: https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.running_speed_and_cadence.xml
 */ 
const Bleno = require('bleno');

const RSCMeasurementCharacteristic = require('./rsc-measurement-characteristic');
const StaticReadCharacteristic = require('../read-characteristic');

class RSCService extends Bleno.PrimaryService {

  constructor() {
    let rscMeasurement = new RSCMeasurementCharacteristic();
    super({
        uuid: '1814',
        characteristics: [
          rscMeasurement,


          // 16 Bit Mandatory Field
          // 0x01 - Instantaneous Stride Length Measurement Supported
          // 0x02 - Total Distance Measurement Supported
          // 0x04 - Walking or Running Status Supported
          // 0x08 - Calibration Procedure Supported
          // 0x10 - Multiple Sensor Locations Supported
          new StaticReadCharacteristic('2A54', 'RSC Feature', [0x00, 0, 0, 0]),

          // Sensor location
          // 0	Other
          // 1	Top of shoe
          // 2	In shoe
          // 3	Hip
          // 4	Front Wheel
          // 5	Left Crank
          // 6	Right Crank
          // 7	Left Pedal
          // 8	Right Pedal
          // 9	Front Hub
          // 10	Rear Dropout
          // 11	Chainstay
          // 12	Rear Wheel
          // 13	Rear Hub
          // 14	Chest
          // 15	Spider
          // 16	Chain Ring
          // 17 - 255	Reserved for future use
          new StaticReadCharacteristic('2A5D', 'Sensor Location', [0]) // Other
        ]
    });

    this.rscMeasurement = rscMeasurement;
  }

  notify(event) {
    this.rscMeasurement.notify(event);
    return this.RESULT_SUCCESS;
  };
}

module.exports = RSCService;
