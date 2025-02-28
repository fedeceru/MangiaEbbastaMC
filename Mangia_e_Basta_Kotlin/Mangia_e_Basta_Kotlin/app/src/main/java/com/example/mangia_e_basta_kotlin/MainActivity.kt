package com.example.mangia_e_basta_kotlin

import android.content.Context
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.example.mangia_e_basta_kotlin.components.Root
import com.example.mangia_e_basta_kotlin.components.init.LocationScreen
import com.example.mangia_e_basta_kotlin.components.init.SplashScreen
import com.example.mangia_e_basta_kotlin.model.DataBaseManager
import com.example.mangia_e_basta_kotlin.model.DataStoreManager
import com.example.mangia_e_basta_kotlin.ui.theme.Mangia_e_Basta_KotlinTheme
import com.example.mangiaebbasta.model.PositionManager
import kotlinx.coroutines.runBlocking

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "settings")

class MainActivity : ComponentActivity() {

    val factory = viewModelFactory {
        initializer {
            val dataStoreManager = DataStoreManager(dataStore = dataStore)
            val positionManager = PositionManager(this@MainActivity)
            val dataBaseManager = DataBaseManager(this@MainActivity)
            AppViewModel(dataStoreManager, positionManager, dataBaseManager)
        }
    }

    val appViewModel: AppViewModel by viewModels { factory }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Mangia_e_Basta_KotlinTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    MyApp(appViewModel , modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }

    override fun onStop() {
        super.onStop()
        runBlocking {
            appViewModel.saveData()
        }
    }
}

@Composable
fun MyApp(appViewModel: AppViewModel, modifier: Modifier = Modifier) {

    val user = appViewModel.user.collectAsState().value
    var hasPermission by remember { mutableStateOf<Boolean?>(null) }
    val location = appViewModel.posizione.collectAsState().value
    val screen = appViewModel.screen.collectAsState().value

    LaunchedEffect (user) {
        if (user == null) {
            Log.d("MyApp", "getting user..")
            appViewModel.checkfirstRun()
        } else {
            Log.d("MyApp", "user logged in")
        }
    }

    LaunchedEffect(hasPermission) {
        if (hasPermission == null) {
            Log.d("MyApp", "checking location permission..")
            hasPermission = appViewModel.checkLocationPermission()
        }
        if (hasPermission == true && location == null) {
            Log.d("MyApp", "getting location..")
            appViewModel.getLocation()
            appViewModel.reloadData()
        }
    }

    Crossfade(targetState = user) { user ->
        if (user == null) {
            SplashScreen()
        } else {
            if (hasPermission == null) {
                SplashScreen()
            } else {
                if (hasPermission == false) {
                    LocationScreen(appViewModel) { grantedPermission ->
                        hasPermission = grantedPermission
                    }
                } else {
                    if (location == null || screen == null) {
                        SplashScreen()
                    } else {
                        Root(appViewModel)
                    }
                }
            }
        }
    }
}