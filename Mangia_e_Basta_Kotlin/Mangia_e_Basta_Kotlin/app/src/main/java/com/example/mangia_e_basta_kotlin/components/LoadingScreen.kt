package com.example.mangia_e_basta_kotlin.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mangia_e_basta_kotlin.R

@Composable
fun LoadingScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(20.dp)
            .background(Color(0xFFF7F7F7)),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Icona
            Image(
                painter = painterResource(id = R.drawable.splashdroneicon),
                contentDescription = "Caricamento Icona",
                modifier = Modifier
                    .size(100.dp)
                    .padding(bottom = 30.dp)
            )

            // Indicatore di caricamento
            CircularProgressIndicator(
                color = Color(0xFF003366),
                modifier = Modifier.padding(bottom = 20.dp)
            )

            // Testo
            Text(
                text = "Caricamento...",
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF003366)
            )
        }
    }
}

@Preview
@Composable
fun LoadingScreenPreview() {
    LoadingScreen()
}
