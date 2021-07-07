// Main Code is from FortiusANT project and modified to suit Zwack
// https://github.com/WouterJD/FortiusANT/tree/master/node
const bleno = require('bleno');
const debugFTMS = require('debug')('fms');

const FitnessMachineFeatureCharacteristic = require('./fitness-machine-feature-characteristic');
const IndoorBikeDataCharacteristic = require('./indoor-bike-data-characteristic');
const FitnessMachineControlPointCharacteristic = require('./fitness-machine-control-point-characteristic');
const SupportedPowerRangeCharacteristic = require('./supported-power-range-characteristic');
const FitnessMachineStatusCharacteristic = require('./fitness-machine-status-characteristic');

const FitnessMachine = '1826'

class FitnessMachineService extends bleno.PrimaryService {
  constructor(messages) {
    debugFTMS('[FitnessMachineService] constructor');
    let fmfc = new FitnessMachineFeatureCharacteristic();
    let ibdc = new IndoorBikeDataCharacteristic();
    let fmsc = new FitnessMachineStatusCharacteristic();
    let fmcpc = new FitnessMachineControlPointCharacteristic(messages, fmsc);
    let sprc = new SupportedPowerRangeCharacteristic();
    super({
      uuid: FitnessMachine,
      characteristics: [
        fmfc,
        ibdc,
        fmsc,
        fmcpc,
        sprc
      ]
    });

    this.fmfc = fmfc;
    this.ibdc = ibdc;
    this.fmsc = fmsc;
    this.fmcpc = fmcpc;
    this.sprc = sprc;
  }

  notify(event) {
    debugFTMS('[FitnessMachineService] notify')
    this.ibdc.notify(event);
    return this.RESULT_SUCCESS;
  };
}

module.exports = FitnessMachineService;
