package com.example.mangia_e_basta_kotlin.model

import android.graphics.Bitmap
import androidx.room.Entity
import androidx.room.PrimaryKey
import kotlinx.serialization.Serializable

// Data classes
@Serializable
data class UserResponseFromCreate(
    val sid: String,
    val uid: Int
)

@Serializable
data class UserResponseFromGet(
    val firstName: String?,
    val lastName: String?,
    val cardFullName: String?,
    val cardNumber: String?,
    val cardExpireMonth: Int?,
    val cardExpireYear: Int?,
    val cardCVV: String?,
    val uid: Int,
    val lastOid: Int?,
    val orderStatus: String?
)

@Serializable
data class UserForPut(
    val firstName: String?,
    val lastName: String?,
    val cardFullName: String?,
    val cardNumber: String?,
    val cardExpireMonth: Int?,
    val cardExpireYear: Int?,
    val cardCVV: String?,
    val sid: String,
)

@Serializable
data class Position(
    val lat: Double,
    val lng: Double
)

@Serializable
data class Menu(
    val mid: Int,
    val name: String,
    val price: Double,
    val location: Position,
    val imageVersion: Int,
    val shortDescription: String,
    val deliveryTime: Int
)

@Serializable
data class MenuImgResponse(
    val base64: String
)

@Serializable
data class MenuDetails(
    val mid: Int,
    val name: String,
    val price: Double,
    val location: Position,
    val imageVersion: Int,
    val shortDescription: String,
    val deliveryTime: Int,
    val longDescription: String
) {
    fun toMenu(): Menu {
        return Menu(mid, name, price, location, imageVersion, shortDescription, deliveryTime)
    }
}

@Serializable
data class DeliveryLocationAndSid(
    val sid: String,
    val deliveryLocation: Position
)

@Serializable
data class OrderStatusFromBuy(
    val oid: Int,
    val mid: Int,
    val uid: Int,
    val creationTimestamp: String,
    val status: String,
    val deliveryLocation: Position,
    val expectedDeliveryTimestamp: String,
    val currentPosition: Position,
)

@Serializable
data class OnDeliveryOrderResponse(
    val oid: Int,
    val mid: Int,
    val uid: Int,
    val creationTimestamp: String,
    val status: String,
    val deliveryLocation: Position,
    val currentPosition: Position,
    val expectedDeliveryTimestamp: String,
)

@Serializable
data class CompletedOrderResponse(
    val oid: Int,
    val mid: Int,
    val uid: Int,
    val creationTimestamp: String,
    val status: String,
    val deliveryLocation: Position,
    val deliveryTimestamp: String,
    val currentPosition: Position,
)

@Serializable
data class OrderStatusResponse(
    val status: String
)

// INGREDIENTI
@Serializable
data class IngredientFromGet(
    val name: String,
    val description: String,
    val bio: Boolean,
    val origin: String
)

// Room
@Entity (tableName = "imagesDB")
data class ImageForDB(
    @PrimaryKey val mid: Int,
    val imageVersion: Int,
    val base64: String
)

data class MenuAndImg(
    val menu: Menu,
    val img: Bitmap?
)

data class MenuMidAndImg(
    val mid: Int,
    val img: Bitmap?
)

data class MenuDetailsAndImg(
    val menu: MenuDetails,
    val img: Bitmap?
)

data class CheckUser(
    val isProfileComplete: Boolean,
    val isOrderInProgress: Boolean
)

data class OrderInfoAndMenu(
    val order: Any,
    val menu: MenuDetails
)