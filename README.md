# alexa-opendata
Voice interface for Open Data

Ask Nearby…

* where are Parks
* where are Parks near Yonge & Eglinton
* where are Parks near CN Tower
* where are Skating Rinks
* where are Public Toilets
* where are Malls
* where are Swimming Pools
* where are Hospitals
* where are Hospitals near me
* where are Hospitals near us
* where are Hospitals nearby

# Project Organizaton

All (most?) folders have their own README.md with more details

## apache

Apache configuration files.

## bin

Key Node.JS executables

## dst

All the data in `dst` is generated by `bin/compile.js`

## lib

Common library functions

## skill

This is where the Alexa Skill server goes

## src

Code related to geting open data. If you're interested in extending this to your
Open Data sets, looking at how these operate would be a good idea.

If you fork this project, feel free to add new folders in here, appropriately named.

## web

Code related to actually showing the user's request on a web page

