package net.dewep.geolocsimulation;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.location.LocationProvider;
import android.os.Bundle;
import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;
import com.github.nkzawa.emitter.Emitter;

import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.Random;


/**
 * Created by Dewep on 13/07/2016.
 */
public class ManagerService extends Service {
    private static final String TAG = "ManagerService";
    private Socket mSocket = null;
    private LocationManager mLocationManager;

    private void onGeoLoc(JSONObject data) {
        try {
            Location newLocation = new Location(LocationManager.NETWORK_PROVIDER);
            newLocation.setLatitude(Double.valueOf(data.getString("latitude")));
            newLocation.setLongitude(Double.valueOf(data.getString("longitude")));
            newLocation.setAccuracy(Float.valueOf(data.getString("accuracy")));
            newLocation.setSpeed(0.0f);
            newLocation.setBearing(0.0f);
            newLocation.setAltitude(0.0f);
            /*newLocation.setSpeed(Float.valueOf(data.getString("speed")) / 1000);
            newLocation.setBearing(Float.valueOf(data.getString("bearing")));
            newLocation.setAltitude(Double.valueOf(data.getString("altitude")));*/
            newLocation.setTime(System.currentTimeMillis());
            Bundle bundle = new Bundle();
            bundle.putInt("mParcelledData.dataSize", 584);
            bundle.putBoolean("mockLocation", false);
            newLocation.setExtras(bundle);
            newLocation.setElapsedRealtimeNanos(SystemClock.elapsedRealtimeNanos());

            String provider = LocationManager.NETWORK_PROVIDER;
            Random r = new Random();
            if (r.nextInt(100) >= 50) {
                provider = LocationManager.GPS_PROVIDER;
            }
            newLocation.setProvider(provider);
            mLocationManager.setTestProviderEnabled(provider, true);
            mLocationManager.setTestProviderStatus(provider, LocationProvider.AVAILABLE, null, System.currentTimeMillis());
            mLocationManager.setTestProviderLocation(provider, newLocation);

            Log.i(TAG, "onGeoLoc " + newLocation.toString());
        } catch (Exception e) {
            Log.e(TAG, e.toString());
        }
    }

    @Override
    public void onCreate() {
        mLocationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        Log.i(TAG, "Service onCreate");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            Log.e(TAG, "onStartCommand intent is null");
            return Service.START_STICKY;
        }

        final String simulationIdentifier = intent.getStringExtra("simulationIdentifier");
        final String serverAddress = intent.getStringExtra("serverAddress");

        Log.i(TAG, "onStartCommand: " + serverAddress + " #" + simulationIdentifier);

        try {
            mSocket = IO.socket(serverAddress);
            mSocket.on("geoloc", new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    JSONObject data = (JSONObject) args[0];
                    onGeoLoc(data);
                }
            });
            mSocket.connect();
        } catch (URISyntaxException e) {
            Log.e(TAG, e.toString());
        }

        try {
            mLocationManager.removeTestProvider(LocationManager.GPS_PROVIDER);
            mLocationManager.removeTestProvider(LocationManager.NETWORK_PROVIDER);
        } catch (Exception e) {}

        mLocationManager.addTestProvider(
                LocationManager.GPS_PROVIDER,
                "requiresNetwork" == "",
                "requiresSatellite" == "requiresSatellite",
                "requiresCell" == "",
                "hasMonetaryCost" == "",
                "supportsAltitude" == "",
                "supportsSpeed" == "",
                "supportsBearing" == "",
                Criteria.POWER_LOW,
                Criteria.ACCURACY_HIGH
        );
        mLocationManager.addTestProvider(
                LocationManager.NETWORK_PROVIDER,
                "requiresNetwork" == "requiresNetwork",
                "requiresSatellite" == "",
                "requiresCell" == "",
                "hasMonetaryCost" == "",
                "supportsAltitude" == "",
                "supportsSpeed" == "",
                "supportsBearing" == "",
                Criteria.POWER_LOW,
                Criteria.ACCURACY_HIGH
        );

        new Thread(new Runnable() {
            @Override
            public void run() {
                mSocket.emit("register", simulationIdentifier);
            }
        }).start();

        return Service.START_STICKY;
    }

    @Override
    public IBinder onBind(Intent arg0) {
        Log.i(TAG, "Service onBind");
        return null;
    }

    @Override
    public void onDestroy() {
        if (mSocket != null) {
            mSocket.disconnect();
            mSocket = null;
        }
        Log.i(TAG, "Service onDestroy");
    }
}
