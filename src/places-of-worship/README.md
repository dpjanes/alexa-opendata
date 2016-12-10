# Places of Worship

* [Data Source](http://www1.toronto.ca/wps/portal/contentonly?vgnextoid=8cb289fe9c18b210VgnVCM1000003dd60f89RCRD)

Use `sh download.sh` to download the data. 
At some point we'll integrate that into the Node.JS code.

# Data

## Input

    {
      "features": [
        {
          "geometry": {
            "coordinates": [
              -79.4261335643119,
              43.6650501419514
            ],
            "type": "Point"
          },
          "properties": {
            "ADDRESS": "851 Ossington Ave",
            "CITY": "Toronto",
            "CONTACT_TY": null,
            "DENOMINATI": null,
            "EXT": null,
            "FAITH": "Christian",
            "FAX": null,
            "FIRST_NAME": null,
            "FORUM": null,
            "GROUPING": null,
            "LAST_NAME": null,
            "LATITUDE": 43.665050142,
            "LONGITUDE": -79.4261335643,
            "NEIGHBOURH": "Dovercourt-Wallace Emerson-Junction (93)",
            "ORGANIZATI": "Church Of Jesus Christ Of La",
            "PHONE": null,
            "POSITION": null,
            "POSTAL": "M6G3V2",
            "WARD": "Trinity-Spadina (19)",
            "WEBSITE": null,
            "X": 310741.624,
            "Y": 4835902.424
          },
          "type": "Feature"
        },
        ...
      ],
      "type": "FeatureCollection"
    }

## Output

