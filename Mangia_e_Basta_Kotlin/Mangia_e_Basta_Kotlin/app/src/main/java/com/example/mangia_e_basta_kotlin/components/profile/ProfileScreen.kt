package com.example.mangia_e_basta_kotlin.components.profile

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.mangia_e_basta_kotlin.AppViewModel
import com.example.mangia_e_basta_kotlin.R
import com.example.mangia_e_basta_kotlin.components.LoadingScreen
import com.example.mangia_e_basta_kotlin.model.CompletedOrderResponse
import com.example.mangia_e_basta_kotlin.model.OnDeliveryOrderResponse
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Composable
fun ProfileScreen(appViewModel: AppViewModel, navController: NavController) {
    val userInfo = appViewModel.userInfo.collectAsState().value
    val orderInfoAndMenu = appViewModel.orderInfoAndMenu.collectAsState().value

    LaunchedEffect (Unit) {
        appViewModel.setScreen("profile")
        appViewModel.getUserInfo()
        appViewModel.getOrderStatus()
    }

    if (userInfo == null) {
        LoadingScreen()
    } else {
        LazyColumn (
            modifier = Modifier.fillMaxSize().padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Box (
                    modifier = Modifier.size(130.dp)
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.userplaceholder),
                        contentDescription = "Immagine Profilo",
                        modifier = Modifier.fillMaxSize().clip(CircleShape),
                        contentScale = ContentScale.Crop,
                        colorFilter = ColorFilter.tint(MaterialTheme.colorScheme.primary)
                    )
                }
            }

            item {
                if (userInfo.lastName != null && userInfo.firstName != null) {
                    Text(
                        text = "${userInfo.firstName} ${userInfo.lastName}",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }

            item {
                if (userInfo.cardNumber != null && userInfo.cardExpireMonth != null && userInfo.cardExpireYear != null && userInfo.cardFullName != null && userInfo.cardCVV != null) {
                    Card (
                        modifier = Modifier.fillMaxWidth().padding(top = 13.dp).padding(horizontal = 16.dp),
                        shape = MaterialTheme.shapes.medium,
                        elevation = CardDefaults.cardElevation(8.dp)
                    ) {
                        Column (
                            modifier = Modifier.padding(16.dp).fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "Metodo di Pagamento",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )

                            Column(
                                modifier = Modifier.fillMaxWidth(),
                                verticalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                // Nome sulla carta
                                Text(
                                    text = userInfo.cardFullName,
                                    style = MaterialTheme.typography.bodyLarge,
                                    fontWeight = FontWeight.Normal,
                                    color = MaterialTheme.colorScheme.onSurface
                                )

                                // Numero carta
                                Text(
                                    text = userInfo.cardNumber.chunked(4).joinToString(" "),
                                    style = MaterialTheme.typography.bodyLarge,
                                    fontWeight = FontWeight.Normal,
                                    color = MaterialTheme.colorScheme.onSurface
                                )

                                // Mese/Anno di scadenza e CVV
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "${userInfo.cardExpireMonth.let { if (it < 10) "0$it" else it } }/${userInfo.cardExpireYear}",
                                        style = MaterialTheme.typography.bodyLarge,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )

                                    Text(
                                        text = "CVV: ${userInfo.cardCVV}",
                                        style = MaterialTheme.typography.bodyLarge,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                }
                            }
                        }
                    }
                }
            }

            item {
                if (userInfo.lastOid != null) {
                    Card (
                        modifier = Modifier.fillMaxWidth().padding(top = 13.dp).padding(horizontal = 16.dp),
                        shape = MaterialTheme.shapes.medium,
                        elevation = CardDefaults.cardElevation(8.dp)
                    ) {
                        Column (
                            modifier = Modifier.padding(16.dp).fillMaxWidth(),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = "Ultimo Ordine Effettuato",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.SemiBold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            if (orderInfoAndMenu != null) {
                                when {
                                    orderInfoAndMenu.order is OnDeliveryOrderResponse -> {
                                        Column {
                                            Text(text = "ID Ordine: #${userInfo.lastOid} - ${orderInfoAndMenu.menu.name}")
                                            Text(text = "Consegna Prevista: ${formatTimestamp(orderInfoAndMenu.order.expectedDeliveryTimestamp)}")
                                        }
                                    }
                                    orderInfoAndMenu.order is CompletedOrderResponse -> {
                                        Column {
                                            Text(text = "ID Ordine: #${userInfo.lastOid} - ${orderInfoAndMenu.menu.name}")
                                            Text(text = "Consegnato in Data: ${formatTimestamp(orderInfoAndMenu.order.deliveryTimestamp)}")
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            item {
                Button (
                    onClick = { navController.navigate("editProfile") },
                    modifier = Modifier.padding(top = 10.dp).padding(horizontal = 16.dp).fillMaxWidth()
                ) {
                    Text(text = "Modifica Profilo")
                }
            }
        }
    }
}

fun formatTimestamp(timestamp: String): String {
    val instant = Instant.parse(timestamp)
    val zoneId = ZoneId.systemDefault()
    val formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")
    return instant.atZone(zoneId).format(formatter)
}