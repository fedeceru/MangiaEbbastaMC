package com.example.mangia_e_basta_kotlin.components.home

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.example.mangia_e_basta_kotlin.AppViewModel
import com.example.mangia_e_basta_kotlin.components.LoadingScreen

@Composable
fun HomeScreen(appViewModel: AppViewModel, navController: NavController) {

    val menuAndImgList = appViewModel.menuAndImgList.collectAsState().value

    LaunchedEffect(Unit) {
        appViewModel.setScreen("home")
        appViewModel.getMenuList()
    }

    if (menuAndImgList != null) {
        LazyColumn (
            modifier = Modifier
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            items(menuAndImgList) { menuAndImg ->
                MenuListItem(menuAndImg = menuAndImg) {
                    appViewModel.setLastMenuMidAndImg(menuAndImg.menu.mid, menuAndImg.img!!)
                    navController.navigate("menuDetails")
                }
            }
        }
    } else {
        LoadingScreen()
    }

}