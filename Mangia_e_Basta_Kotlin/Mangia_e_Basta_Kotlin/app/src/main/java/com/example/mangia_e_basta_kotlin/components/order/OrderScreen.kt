package com.example.mangia_e_basta_kotlin.components.order

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
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
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.mangia_e_basta_kotlin.AppViewModel
import com.example.mangia_e_basta_kotlin.R
import com.example.mangia_e_basta_kotlin.components.LoadingScreen
import com.example.mangia_e_basta_kotlin.model.CompletedOrderResponse
import com.example.mangia_e_basta_kotlin.model.OnDeliveryOrderResponse
import com.example.mangia_e_basta_kotlin.model.Position
import com.mapbox.geojson.Point
import com.mapbox.maps.extension.compose.MapEffect
import com.mapbox.maps.extension.compose.MapboxMap
import com.mapbox.maps.extension.compose.animation.viewport.MapViewportState
import com.mapbox.maps.extension.compose.animation.viewport.rememberMapViewportState
import com.mapbox.maps.extension.compose.annotation.generated.PointAnnotation
import com.mapbox.maps.extension.compose.annotation.generated.PolylineAnnotation
import com.mapbox.maps.extension.compose.annotation.rememberIconImage
import com.mapbox.maps.extension.style.layers.properties.generated.LineJoin
import kotlinx.coroutines.delay
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Composable
fun OrderScreen(appViewModel: AppViewModel, navController: NavController) {
    val orderInfoAndMenu = appViewModel.orderInfoAndMenu.collectAsState().value
    val mapViewportState = rememberMapViewportState()
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        appViewModel.setScreen("order")
        appViewModel.getOrderStatus()
    }

    LaunchedEffect(orderInfoAndMenu) {
        if (orderInfoAndMenu != null) {
            when (orderInfoAndMenu.order) {
                is OnDeliveryOrderResponse -> {
                    val order = orderInfoAndMenu.order
                    mapViewportState.setCameraOptions {
                        center(Point.fromLngLat(order.currentPosition.lng, order.currentPosition.lat))
                        zoom(14.0)
                    }
                    delay(5000)
                    appViewModel.getOrderStatus()
                }
                is CompletedOrderResponse -> {
                    val order = orderInfoAndMenu.order
                    mapViewportState.setCameraOptions {
                        center(Point.fromLngLat(order.deliveryLocation.lng, order.deliveryLocation.lat))
                        zoom(14.0)
                    }
                }
            }
            isLoading = false
        }
        isLoading = false
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        when {
            isLoading -> LoadingScreen()
            orderInfoAndMenu?.order is CompletedOrderResponse -> CompletedOrderContent(orderInfoAndMenu.order as CompletedOrderResponse, orderInfoAndMenu.menu.location, mapViewportState)
            orderInfoAndMenu?.order is OnDeliveryOrderResponse -> OnDeliveryOrderContent(orderInfoAndMenu.order as OnDeliveryOrderResponse, orderInfoAndMenu.menu.location, mapViewportState)
            else -> NoOrderScreen()
        }
    }
}

@Composable
fun CompletedOrderContent(order: CompletedOrderResponse, restaurantLocation: Position, mapViewportState: MapViewportState) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        OrderInfoCard(order)
        Spacer(modifier = Modifier.height(16.dp))
        MapComponent(mapViewportState, restaurantLocation, null, order.deliveryLocation, false)
        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun OnDeliveryOrderContent(order: OnDeliveryOrderResponse, restaurantLocation: Position, mapViewportState: MapViewportState) {
    Column(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        OrderInfoCard(order)
        Spacer(modifier = Modifier.height(16.dp))
        MapComponent(mapViewportState, restaurantLocation, order.currentPosition, order.deliveryLocation, true)
        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
fun OrderInfoCard(order: Any) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = MaterialTheme.shapes.medium
    ) {
        Row (
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier.padding(16.dp).weight(3f),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {

                when {
                    order is OnDeliveryOrderResponse -> {
                        Text("ID Ordine: #${order.oid}", style = MaterialTheme.typography.titleMedium)
                        Text("Consegna Prevista: ${formatTimestamp(order.expectedDeliveryTimestamp)}", style = MaterialTheme.typography.bodyMedium)
                    }
                    order is CompletedOrderResponse -> {
                        Text("ID Ordine: #${order.oid}", style = MaterialTheme.typography.titleMedium)
                        Text("Consegnato in Data: ${formatTimestamp(order.deliveryTimestamp)}", style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
            Box(
                modifier = Modifier.size(100.dp).padding(12.dp).weight(1f)
            ) {
                when {
                    order is OnDeliveryOrderResponse -> {
                        Image(
                            painter = painterResource(id = R.drawable.deliveryonthewayicon),
                            contentDescription = "On The Way Icon",
                            modifier = Modifier.size(100.dp).padding(16.dp))
                    }
                    order is CompletedOrderResponse -> {
                        Image(
                            painter = painterResource(id = R.drawable.deliverysuccessicon),
                            contentDescription = "Delivery Success Icon",
                            modifier = Modifier.size(100.dp).padding(16.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun MapComponent(mapViewportState: MapViewportState, restaurant: Position, drone: Position?, delivery: Position, showRoute: Boolean) {
    MapboxMap(
        modifier = Modifier.fillMaxSize(),
        mapViewportState = mapViewportState,
    ) {
        MapEffect(Unit) { mapView ->
            mapView.mapboxMap.loadStyle("mapbox://styles/mapbox/streets-v11")
        }

        val restaurantIcon = rememberIconImage(key = "restaurantIcon", painter = painterResource(id = R.drawable.menumarker))
        val droneIcon = rememberIconImage(key = "droneIcon", painter = painterResource(id = R.drawable.dronemarker))
        val deliveryIcon = rememberIconImage(key = "deliveryIcon", painter = painterResource(id = R.drawable.deliverymarker))

        PointAnnotation(point = Point.fromLngLat(restaurant.lng, restaurant.lat)) {
            iconImage = restaurantIcon
            iconSize = 1.0
        }

        drone?.let {
            PointAnnotation(point = Point.fromLngLat(it.lng, it.lat)) {
                iconImage = droneIcon
                iconSize = 1.0
            }
        }

        PointAnnotation(point = Point.fromLngLat(delivery.lng, delivery.lat)) {
            iconImage = deliveryIcon
            iconSize = 1.0
        }

        if (showRoute && drone != null) {
            val routePoints = listOf(
                Point.fromLngLat(restaurant.lng, restaurant.lat),
                Point.fromLngLat(drone.lng, drone.lat),
                Point.fromLngLat(delivery.lng, delivery.lat)
            )
            PolylineAnnotation(routePoints) {
                lineColor = Color(0xFF00B0FF)
                lineWidth = 4.0
                lineJoin = LineJoin.ROUND
                lineBlur = 0.5
            }
        }
    }
}


@Composable
fun NoOrderScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
            .background(Color.White),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Image(
                painter = painterResource(id = R.drawable.emptycarticon),
                contentDescription = "Empty Cart",
                modifier = Modifier
                    .size(150.dp)
                    .padding(bottom = 24.dp)
            )
            Text(
                text = "Nessun ordine trovato",
                style = MaterialTheme.typography.headlineLarge,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            Text(
                text = "Al momento non ci sono ordini disponibili.",
                style = MaterialTheme.typography.bodyLarge,
                modifier = Modifier.padding(bottom = 16.dp)
            )
            Text(
                text = "Puoi ordinare un menù nella sezione dedicata!",
                style = MaterialTheme.typography.bodyMedium,
                modifier = Modifier.padding(bottom = 24.dp)
            )
        }
    }
}

fun formatTimestamp(timestamp: String): String {
    val instant = Instant.parse(timestamp)
    val zoneId = ZoneId.systemDefault()
    val formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")
    return instant.atZone(zoneId).format(formatter)
}
