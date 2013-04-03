# Modus Create / Dream Factory Address Book Application

This repository contains the source code to an address book and contact list management tool
deployable on Dream Factory's cloud infrastructure and using their API.

The suite of tools here include an ExtJS 4 based desktop administrative application and a Sencha Touch 2 based
mobile application with profiles for phone and tablet.

Both the desktop and mobile applications share a common ExtJS/Touch (works for both!) class for accessing the
Dream Factory API.

## Overview

The Address Book application was originally designed to maintain employee contact information via the desktop
 administrative interface.  A lightweight client for phones was intended to be used to lookup that contact
 information on the go.

The scope of the application was changed to include the concept of groups to which contacts can be assigned,
as well as the ability to create and edit groups and contacts via the mobile interface.  Support for tablets
was added.

## Dream Factory API

The Dream Factory database API is heavily driven by a schema description in JSON syntax.  Both the desktop
  and mobile applications are driven via an extended schema description that can be found in json/Schemas.json.

The extended JSON allows for additional information about the database structure to be considered.  Specifically,
 whether table columns should appear in the desktop grids, field editor descriptions for generating forms to
 process table records, etc.

Dream Factory API schema can be generated from the extended JSON.

Both the desktop and mobile applications load Schemas.json at startup.

The Dream Factory Launch Pad schema editor should be used to create the initial database structure.  The JSON
files used to create the database schema can be found in the schema/ directory.

## Desktop Application

The desktop application is based upon a generic SchemaGrid component that can be found in app/ux/SchemaGrid.js.
This component generates ExtJS 4 grid and data store dynamically.  It also presents buttons for performing
CRUD operations on the records displayed in the grid.  The SchemaGrid component also generates forms for editing
the records and generates the required Dream Factory API URLs for the CRUD operations.

The component may be configured to present a search textfield that will filter the items in the grid.  As the
user types, the grid will refresh.

The SchemaGrid component can also be configured to allow for custom or extended functionality.  For example,
the application can provide custom record loading functions, deletion functions, etc.  This is desirable to
deal with loading associated data before editing a record, or deleting associated records in a second table
when deleting records.

## Mobile Application

The mobile application is a pretty good exmaple of using Sencha Touch and device profiles.  Much of the code
is common between the Tablet and Phone profiles.

## Directory Structure

The docroot folder contains the application's HTML, JavaScript, CSS, and static assets.

The docroot folder contains a desktop/ directory which is the ExtJS 4 application.  The mobile/ directory
 contains the Sencha Touch 2 applicatio.

The index.html file in the docroot folder contains a simple JavaScript that detects if running in a desktop or
mobile browser and redirects to the desktop/ or mobile/ URL accordingly.  This should allow the application to be
run from the Launch Pad from desktop or mobile browser.

The extras folder contains a vhost configuration for Apache and instructions for using it.  This setup allows
for local development (on MacOS, Linux, potentially Windows) and accessing the Dream Factory API host via
reverse proxy.


# License

Licensed under the MIT License.

See license.txt for more information