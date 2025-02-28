package com.example.mangiaebbasta.model

import android.content.Context
import android.location.Location
import android.util.Log
import androidx.core.content.ContextCompat
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import com.google.android.gms.tasks.Task
import kotlinx.coroutines.tasks.await

class PositionManager(private val context: Context) {

    private var fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)

    fun checkLocationPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            context,
            android.Manifest.permission.ACCESS_FINE_LOCATION
        ) == android.content.pm.PackageManager.PERMISSION_GRANTED
    }

    suspend fun getLocation(): Location? {
        var location: Location? = null
        if (checkLocationPermission()) {
            val task: Task<Location> = fusedLocationClient.getCurrentLocation(
                Priority.PRIORITY_HIGH_ACCURACY,
                CancellationTokenSource().token
            )
            try {
                location = task.await()
            } catch (e: Exception) {
                Log.e("PositionManager", "Error getting location: ${e.message}")
                e.printStackTrace()
            }
        } else {
            Log.w("PositionManager", "Location permission not granted")
        }
        return location
    }

}