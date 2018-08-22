var BluetoothPeripheral = require('./bluetooth-peripheral');
const readline = require('readline');

// default parameters
var cadence = 90;
var power = 250;
var randomness = 5;
var sensorName = 'Zwack';

var incr = 10;
var stroke_count = 0;
var notificationInterval = 1000;
var crankRevolutions = 0;
var watts = power;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

var peripheral = new BluetoothPeripheral(sensorName);
process.stdin.on('keypress', (str, key) => {
  if (key.name === 'x' || key.name == 'q' || ( key.ctrl && key.name == 'c' ) ) {
    process.exit(); // eslint-disable-line no-process-exit
  } else if (key.name === 'l') {
    listKeys();
  } else {
    if( key.shift ) {
      factor = incr;
    }
    else {
      factor = -incr;
    }

    switch(key.name) {
      case 'c':
        cadence += factor; break;
        if( cadence < 0 ) {
          cadence = 0;
        }
        if( cadence > 200 ) {
          cadence = 200;
        }
      case 'p':
        power += factor; break;
        if( power < 0 ) {
          power = 0;
        }
        if( power > 2500 ) {
          power = 2500;
        }
      case 'r':
        randomness += factor; break;
        if( randomness < 0 ) {
          randomness = 0;
        }
      case 'i':
        incr += Math.abs(factor)/factor; break;
        if( incr < 1 ) {
          incr = 1;
        }
      defaut:
        listKeys();
    }
    listParams();
  }
});


var notifyPower = function() {
  watts = Math.floor(Math.random() * randomness + power);

  try {
    peripheral.notify({'watts': watts});
  }
  catch( e ) {
    console.error(e);
  }
  
  setTimeout(notifyPower, notificationInterval);
};

var notifyCadence = function() {
  stroke_count += 1;
  if( cadence <= 0) {
    cadence = 0;
    setTimeout(notifyCadence, notificationInterval);
    return;
  }
  try {
    peripheral.notify({'watts': watts, 'rev_count': stroke_count });
  }
  catch( e ) {
    console.error(e);
  }
  
  setTimeout(notifyCadence, 60 * 1000/(Math.random() * randomness + cadence));
};

function listParams() {
  console.log(`\nBLE Sensor parameters:`);
  console.log(`Cadence: ${cadence}`);
  console.log(`Power: ${power}`);
  console.log(`Randomness: ${randomness}`);
  console.log(`Increment: ${incr}`);
  console.log('\n');
}

function listKeys() {
  console.log(`\nList of Available Keys`);
  console.log('c/C - Decrease/Increase cadence');
  console.log('p/P - Decrease/Increase power');
  console.log('\nr/R - Decrease/Increase parameter variability');
  console.log('i/I - Decrease/Increase parameter increment');
  console.log('x/q - Exit');
  console.log();
}

// Main
console.log(`[ZWack] Faking test data for sensor: ${sensorName}`);

listKeys();
listParams();
notifyPower();
notifyCadence();

