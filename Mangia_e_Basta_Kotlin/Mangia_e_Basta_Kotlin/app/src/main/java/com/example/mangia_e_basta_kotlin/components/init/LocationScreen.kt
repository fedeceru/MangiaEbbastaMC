package com.example.mangia_e_basta_kotlin.components.init

import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.MaterialTheme
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.mangia_e_basta_kotlin.AppViewModel
import com.example.mangia_e_basta_kotlin.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Composable
fun LocationScreen(appViewModel: AppViewModel, onPermissionResult: (Boolean) -> Unit) {
    var permission by remember { mutableStateOf<Boolean?>(null) }

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        CoroutineScope(Dispatchers.Main).launch {
            appViewModel.checkLocationPermission()
            if (isGranted) {
                onPermissionResult(true)
            } else {
                permission = false
            }
        }
    }

    if (permission == false) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(120.dp)
                    .background(Color(0xFFD1D9E6), shape = CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.locationdeniedicon),
                    contentDescription = "Location Permission Denied Icon",
                    modifier = Modifier.size(60.dp)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Permesso Negato",
                style = MaterialTheme.typography.h6,
                color = Color(0xFF333333),
                modifier = Modifier.padding(bottom = 10.dp),
                textAlign = TextAlign.Center
            )

            Text(
                text = "Non puoi proseguire senza concedere l'accesso alla posizione.",
                style = MaterialTheme.typography.body2,
                color = Color(0xFF555555),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 10.dp)
            )

            Button(
                onClick = { permissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION) },
                modifier = Modifier.padding(top = 20.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF007BFF))
            ) {
                Text(
                    text = "Riprova",
                    style = MaterialTheme.typography.button,
                    color = Color.White
                )
            }
        }
    } else {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(120.dp)
                    .background(Color(0xFFD1D9E6), shape = CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.locationpermissionicon),
                    contentDescription = "Location Permission Icon",
                    modifier = Modifier.size(60.dp)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Condividi la tua posizione",
                style = MaterialTheme.typography.h6,
                color = Color(0xFF333333),
                modifier = Modifier.padding(bottom = 10.dp),
                textAlign = TextAlign.Center
            )

            Text(
                text = "La useremo per mostrarti i menù nei dintorni e la mappa per tenerne traccia.",
                style = MaterialTheme.typography.body2,
                color = Color(0xFF555555),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(bottom = 10.dp)
            )

            Button(
                onClick = { permissionLauncher.launch(Manifest.permission.ACCESS_FINE_LOCATION) },
                modifier = Modifier.padding(top = 20.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF007BFF))
            ) {
                Text(
                    text = "Concedi Permesso",
                    style = MaterialTheme.typography.button,
                    color = Color.White
                )
            }
        }
    }
}