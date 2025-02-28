package com.example.mangia_e_basta_kotlin.components.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.mangia_e_basta_kotlin.AppViewModel
import com.example.mangia_e_basta_kotlin.R
import com.example.mangia_e_basta_kotlin.components.LoadingScreen
import com.example.mangia_e_basta_kotlin.model.IngredientFromGet

@Composable
fun IngScreen(appViewModel: AppViewModel, navController: NavController) {
    val ingredients = appViewModel.ingredients.collectAsState().value
    val menu = appViewModel.menuDetailsAndImg.collectAsState().value
    var isLoading by remember { mutableStateOf(true) }
    var selectedIngredient by remember { mutableStateOf<IngredientFromGet?>(null) }

    LaunchedEffect(Unit) {
        appViewModel.setScreen("ingredients")
        appViewModel.getMenuDetails()
        appViewModel.getIngredients()
        isLoading = false
    }

    if (isLoading) {
        LoadingScreen()
    } else if (ingredients!!.isEmpty()) {
        Column (
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(text = "Ingredienti non Disponibili", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            Button(
                modifier = Modifier,
                onClick = { navController.navigate("menuDetails") },
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
            ) {
                Text(text = "Indietro")
            }
        }
    } else {
        LazyColumn (
            modifier = Modifier
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Text(text = "Ingredienti di ${menu!!.menu.name}", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            }
            items(ingredients) { ingredients ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(10.dp)
                        .clickable { selectedIngredient = ingredients },
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(5.dp),
                    elevation = CardDefaults.elevatedCardElevation(6.dp)
                ) {
                    Column (
                        modifier = Modifier.padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Row (
                            modifier = Modifier
                        ) {
                            Text(modifier = Modifier.weight(2.5F), text = ingredients.name, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                            if (ingredients.bio) {
                                Box(
                                    modifier = Modifier
                                        .weight(0.75F)
                                        .size(30.dp),
                                    Alignment.TopEnd
                                ) {
                                    Image(
                                        painter = painterResource(id = R.drawable.bioicon),
                                        contentDescription = "Bio Icon",
                                        modifier = Modifier.fillMaxSize()
                                    )
                                }
                            }
                        }
                        Text(text = ingredients.origin, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
            item {
                Button (
                    modifier = Modifier,
                    onClick = { navController.navigate("menuDetails") },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text(text = "Indietro")
                }
            }
        }
    }
    if (selectedIngredient != null) {
        ShowDialog(selectedIngredient!!) {
            selectedIngredient = null
        }
    }
}

@Composable
fun ShowDialog(selectedIngredient: IngredientFromGet ,onClick: () -> Unit) {

    AlertDialog(
        onDismissRequest = { onClick() },
        title = { Text("Descrizione per ${selectedIngredient.name}:") },
        text = { Text(selectedIngredient.description) } ,
        confirmButton = {
            Text(
                text = "OK",
                modifier = Modifier
                    .clickable { onClick() }
            )
        }
    )
}