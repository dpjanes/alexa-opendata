# Parks

* [Data Source](http://www1.toronto.ca/City_Of_Toronto/Information_Technology/Open_Data/Data_Sets/Assets/Files/locations-20110725.xml)

# Data
## Input 

It looks like this:

    {
      "Locations": {
        "$": {
          "xmlns": "http://www.example.org/PFRMapData"
        },
        "Location": [
          {
            "LocationID": "1",
            "LocationName": "ASHBRIDGE'S BAY PARK",
            "Address": "Lake Shore Blvd Est",
            "PostalCode": "M4L 3W6",
            "Facilities": {
              "Facility": [
                {
                  "FacilityID": "42376",
                  "FacilityType": "Skateboard Park",
                  "FacilityName": "Skatebord Park",
                  "FacilityDisplayName": "Skateboard Park"
                },
                {
                  "FacilityID": "529P1-Playground-0",
                  "FacilityType": "Playground",
                  "FacilityDisplayName": "Playground"
                },
                {
                  "FacilityID": "529P1-Splash Pad-0",
                  "FacilityType": "Splash Pad",
                  "FacilityDisplayName": "Splash Pad"
                },
                {
                  "FacilityID": "7765",
                  "FacilityType": "Sport Field - B",
                  "FacilityName": "Rugby Pitch (B)",
                  "FacilityDisplayName": "Sport Field"
                }
              ]
            },
            "Intersections": {
              "Intersection": "Coxwell & Lake Shore Blvd. E."
            }
          },
          ...
        ]
      }
    }

## Output 
