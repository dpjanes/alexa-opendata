# Open Data

## Introduction

This project is built to showcase Toronto&apos Open Data
datasets, 
[available here](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=9e56e03bb8d1e310VgnVCM10000071d60f89RCRD).

However, the techniques we use should be generally transportable to other cities
and datasets. We have code for dealing with data in the following formats.

* XML
* JSON
* KML
* Shapefile

The code is easily adapted to new projects.

As an output format, we basically have made a YAML data format
using the standard terms defined by another Open Project,
[Schema.org](http://schema.org/).

## Data Sets 

All the data importers are in `./src`. 
Right now, many of them require a separate shell script
to download data, but we hope to integrate that into the Node.JS
in the future (basically: download a zip file, extract a specific 
file, convert it to some more tractable format).

* `bicycle-stations` - BIXI bike stations
* `cultural-hotspots` - arts an architecture
* `green-p-parking` - parking
* `intersections` - major intersections. We read combinations both ways, so **Yonge and Eglinton** 
   and **Eglinton and Yonge** will both be available
* `libraries` - libaries
* `parks` - parks, skating rinks, etc.
* `places-of-interest` - tourism-reated
* `places-of-worship` - churches, mosques, etc.

These data sets are what let us to queries like 
**Where are Skating Rinks near Yonge and Eglinton**
