// Main Code is from FortiusANT project and modified to suit Zwack
// https://github.com/WouterJD/FortiusANT/tree/master/node
const bleno = require('bleno');
const debugFTMS = require('debug')('ftms');
const util = require('util');

const CharacteristicUserDescription = '2901';
const SupportedPowerRange = '2AD8';

class SupportedPowerRangeCharacteristic extends  bleno.Characteristic {
  constructor() {
    debugFTMS('[SupportedPowerRangeCharacteristic] constructor');
    super({
      uuid: SupportedPowerRange,
      properties: ['read'],
      descriptors: [
        new bleno.Descriptor({
          uuid: CharacteristicUserDescription,
          value: 'Supported Power Range'
        })
      ],
    });
  }

  onReadRequest(offset, callback) {
    let buffer = new Buffer.alloc(6);
    let at = 0;

    let minimumPower = 0;
    buffer.writeInt16LE(minimumPower, at);
    at += 2;

    let maximumPower = 1000;
    buffer.writeInt16LE(maximumPower, at);
    at += 2;

    let minimumIncrement = 1;
    buffer.writeUInt16LE(minimumIncrement, at);
    at += 2;

	// For Ease Of Debugging
    let finalbuffer = buffer.slice(0, at);
    let minPowerHex = buffer.slice(0,2);
    let maxPowerHex = buffer.slice(2,4);
    let incPowerHex = buffer.slice(4,6);
    
    let minPowerDec = finalbuffer.readInt16LE(0);
    let maxPowerDec = finalbuffer.readInt16LE(2);
    let incPowerDec = finalbuffer.readInt16LE(4);

	debugFTMS('[' + SupportedPowerRange + '][SupportedPowerRangeCharacteristic] onReadRequest - ' + util.inspect(finalbuffer) );
	debugFTMS('[' + SupportedPowerRange + '][SupportedPowerRangeCharacteristic] onReadRequest - Min [HEX]' + util.inspect(minPowerHex) + ' [Decimal:' + minPowerDec + ']');
	debugFTMS('[' + SupportedPowerRange + '][SupportedPowerRangeCharacteristic] onReadRequest - Max [HEX]' + util.inspect(maxPowerHex) + ' [Decimal:' + maxPowerDec + ']'); 
	debugFTMS('[' + SupportedPowerRange + '][SupportedPowerRangeCharacteristic] onReadRequest - Inc [HEX]' + util.inspect(incPowerHex) + ' [Decimal:' + incPowerDec + ']');
    callback(this.RESULT_SUCCESS, buffer);
  }
}

module.exports = SupportedPowerRangeCharacteristic;
