// Doc: https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.service.fitness_machine.xml
const Bleno = require('bleno');

// 0x2ACC
//const FitnessMachineFeatureCharacteristic = require('./fitness-machine-feature-characteristic');
const TreadmillDataCharacteristic = require('./treadmill-data-characteristic');

class FitnessMachineService extends Bleno.PrimaryService {

  constructor() {
    let powerMeasurement = new CyclingPowerMeasurementCharacteristic();
    super({
        uuid: '1818',
        characteristics: [
          powerMeasurement,
          new StaticReadCharacteristic('2A65', 'Cycling Power Feature', [0x08, 0, 0, 0]), // 0x08 - crank revolutions
          new StaticReadCharacteristic('2A5D', 'Sensor Location', [13])         // 13 = rear hub
        ]
    });

    this.powerMeasurement = powerMeasurement;
  }

  notify(event) {
    this.powerMeasurement.notify(event);
    return this.RESULT_SUCCESS;
  };
}

module.exports = FitnessMachineService;