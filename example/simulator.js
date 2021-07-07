var ZwackBLE = require('../lib/zwack-ble-sensor');
const readline = require('readline');

// default parameters
var cadence = 90;
var power = 250;
var runningCadence = 180;
var runningSpeed = 10;  // 6:00 minute mile
var randomness = 5;
var sensorName = 'Zwack';

var incr = 10;
var runningIncr = 0.5;
var stroke_count = 0;
var notificationInterval = 1000;
var watts = power;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

var zwackBLE = new ZwackBLE({ 
  name: sensorName,
  modelNumber: 'ZW-101',
  serialNumber: '1'
});

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'x' || key.name == 'q' || ( key.ctrl && key.name == 'c' ) ) {
    process.exit(); // eslint-disable-line no-process-exit
  } else if (key.name === 'l') {
    listKeys();
  } else {
    if( key.shift ) {
      factor = incr;
      runFactor = runningIncr;
    }
    else {
      factor = -incr;
      runFactor = -runningIncr;
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
      case 's':
        runningSpeed += runFactor; break;
        if( runningSpeed < 0 ) {
          runningSpeed = 0;
        }
      case 'd':
        runningCadence += runFactor; break;
        if( runningCadence < 0 ) {
          runningCadence = 0;
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


var notifyPowerCSP = function() {
  watts = Math.floor(Math.random() * randomness + power);

  try {
    zwackBLE.notifyCSP({'watts': watts});
  }
  catch( e ) {
    console.error(e);
  }
  
  setTimeout(notifyPowerCSP, notificationInterval);
};


var notifyPowerFTMS = function() {
  watts = Math.floor(Math.random() * randomness + power);
  cadence = Math.floor(Math.random() + cadence)

  try {
    zwackBLE.notifyFTMS({'watts': watts, 'cadence': cadence});
  }
  catch( e ) {
    console.error(e);
  }
  
  setTimeout(notifyPowerFTMS, notificationInterval);
};


var notifyCadenceCSP = function() {
  stroke_count += 1;
  if( cadence <= 0) {
    cadence = 0;
    setTimeout(notifyCadence, notificationInterval);
    return;
  }
  try {
    zwackBLE.notifyCSP({'watts': watts, 'rev_count': stroke_count });
//     zwackBLE.notifyFTMS({'watts': watts, 'cadence': cadence/2 });
  }
  catch( e ) {
    console.error(e);
  }
  
  setTimeout(notifyCadenceCSP, 60 * 1000/(Math.random() * randomness + cadence));
};


var notifyRSC = function() {
  try {
    zwackBLE.notifyRSC({
      'speed': toMs(Math.random() + runningSpeed),
      'cadence': Math.floor(Math.random() * 2 + runningCadence)
    });
  }
  catch( e ) {
    console.error(e);
  }
  
  setTimeout(notifyRSC, notificationInterval);
};

function listParams() {
  console.log(`\nBLE Sensor parameters:`);
  console.log(`\nCycling:`)
  console.log(`    Cadence: ${cadence} RPM`);
  console.log(`    Power: ${power} W`);

  console.log('\nRunning:');

  console.log(`    Speed: ${runningSpeed} m/h, Pace: ${speedToPace(runningSpeed)} min/mi`);
  console.log(`    Cadence: ${Math.floor(runningCadence)} steps/min`);

  console.log(`\nRandomness: ${randomness}`);
  console.log(`Increment: ${incr}`);
  console.log('\n');
}

function listKeys() {
  console.log(`\nList of Available Keys`);
  console.log('c/C - Decrease/Increase cycling cadence');
  console.log('p/P - Decrease/Increase cycling power');

  console.log('s/S - Decrease/Increase running speed');
  console.log('d/D - Decrease/Increase running cadence');

  console.log('\nr/R - Decrease/Increase parameter variability');
  console.log('i/I - Decrease/Increase parameter increment');
  console.log('x/q - Exit');
  console.log();
}

function speedToPace(speed) {
  if( speed === 0 ) {
    return '00:00';
  }
  let t = 60 / speed;
  let minutes = Math.floor(t);
  let seconds = Math.floor((t - minutes) * 60);
  return minutes.toString().padStart(2,'0') + ':' + seconds.toString().padStart(2,'0');
}

function toMs(speed) {
  return (speed * 1.60934) / 3.6;
}

// Main
console.log(`[ZWack] Faking test data for sensor: ${sensorName}`);

listKeys();
listParams();
notifyPowerCSP();
notifyPowerFTMS();
notifyCadenceCSP();
notifyRSC();
