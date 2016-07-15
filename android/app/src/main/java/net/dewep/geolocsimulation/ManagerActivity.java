package net.dewep.geolocsimulation;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class ManagerActivity extends AppCompatActivity {

    private boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }

    private void setStateService(TextView serviceState, boolean state) {
        if (state) {
            serviceState.setText("Service is running.");
            serviceState.setTextColor(Color.GREEN);
        } else {
            serviceState.setText("Service is not running.");
            serviceState.setTextColor(Color.RED);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manager);

        final TextView serviceState = (TextView) findViewById(R.id.serviceState);
        setStateService(serviceState, isMyServiceRunning(ManagerService.class));

        final EditText simulationIdentifier = (EditText) findViewById(R.id.simulationIdentifier);
        final EditText serverAddress = (EditText) findViewById(R.id.serverAddress);

        findViewById(R.id.startService).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ManagerActivity.this, ManagerService.class);
                intent.putExtra("simulationIdentifier", simulationIdentifier.getText().toString());
                intent.putExtra("serverAddress", serverAddress.getText().toString());
                startService(intent);
                setStateService(serviceState, true);
            }
        });

        findViewById(R.id.stopService).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ManagerActivity.this, ManagerService.class);
                stopService(intent);
                setStateService(serviceState, false);
            }
        });
    }

}
