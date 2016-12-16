## Create New Project

* go to the [Firebase Console](https://console.firebase.google.com/)
* click on **Create New Project**
* enter a name for the project, select a payment plan, click on **Create Project**

## Get Settings

This allows our code to access firebase (mostly).

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

This allows users to log in.

* click on **Authentication** (left hand side)
* click on **Set up Sign-in Method**
* enable **Google** sign in. 
  If you want to add other sign in methods you&apos;ll 
  have to look at web/src/actions/auth 

* set up the services you want, e.g. Twitter, Facebook, Google…. 
  You&apos;ll have to consult the documentation for each of
  those services to get API keys. Except for Google, which 
  you can do with a click

## Add Ouath Redirect Domain

Firebase will only allow named hosts to authenticate. 
In our case, this is [hey.homestar.io](https://hey.homestar.io).

* click on **Authentication** (left hand side)
* click on **Set up Sign-in Method**
* click on **Add Domain** (further down the page)
* add your domain name.

## Firebase-admin

This allows our code to verify that a token coming from
Firebase is actually from Firebase. We use this
to exchange a short lived token for a longer-lived
on that we use to identify users for Alexa.

* follow [these instructions](https://firebase.google.com/docs/admin/setup)
* save the downloaded file to `firebase-admin.json` in the root
  folder of this project


https://firebase.google.com/docs/admin/setup
