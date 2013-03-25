#!/bin/sh
# script to build dream factory app for deployment
#
# Copyright (c) 2013 Modus Create, Inc.
# This file is licensed under the terms of the MIT license.
# See the file license.txt for more details.

# initial version simply zips up the docroot directory
rm df.zip
cd docroot && zip -rq ../df.zip . ; cd ..
ls -l df.zip

