var debugFTMS = require('debug')('zwack:ftms');
var Bleno = require('bleno');

// Spec
// https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.characteristic.treadmill_data.xml

class TreadmillDataCharacteristic extends Bleno.Characteristic {

	constructor() {
		super({
			uuid: '2ACD',
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
		debugFTMS('[CyclingPowerMeasurementCharacteristic] client subscribed to PM');
		this._updateValueCallback = updateValueCallback;
		return this.RESULT_SUCCESS;
	};

	onUnsubscribe() {
		debugFTMS('[CyclingPowerMeasurementCharacteristic] client unsubscribed from PM');
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
		// 00000000 00000001 - 0x0001 - More Data
		// 00000000 00000010 - 0x0002 - Average Speed Present (Kilometer per hour with a resolution of 0.01)
		// 00000000 00000100 - 0x0004 - Total Distance Present
		// 00000000 00001000 - 0x0008 - Inclination and Ramp Angle Setting present
		// 00000000 00010000 - 0x0010 - Elevation Gain present
		// 00000000 00100000 - 0x0020 - Instantaneous Pace present
		// 00000000 01000000 - 0x0040 - Average Pace present
		// 00000000 10000000 - 0x0080 - Expended Energy present
		// 00000001 00000000 - 0x0100 - Heart Rate present
		// 00000010 00000000 - 0x0200 - Elapsed Time present
		// 00000100 00000000 - 0x0400 - Remaining Time present
		// 00001000 00000000 - 0x0800 - Force on Belt and Power Output present

		const flagEnum = {
			more_data: 0X01,
			avg_speed: 0x02,
			total_distance: 0x04,
			inclination: 0x08,
			elevation: 0x10,
			pace: 0x20,
			avg_pace: 0x40,
			expended_energy: 0x80,
			heart_rate: 0x100,
			elapsed_time: 0x200,
			remaining_time: 0x400,
			force: 0x800
		};

		let flags = 0;
		for (var property in event) {
			if (flagEnum.hasOwnProperty(property)) {
				flags = flags | flagEnum[property];
			}
		}
		buffer.writeUInt16LE(flags, 0);


		if ('watts' in event) {
			var watts = event.watts;
			debugFTMS("power: " + watts);
			buffer.writeInt16LE(watts, 2);
		}

		if ('rev_count' in event) {
			event.rev_count = event.rev_count % 65536;
			//debugFTMS("rev_count: " + event.rev_count);

			buffer.writeUInt16LE(event.rev_count, 4);

			var now = Date.now();
			var now_1024 = Math.floor(now * 1e3 / 1024);
			var event_time = now_1024 % 65536; // rolls over every 64 seconds
			debugFTMS("event time: " + event_time);
			buffer.writeUInt16LE(event_time, 6);
		}

		if (this._updateValueCallback) {
			this._updateValueCallback(buffer);
		}
		return this.RESULT_SUCCESS;
	}


};

module.exports = TreadmillDataCharacteristic;