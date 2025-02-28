package com.example.mangia_e_basta_kotlin.components.profile

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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.mangia_e_basta_kotlin.AppViewModel
import com.example.mangia_e_basta_kotlin.components.LoadingScreen
import java.util.Calendar

@Composable
fun EditProfileScreen(appViewModel: AppViewModel, navController: NavController) {
    val userInfo by appViewModel.userInfo.collectAsState()
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var cardNumber by remember { mutableStateOf("") }
    var cardExpireMonth by remember { mutableStateOf("") }
    var cardExpireYear by remember { mutableStateOf("") }
    var cardCVV by remember { mutableStateOf("") }
    var cardFullName by remember { mutableStateOf("") }

    var firstNameError by remember { mutableStateOf(false) }
    var lastNameError by remember { mutableStateOf(false) }
    var cardNumberError by remember { mutableStateOf(false) }
    var cardExpireMonthError by remember { mutableStateOf(false) }
    var cardExpireYearError by remember { mutableStateOf(false) }
    var cardCVVError by remember { mutableStateOf(false) }
    var cardFullNameError by remember { mutableStateOf(false) }

    val cardFullNameRegex = "^[A-Za-z]+ [A-Za-z]+$".toRegex()
    val nameRegex = "^[A-Za-z ]{1,31}$".toRegex()

    LaunchedEffect(Unit) {
        appViewModel.setScreen("editProfile")
        appViewModel.getUserInfo()
            userInfo?.let { info ->
                firstName = info.firstName ?: ""
                lastName = info.lastName ?: ""
                cardNumber = info.cardNumber ?: ""
                cardExpireMonth = info.cardExpireMonth?.toString() ?: ""
                cardExpireYear = info.cardExpireYear?.toString() ?: ""
                cardCVV = info.cardCVV ?: ""
                cardFullName = info.cardFullName ?: ""
            }
    }

    fun validateForm(): Boolean {
        firstNameError = firstName.isEmpty() || !firstName.matches(nameRegex)
        lastNameError = lastName.isEmpty() || !lastName.matches(nameRegex)
        cardNumberError = cardNumber.isNotEmpty() && !cardNumber.matches("\\d{16}".toRegex())
        cardExpireMonthError = cardExpireMonth.isNotEmpty() && cardExpireMonth.toIntOrNull() !in 1..12
        cardExpireYearError = cardExpireYear.length != 4 || cardExpireYear.toIntOrNull() == null || cardExpireYear.toInt() < Calendar.getInstance().get(Calendar.YEAR)
        cardCVVError = cardCVV.isNotEmpty() && !cardCVV.matches("\\d{3}".toRegex())
        cardFullNameError = cardFullName.isNotEmpty() && !cardFullName.matches(cardFullNameRegex)

        return !(firstNameError || lastNameError || cardNumberError || cardExpireMonthError || cardExpireYearError || cardCVVError || cardFullNameError)
    }

    fun onSave() {
        if (validateForm()) {
            val updatedUser = userInfo?.copy(
                firstName = firstName.ifEmpty { userInfo?.firstName },
                lastName = lastName.ifEmpty { userInfo?.lastName },
                cardFullName = cardFullName.ifEmpty { userInfo?.cardFullName },
                cardNumber = cardNumber.ifEmpty { userInfo?.cardNumber },
                cardExpireMonth = cardExpireMonth.toIntOrNull() ?: userInfo?.cardExpireMonth,
                cardExpireYear = cardExpireYear.toIntOrNull() ?: userInfo?.cardExpireYear,
                cardCVV = cardCVV.ifEmpty { userInfo?.cardCVV }
            )
            appViewModel.updateUserInfo(updatedUser)
            navController.navigate("profile")
        }
    }

    if (userInfo == null) {
        LoadingScreen()
    } else {
        LazyColumn (
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
                .padding(top = 32.dp)
                .clip(RoundedCornerShape(16.dp))
        ) {
            item {
                Column {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(MaterialTheme.colorScheme.primary)
                            .padding(vertical = 12.dp)
                    ) {
                        Text(
                            text = "Modifica Profilo",
                            fontWeight = FontWeight.Bold,
                            fontSize = 24.sp,
                            color = Color.White,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedTextField(
                        value = firstName,
                        onValueChange = { firstName = it },
                        label = { Text("Nome") },
                        isError = firstNameError,
                        modifier = Modifier.fillMaxWidth().padding(top = 10.dp)
                    )
                    if (firstNameError) Text("Nome non valido", color = Color.Red, fontSize = 12.sp)

                    OutlinedTextField(
                        value = lastName,
                        onValueChange = { lastName = it },
                        label = { Text("Cognome") },
                        isError = lastNameError,
                        modifier = Modifier.fillMaxWidth()
                    )
                    if (lastNameError) Text("Cognome non valido", color = Color.Red, fontSize = 12.sp)

                    OutlinedTextField(
                        value = cardFullName,
                        onValueChange = { cardFullName = it },
                        label = { Text("Nome e Cognome sulla Carta") },
                        isError = cardFullNameError,
                        modifier = Modifier.fillMaxWidth()
                    )
                    if (cardFullNameError) Text("Nome sulla carta di credito non valido", color = Color.Red, fontSize = 12.sp)

                    OutlinedTextField(
                        value = cardNumber,
                        onValueChange = { cardNumber = it },
                        label = { Text("Numero Carta di Credito") },
                        isError = cardNumberError,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                    if (cardNumberError) Text("Numero carta non valido", color = Color.Red, fontSize = 12.sp)

                    OutlinedTextField(
                        value = cardExpireMonth,
                        onValueChange = { cardExpireMonth = it },
                        label = { Text("Mese di Scadenza (MM)") },
                        isError = cardExpireMonthError,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                    if (cardExpireMonthError) Text("Mese non valido", color = Color.Red, fontSize = 12.sp)

                    OutlinedTextField(
                        value = cardExpireYear,
                        onValueChange = { cardExpireYear = it },
                        label = { Text("Anno di Scadenza (YYYY)") },
                        isError = cardExpireYearError,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                    if (cardExpireYearError) Text("Anno non valido", color = Color.Red, fontSize = 12.sp)

                    OutlinedTextField(
                        value = cardCVV,
                        onValueChange = { cardCVV = it },
                        label = { Text("CVV") },
                        isError = cardCVVError,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth()
                    )
                    if (cardCVVError) Text("CVV non valido", color = Color.Red, fontSize = 12.sp)

                    Spacer(modifier = Modifier.height(16.dp))

                    Row (
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Button(
                            onClick = { navController.navigate("profile") },
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(text = "Annulla")
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(onClick = { onSave() }, modifier = Modifier.weight(1f)) {
                            Text("Salva Modifiche")
                        }
                    }
                }
            }
        }
    }
}

