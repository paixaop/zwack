# Zwack

Simulate/Implement a Bluetooth Low Energy sensor that can send:

  * Cycling Power and Cadence (CSP Bluetooth profile)
  * Running Speed and Cadence (RSC Bluetooth profile)

Zwack has many possible uses, here are some examples:

  * Simulate an indoor bike trainer (turbo) generating cyclist power and cadence data to test bike computers fitness, or virtual indoor bike apps. 
  * Simulate a runner's speed and pace test bike computers fitness, or virtual indoor bike apps. 
  * Integrate a common treadmill with Zwift, sending data from the treadmill to the Zwift game via bluetooth

# Supports

At this time Zwack runs succesfuly on Mac OSX and Raspberry PI. Should run on Windows but it hasn't been tested. If it works let me know.

# Installation

Install from npm

    npm i zwack

Clone this repo and run 

    npm install

You may need to install Xcode on Mac to compile the `bleno` Bluetooth module. 

# Usage

Usage is very simple just start Zwack by running

    node zwack.js

On a different machine start your fitness app, bike computer or indoor virtual bike simulation software, and pair up the Zwack BLE sensor. The sensor name should be `Zwack`, it may have some numbers added to the name or you may see the host name of the computer running zwack. It all depends on the operating system you're uing to run Zwack.

If your indoor biking software does not detect the BLE sensor, disable, then enable, the Bluetooth on the machine where Zwack is running and retry to discover and connect to the sensor again.

Updating simulation parameters

    List of Available Keys
      c/C - Decrease/Increase cadence
      p/P - Decrease/Increase power
      s/S - Decrease/Increase running speed
      d/D - Decrease/Increase running cadence  

      r/R - Decrease/Increase parameter variability
      i/I - Decrease/Increase parameter increment
      x/q - Exit

Pressing `c` on your keyboard will decrease the cadence, conversly pressing `C` (upper case) will increase simulated cadence. Same thing for power by pressing `p` or `P`.
 
The variability parameter will introduce some random variability to the cadence and power values, so they don't remain constant all the time. If you lower the variability to `0` the cadence and power values will remain constant.

Press `x` or `q` to exit Zwack.

# Requirements

Requires NodeJS, and should run in all Bleno (the base BLE module) supported platforms, which are Mac, Windows or Raspberry Pi. 

Zwack cannot run on the same computer as the fitness or virtual indoor bike app, you'll need to run them on different systems.

## Credits

Most of the code is from on [ble-cycling-power](https://github.com/olympum/ble-cycling-power) code from olympum, and has a few fixes and changes to 
update power and cadence in real time, by using the keyboard.