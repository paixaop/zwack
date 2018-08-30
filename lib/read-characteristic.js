const Bleno = require('bleno');

class StaticReadCharacteristic extends Bleno.Characteristic {
	constructor(uuid, description, value) {
		super({
			uuid: uuid,
			properties: ['read'],
			value: Buffer.isBuffer(value) ? value : new Buffer.from(value),
			descriptors: [
				new Bleno.Descriptor({
					uuid: '2901',
					value: description
				})
			]
		});
		this.uuid = uuid;
		this.description = description;
		this.value = Buffer.isBuffer(value) ? value : new Buffer(value);
	}
}

module.exports = StaticReadCharacteristic;