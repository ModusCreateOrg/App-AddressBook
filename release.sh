#!/bin/sh

rm -rf release
mkdir release
#cd docroot/mobile
#echo "Building production version of the mobile app"
#sencha app build production -d ../../release/mobile 
#cd ../..
echo "Building production version of the desktop app"
cd docroot/desktop
sencha --debug app build production -d ../../release/desktop 
