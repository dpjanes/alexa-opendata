#
#   compile.js
# 
#   David Janes
#   IOTDB.org
#   2016-12-17
# 
#   Download data. 
#
#   Make sure you've done: npm install -g shapefile
# 
#   Copyright [2013-2017] [David P. Janes]
# 
#   This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation, either version 3 of the License, or
#   (at your option) any later version.
#   
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
#   
#   You should have received a copy of the GNU General Public License
#   along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

[ ! -d data ] && mkdir data 
cd data || exit  1
curl "http://opendata.toronto.ca/gcc/centreline_intersection_wgs84.zip" > data.zip || exit 1
unzip -o data.zip
shp2json "CENTRELINE_INTERSECTION_WGS84.shp" > ../data.json
