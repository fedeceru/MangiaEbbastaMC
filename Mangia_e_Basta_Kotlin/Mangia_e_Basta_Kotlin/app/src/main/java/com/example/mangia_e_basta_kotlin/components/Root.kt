package com.example.mangia_e_basta_kotlin.components

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navigation
import com.example.mangia_e_basta_kotlin.AppViewModel
import com.example.mangia_e_basta_kotlin.components.home.CheckOutScreen
import com.example.mangia_e_basta_kotlin.components.home.HomeScreen
import com.example.mangia_e_basta_kotlin.components.home.MenuDetailsScreen
import com.example.mangia_e_basta_kotlin.components.order.OrderScreen
import com.example.mangia_e_basta_kotlin.components.profile.EditProfileScreen
import com.example.mangia_e_basta_kotlin.components.profile.ProfileScreen

@Composable
fun Root(appViewModel: AppViewModel) {
    val navController = rememberNavController()


    val currentScreen = appViewModel.screen.value ?: "home"

    val tabScreen = remember { getTabScreenFromScreen(currentScreen) }

    Scaffold(
        bottomBar = {
            val navBackStackEntry by navController.currentBackStackEntryAsState()
            val currentRoute = navBackStackEntry?.destination?.route

            BottomNavigationBar(navController, currentRoute)
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = tabScreen,
            modifier = Modifier.padding(innerPadding)
        ) {
            // Home Stack
            navigation(
                startDestination = if (tabScreen == "homeStack") currentScreen else "home",
                route = "homeStack"
            ) {
                composable("home") { HomeScreen(appViewModel, navController) }
                composable("menuDetails") { MenuDetailsScreen(appViewModel, navController) }
                composable("checkOut") { CheckOutScreen(appViewModel, navController) }
            }

            // Order Stack
            navigation(
                startDestination = if (tabScreen == "orderStack") currentScreen else "order",
                route = "orderStack"
            ) {
                composable("order") { OrderScreen(appViewModel, navController) }
            }

            // Profile Stack
            navigation(
                startDestination = if (tabScreen == "profileStack") currentScreen else "profile",
                route = "profileStack"
            ) {
                composable("profile") { ProfileScreen(appViewModel, navController) }
                composable("editProfile") { EditProfileScreen(appViewModel, navController) }
            }
        }
    }
}

@Composable
fun BottomNavigationBar(navController: NavController, currentRoute: String?) {
    NavigationBar {
        // Naviga tra i vari stack
        NavigationBarItem(
            onClick = {
                navController.navigate("homeStack") {
                    popUpTo(navController.graph.findStartDestination().id) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            },
            selected = currentRoute?.startsWith("menuDetails") == true || currentRoute?.startsWith("checkOut") == true || currentRoute?.startsWith("home") == true,
            icon = { Icon(Icons.Default.Home, contentDescription = "Home") }
        )

        NavigationBarItem(
            onClick = {
                navController.navigate("orderStack") {
                    popUpTo(navController.graph.findStartDestination().id) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            },
            selected = currentRoute?.startsWith("order") == true,
            icon = { Icon(Icons.Default.ShoppingCart, contentDescription = "Order") }
        )

        NavigationBarItem(
            onClick = {
                navController.navigate("profileStack") {
                    popUpTo(navController.graph.findStartDestination().id) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            },
            selected = currentRoute?.startsWith("profile") == true || currentRoute?.startsWith("editProfile") == true,
            icon = { Icon(Icons.Default.Person, contentDescription = "Profile") }
        )
    }
}

fun getTabScreenFromScreen(screen: String): String {
    return when (screen) {
        "home", "menuDetails", "checkOut" -> "homeStack"
        "order" -> "orderStack"
        "profile", "editProfile" -> "profileStack"
        else -> "homeStack"
    }
}

