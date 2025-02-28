package com.example.mangia_e_basta_kotlin.components.home

import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.mangia_e_basta_kotlin.AppViewModel
import com.example.mangia_e_basta_kotlin.components.LoadingScreen
import kotlinx.coroutines.runBlocking

@Composable
fun CheckOutScreen(appViewModel: AppViewModel, navController: NavController) {
    val menuDetailsAndImg = appViewModel.menuDetailsAndImg.collectAsState().value
    var showDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        appViewModel.setScreen("checkOut")
        appViewModel.getMenuDetails()
    }

    suspend fun onConfirmOrder() {
        try {
            appViewModel.buyMenu()
            navController.navigate("home")
        } catch (e: Exception) {
            Log.d("CheckOutScreen", "Error in onConfirmOrder: ${e.message}")
            showDialog = true
        }
    }

    if (menuDetailsAndImg == null) {
        LoadingScreen()
    } else {
        Column (
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            // Card con immagine e dettagli
            Card (
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column (
                    modifier = Modifier.background(MaterialTheme.colorScheme.surface)
                ){
                    menuDetailsAndImg.img?.let {
                        Image(
                            bitmap = it.asImageBitmap(),
                            contentDescription = "Menu Image",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(300.dp)
                                .clip(RoundedCornerShape(10.dp))
                        )
                    }
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(text = menuDetailsAndImg.menu.name, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                        Text(text = menuDetailsAndImg.menu.shortDescription, fontSize = 16.sp, color = MaterialTheme.colorScheme.secondary)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(text = "Tempo di consegna: ${menuDetailsAndImg.menu.deliveryTime} min", fontSize = 14.sp)
                        Text(text = "Prezzo: ${menuDetailsAndImg.menu.price}€", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Riepilogo ordine
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "Riepilogo Ordine", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(text = "Totale: ${menuDetailsAndImg.menu.price}€", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Pulsanti
            Row (
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Button(
                    onClick = { navController.navigate("menuDetails") },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                    modifier = Modifier.weight(1f)
                ) {
                    Text(text = "Annulla")
                }
                Spacer(modifier = Modifier.width(8.dp))
                Button (
                    onClick = {
                        runBlocking {
                            onConfirmOrder()
                        }
                    },
                    modifier = Modifier.weight(1f)
                ) {
                    Text(text = "Conferma Ordine")
                }
            }
        }
    }
    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Errore") },
            text = { Text(text = "Metodo di pagamento non valido") },
            confirmButton = {
                Text(
                    text = "OK",
                    modifier = Modifier
                        .padding(8.dp)
                        .clickable { showDialog = false }
                )
            }
        )
    }
}

