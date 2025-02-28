package com.example.mangia_e_basta_kotlin.model

import android.net.Uri
import android.util.Log
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.android.Android
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.put
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

object CommunicationController {

    private val BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425"
    private val TAG = " CommunicationController"

    private val client = HttpClient(Android) {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
            })
        }
    }

    enum class HttpMethod {
        GET,
        POST,
        DELETE,
        PUT
    }

    suspend fun genericRequest(
        url: String, method: HttpMethod,
        queryParameters: Map<String, String> = emptyMap(),
        requestBody: Any? = null
    ): HttpResponse {

        val urlUri = Uri.parse(url)
        val urlBuilder = urlUri.buildUpon()
        queryParameters.forEach { (key, value) ->
            urlBuilder.appendQueryParameter(key, value)
        }
        val completeUrlString = urlBuilder.build().toString()
        Log.d(TAG, completeUrlString)

        val request: HttpRequestBuilder.() -> Unit = {
            requestBody?.let {
                contentType(ContentType.Application.Json)
                setBody(requestBody)
            }
        }

        val result = when (method) {
            HttpMethod.GET -> client.get(completeUrlString, request)
            HttpMethod.POST -> client.post(completeUrlString, request)
            HttpMethod.DELETE -> client.delete(completeUrlString, request)
            HttpMethod.PUT -> client.put(completeUrlString, request)
        }
        return result
    }

    suspend fun createUser(): UserResponseFromCreate {
        Log.d(TAG, "createUser")

        val url = BASE_URL + "/user"

        val httpResponse = genericRequest(url, HttpMethod.POST)
        if (!httpResponse.status.isSuccess()) {
            throw Exception("Errore nella creazione dell'utente: ${httpResponse.status}")
        }
        val result: UserResponseFromCreate = httpResponse.body()
        return result
    }

    suspend fun getUserInfo(userResponseFromCreate: UserResponseFromCreate) : UserResponseFromGet {
        Log.d(TAG, "getUserInfo")

        val url = BASE_URL + "/user/${userResponseFromCreate.uid}"
        val queryParameters = mapOf("sid" to userResponseFromCreate.sid)
        Log.d(TAG, "queryParameters: $queryParameters")

        val httpResponse = genericRequest(url, HttpMethod.GET, queryParameters)
        if (!httpResponse.status.isSuccess()) {
            throw Exception("Errore nel recupero delle informazioni dell'utente: ${httpResponse.status}")
        }
        val result: UserResponseFromGet = httpResponse.body()
        return result
    }

    suspend fun updateUserInfo(userForPut: UserForPut, uid: Int) {
        Log.d(TAG, "updateUserInfo")

        val url = BASE_URL + "/user/$uid"
        val bodyParameters = userForPut
        Log.d(TAG, "bodyParameters: $bodyParameters")

        val httpResponse = genericRequest(url, HttpMethod.PUT, requestBody = bodyParameters)
        if (!httpResponse.status.isSuccess()) {
            throw Exception("Errore nell'aggiornamento delle informazioni dell'utente: ${httpResponse.status}")
        }
    }

    suspend fun getMenuList(position: Position, sid: String): List<Menu> {
        Log.d(TAG, "getMenuList")

        val url = BASE_URL + "/menu"
        val queryParameters = mapOf(
            "lat" to position.lat.toString(),
            "lng" to position.lng.toString(),
            "sid" to sid
        )
        Log.d(TAG, "queryParameters: $queryParameters")

        val httpResponse = genericRequest(url, HttpMethod.GET, queryParameters)
        if (!httpResponse.status.isSuccess()) {
            throw Exception("Errore nel recupero del menu: ${httpResponse.status}")
        }
        val result: List<Menu> = httpResponse.body()
        return result
    }

    suspend fun getMenuImg(mid: Int, sid: String): MenuImgResponse {
        Log.d(TAG, "getMenuImg")

        val url = BASE_URL + "/menu/$mid/image"
        val queryParameters = mapOf("sid" to sid)
        Log.d(TAG, "queryParameters: $queryParameters")

        val httpResponse = genericRequest(url, HttpMethod.GET, queryParameters)
        if (!httpResponse.status.isSuccess()) {
            throw Exception("Errore nel recupero dell'immagine del menu: ${httpResponse.status}")
        }
        val result: MenuImgResponse = httpResponse.body()
        return result
    }

    suspend fun getMenuDetails(mid: Int, position: Position, sid: String): MenuDetails {
        Log.d(TAG, "getMenuDetails")

        val url = BASE_URL + "/menu/$mid"
        val queryParameters = mapOf(
            "lat" to position.lat.toString(),
            "lng" to position.lng.toString(),
            "sid" to sid
        )
        Log.d(TAG, "url: $url")

        val httpResponse = genericRequest(url, HttpMethod.GET, queryParameters)
        if (!httpResponse.status.isSuccess()) {
            throw Exception("Errore nel recupero dei dettagli del menu: ${httpResponse.status}")
        }
        val result: MenuDetails = httpResponse.body()
        return result
    }

    suspend fun buyMenu(mid: Int, deliveryLocationAndSid: DeliveryLocationAndSid): OrderStatusFromBuy {
        Log.d(TAG, "buyMenu")

        val url = BASE_URL + "/menu/$mid/buy"
        Log.d(TAG, "url: $url")

        try {
            val httpResponse = genericRequest(url, HttpMethod.POST, requestBody = deliveryLocationAndSid)

            if (httpResponse.status.value == 409) {
                Log.w(TAG, "User already has an active order")
                throw Exception("User already has an active order")
            }
            if (httpResponse.status.value == 403) {
                Log.w(TAG, "Invalid Card")
                throw Exception("Invalid card")
            }
            if (!httpResponse.status.isSuccess()) {
                throw Exception("Errore nell'acquisto del menu: ${httpResponse.status}")
            }

            val result: OrderStatusFromBuy = httpResponse.body()
            return result
        } catch (e: Exception) {
            Log.e(TAG, "Errore in buyMenu: $e")
            throw e
        }
    }

    suspend fun getOrderStatus(oid: Int, sid: String): Any {
        Log.d(TAG, "getOrderStatus")

        val url = BASE_URL + "/order/$oid"
        val queryParameters = mapOf("sid" to sid)

        val httpResponse = genericRequest(url, HttpMethod.GET, queryParameters)
        if (!httpResponse.status.isSuccess()) {
            throw Exception("Errore nel recupero dello stato dell'ordine: ${httpResponse.status}")
        }

        val partialResult: OrderStatusResponse = httpResponse.body()
        if (partialResult.status == "ON_DELIVERY") {
            val result: OnDeliveryOrderResponse = httpResponse.body()
            return result
        } else {
            val result: CompletedOrderResponse = httpResponse.body()
            return result
        }
    }

    /* INGREDIENTI
    suspend fun getIngredients(mid: Int, sid: String): List<IngredientFromGet> {
        Log.d(TAG, "getIngredients")

        val url = BASE_URL + "/menu/$mid/ingredients"
        val queryParameters = mapOf("sid" to sid)

        val httpResponse = genericRequest(url, HttpMethod.GET, queryParameters)
        if (!httpResponse.status.isSuccess()) {
            throw Exception("Errore nel recupero degli ingredienti di un menù: ${httpResponse.status}")
        }

        val result: List<IngredientFromGet> = httpResponse.body()
        return result
    }
    */
}