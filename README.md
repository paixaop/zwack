# Zwack

You can simulate a Bluetooth Low Energy enabled indoor bike trainer (turbo) and generate power and cadence data that can be used to test bike computers, fitness, or virtual indoor bike apps.

# Installation

Install from npm

    npm i zwack

Clone this repo and run 

    npm install

then 

    node zwack.js

# Usage

If your indoor biking software does not detect the BLE sensor, disable, then enable, the Bluetooth on the machine where `zwack` is running and retry to discover and connect to the sensor again.

Updating simulation parameters

    List of Available Keys
    c/C - Decrease/Increase cadence
    p/P - Decrease/Increase power

    r/R - Decrease/Increase parameter variability
    i/I - Decrease/Increase parameter increment
    x/q - Exit

By pressing 'c' will decrease the cadence, conversly pressing 'C' on your keyboard will increase simulated cadence. Same thing for power. 
The variability parameter will introduce some random variability to the cadence and power values, so they don't remain constant all the time.

Press 'x' or 'q' to exit Zwack.

# Requirements

Requires NodeJS, and should run in all Bleno (the base BLE module) supported platforms, which are Mac, Windows or Raspberry Pi. 

Zwack cannot run in the same computer as the fitness or virtual indoor bike app, you'll need to run them on different systems.

## Credits

Most of the code is from on [ble-cycling-power](https://github.com/olympum/ble-cycling-power) code from olympum, and has a few fixes and changes to 
update power and cadence in real time, by using the keyboard.