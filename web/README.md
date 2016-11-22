# Web

This is the web interface to Hey, Toronto / `alexa-opendata`.

* it displays a map of Toronto
* it syncs locations to be displayed based on firebase
* the current map location is synced to firebase
* the default / "preferred" map location is synced to firebase
* it can be logged into

## Use

### Install
Clone the repo and then:
```javascript
npm install
```  
### Dev
Run an express server using Webpack with Hot Module Replacement:
```javascript
npm run dev
```
### Prod
Build the production version of your assets in the 'static' directory
```javascript
npm run build
```

## History

This is from here: [vkammerer.github.io/react-redux-firebase](http://vkammerer.github.io/react-redux-firebase)  
