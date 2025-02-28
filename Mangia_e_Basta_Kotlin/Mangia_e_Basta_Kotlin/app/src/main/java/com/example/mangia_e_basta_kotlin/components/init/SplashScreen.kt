package com.example.mangia_e_basta_kotlin.components.init

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mangia_e_basta_kotlin.R

@Composable
fun SplashScreen() {
    // Icona dell'immagine (sostituisci con la tua risorsa immagine)
    val splashIcon: Painter = painterResource(id = R.drawable.splashdroneicon)

    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Icona
        Image(
            painter = splashIcon,
            contentDescription = null,
            modifier = Modifier
                .height(120.dp)
                .size(120.dp)
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Titolo
        Text(
            text = "MANGIA E BASTA",
            style = TextStyle(fontSize = 36.sp, fontWeight = androidx.compose.ui.text.font.FontWeight.Bold),
            color = androidx.compose.ui.graphics.Color(0xFF333333)
        )
    }
}

@Preview(showBackground = true)
@Composable
fun SplashScreenPreview() {
    SplashScreen()
}
