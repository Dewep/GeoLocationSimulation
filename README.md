# GeoLocation Simulation

## Pokémon GO - How I changed my geolocation

Article about this repository: [dewep.net/realisations/en/pokemon-go-how-i-changed-my-geolocation](https://www.dewep.net/realisations/en/pokemon-go-how-i-changed-my-geolocation).

## Server

You need to install [NodeJS and npm](https://nodejs.org/en/). After it, run the command `npm install` (in the `server` directory).

To run the server: `node app.js`

## Android Application

You need to install [Android Studio](https://developer.android.com/studio/index.html) (or other software allowing to compile and run an Android application on your phone). Import the project (`android` directory).

You need to run the application on your phone (in `debug` mode at least one time in order to see the application in the setting `Select mock location app`, in the developers options).

If you want to use this application with the `Pokemon GO`, you need to install and configure `XposedInstaller` and `Mock Mock Locations` (cf section `Android Installation` on [my article](https://www.dewep.net/realisations/en/pokemon-go-how-i-changed-my-geolocation)).

## Usage

Go on `http://127.0.0.1:5000` to see the web interface. Run the Android application, and start the service with the simulation identifier displayed on the web interface.
