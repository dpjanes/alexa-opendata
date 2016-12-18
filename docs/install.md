# Installation

## Introduction
### Environment

Our environment is set up as

* Node JS
* Linux (Centos)
* Apache HTTP

The first is non-negotiable, the other two
you can probably subtitute to taste.

### Configuration

Do

    cp ./config.json.template ./config.json

Fill in all the values. 

### Libraries

This is needed to parse ESRI shapefile data. 
It is often used by `compile.sh` scripts

    npm install -g shapefile

This is what we use to run the applications 
(and to keep them up) in production)

    npm install -g pm2

## Server Details

### Basic Setup

    git clone https://github.com/dpjanes/alexa-opendata
    npm install
    cd ./web
    npm install
    npm run build

### Open Data

First, go to `./src` and run the `compile.sh` file in all subfolders (that have them).

Compile data into our standard format

    node ./bin/compile-dst

Make Alexa Skill data

    node ./bin/create-slots

### Run Servers

    pm2 start ./bin/server-alexa.js
    pm2 start ./bin/server-web.js

### Apache

See the README in ./apache/README.md about how to set up Apache.
If you&apos;re not using Apache, you can still probably use 
this as a guide.

## Alexa Setup
