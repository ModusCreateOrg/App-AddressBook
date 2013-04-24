#!/bin/sh

TMPDIR=build-tmp

cd docroot/mobile
rm -rf build/*
echo "Building production version of the mobile app"
time sencha app build production >/dev/null 2>&1
cd ../..
echo "Building production version of the desktop app"
cd docroot/desktop
rm -rf build/*
time sencha app build production >/dev/null 2>&1
cd ../..
#echo "done"
#exit

echo "Creating document root layout"
rm -rf $TMPDIR
mkdir $TMPDIR

cp -rp docroot/img $TMPDIR
cp -rp docroot/index.html $TMPDIR
cp -rp docroot/json $TMPDIR
cp -rp docroot/desktop/build/desktop/production $TMPDIR/desktop
cp -rp extras/clear.html $TMPDIR/desktop
cp -rp docroot/mobile/build/mobile/production $TMPDIR/mobile
cp -rp extras/clear.html $TMPDIR/mobile

echo "Creating zip file"
cd $TMPDIR
zip -rq ../release.zip .
cd ..
rm -rf $TMPDIR
ls -l release.zip

echo "done"
