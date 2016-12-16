## Create New Project

* go to the [Firebase Console](https://console.firebase.google.com/)
* click on **Create New Project**
* enter a name for the project, select a payment plan, click on **Create Project**

## Get Settings

* select your project (if not already selected)
* click on **Add Firebase to your web app**
* copy the JSON object to `config.json` in the home folder of this project,
  specifically in the `firebase` section. It will look something like this:

    {
        …
        "firebase": {
            "apiKey": "AIXXXXXXXXXXXXXXXXXX",
            "authDomain": "alexa-opendata.firebaseapp.com",
            "databaseURL": "https://alexa-opendata.firebaseio.com/",
            "storageBucket": "alexa-opendata-uiueieui.appspot.com"
        },
        …
    }

## Set up Authentication Methods

* click on **Authentication** (left hand side)
* click on **Set up Sign-in Method**
* enable **Google** sign in. 
  If you want to add other sign in methods you&apos;ll 
  have to look at web/src/actions/auth 

* set up the services you want, e.g. Twitter, Facebook, Google…. 
  You&apos;ll have to consult the documentation for each of
  those services to get API keys. Except for Google, which 
  you can do with a click
