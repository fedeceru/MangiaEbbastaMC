package com.example.mangia_e_basta_kotlin.components.home

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
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.navigation.NavController
import com.example.mangia_e_basta_kotlin.AppViewModel
import com.example.mangia_e_basta_kotlin.components.LoadingScreen

@Composable
fun MenuDetailsScreen(appViewModel: AppViewModel, navController: NavController) {
    val menuDetailsAndImg = appViewModel.menuDetailsAndImg.collectAsState().value
    val checkUser = appViewModel.checkUser.collectAsState().value
    var dialogMessage by remember { mutableStateOf("") }
    var showDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        appViewModel.setScreen("menuDetails")
        appViewModel.getMenuDetails()
        appViewModel.checkUser()
    }

    if (menuDetailsAndImg == null) {
        LoadingScreen()
    } else {
        LazyColumn (
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF8F8F8))
                .padding(10.dp)
        ) {
            item {
                Column {
                    // Image
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

                    Spacer(modifier = Modifier.height(20.dp))

                    // Details Card
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
                    ) {
                        Column(modifier = Modifier.padding(20.dp)) {
                            Text(
                                text = menuDetailsAndImg.menu.name,
                                style = MaterialTheme.typography.headlineMedium,
                                color = Color(0xFF333333),
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(text = menuDetailsAndImg.menu.shortDescription, style = MaterialTheme.typography.bodyLarge, color = Color(0xFF666666))
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(text = "Tempo di consegna: ${menuDetailsAndImg.menu.deliveryTime} min", style = MaterialTheme.typography.bodyLarge, color = Color(0xFF666666))
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(text = "Prezzo: ${menuDetailsAndImg.menu.price}€", style = MaterialTheme.typography.bodyLarge, color = Color(0xFF666666))
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(text = menuDetailsAndImg.menu.longDescription, style = MaterialTheme.typography.bodyMedium, color = Color(0xFF666666))
                            Spacer(modifier = Modifier.height(20.dp))
                            // Button
                            Row (
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Button(
                                    onClick = { navController.navigate("home") },
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text(text = "Indietro")
                                }
                                Spacer(modifier = Modifier.width(8.dp))
                                Button(
                                    onClick = {
                                        when {
                                            !checkUser!!.isProfileComplete -> {
                                                dialogMessage = "Completa il profilo prima di confermare l'ordine."
                                                showDialog = true
                                            }
                                            checkUser.isOrderInProgress -> {
                                                dialogMessage = "Hai già un ordine in corso. Completa l'ordine prima di procedere."
                                                showDialog = true
                                            }
                                            else -> {
                                                navController.navigate("checkOut")
                                            }
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text(text = "Acquista", color = Color.White)
                                }
                            }
                            Spacer(modifier = Modifier.weight(1F))

                            //INGREDIENTI
                            /*Button (
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.tertiary),
                                    onClick = { navController.navigate("ingredients") },
                            modifier = Modifier.padding(top = 10.dp).padding(horizontal = 16.dp).fillMaxWidth()
                            ) {
                                Text(text = "Ingredienti")
                            }*/
                        }
                    }
                }
            }
        }
    }

    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            title = { Text("Impossibile Procedere") },
            text = { Text(dialogMessage) },
            confirmButton = {
                Text(
                    text = "OK",
                    modifier = Modifier
                        .clickable { showDialog = false }
                )
            }
        )
    }
}