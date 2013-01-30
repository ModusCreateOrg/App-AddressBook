#!/bin/sh
# script to build dream factory app for deployment

# initial version simply zips up the docroot directory
rm df.zip
cd docroot && zip -rq ../df.zip . ; cd ..
ls -l df.zip

