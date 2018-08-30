#!/bin/sh

# Clear the Bluetooth attributes cache on Mac OS X
# From http://expertsoverflow.com/questions/23549859/clearing-corebluetooth-gatt-cache-without-removing-bond

sudo defaults write /Library/Preferences/com.apple.Bluetooth CoreBluetoothCache -dict
sudo launchctl unload /System/Library/LaunchDaemons/com.apple.blued.plist
sudo launchctl load /System/Library/LaunchDaemons/com.apple.blued.plist

