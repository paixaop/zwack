var debugCSP = require('debug')('cspw');
var Bleno = require('bleno');
const util = require('util');

// Spec
//https://developer.bluetooth.org/gatt/characteristics/Pages/CharacteristicViewer.aspx?u=org.bluetooth.characteristic.cycling_power_measurement.xml
const CyclingPowerWahooExtension = 'A026E005-0A7D-4AB3-97FA-F1500F9FEB8B';
const CharacteristicUserDescription = '2901';

const RequestUnlock = 0x20;
const SetTargetPower = 0x42;

class CyclingPowerWahooCharacteristicExtension extends  Bleno.Characteristic {
 
  constructor() {
    super({
      uuid: CyclingPowerWahooExtension,
//      value: null,
      properties: ['write'],
      descriptors: [
        new Bleno.Descriptor({
			uuid: CharacteristicUserDescription,
			value: 'Cycling Power Wahoo Extension'
		}),
      ]
    });
    this._updateValueCallback = null;  
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    debugCSP('[CyclingPowerWahooCharacteristicExtension] client subscribed to PM');
    this._updateValueCallback = updateValueCallback;
    return this.RESULT_SUCCESS;
  };

  onUnsubscribe() {
    debugCSP('[CyclingPowerWahooCharacteristicExtension] client unsubscribed from PM');
    this._updateValueCallback = null;
    return this.RESULT_UNLIKELY_ERROR;
  }; 

  notifySetTargetPower(targetPower) {
    debugFTMS('[' + FitnessMachineStatus + '][CyclingPowerWahooCharacteristicExtension] notifySetTargetPower');
    let buffer = new Buffer.alloc(3);
    buffer.writeUInt8(TargetPowerChanged)
    buffer.writeInt16LE(targetPower, 1);
    debugFTMS('[' + FitnessMachineStatus + '][CyclingPowerWahooCharacteristicExtension] notifySetTargetPower - ' + util.inspect(data));
    this.notify(buffer);
  }

  onWriteRequest(data, offset, withoutResponse, callback) {      
  let code = data.readUInt8(0);
  debugCSP('[CyclingPowerWahooCharacteristicExtension] onWriteRequest: ' + util.inspect(data) + ' code:' + util.inspect(code));

  callback(this.RESULT_SUCCESS);
  
  let response = null;
  
  switch(code) {
  	case RequestUnlock:
      debugCSP('[CyclingPowerWahooCharacteristicExtension] onWriteRequest: RequestUnlock - ' + util.inspect(data));
      break;
    
    case SetTargetPower:
      let targetPower = data.readInt16LE(1);
      debugCSP('[CyclingPowerWahooCharacteristicExtension] onWriteRequest: onWriteRequest: Set target power(W): ' + targetPower + 'w [' + util.inspect(data) + ']');
//       this.csp.notifySetTargetPower(targetPower);

      // Notify all connected clients about the new values
//       this.powerTargetSet.notifySetTargetPower(targetPower); 
      
	  break;
	  
	default:
	  debugCSP('[CyclingPowerWahooCharacteristicExtension] onWriteRequest: Unsupported OpCode:' + code);
	  break;
    }
  }
};

module.exports = CyclingPowerWahooCharacteristicExtension;
