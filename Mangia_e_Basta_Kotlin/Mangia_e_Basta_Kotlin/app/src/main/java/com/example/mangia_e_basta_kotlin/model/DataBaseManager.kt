package com.example.mangia_e_basta_kotlin.model

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import android.util.Log
import androidx.room.Room

class DataBaseManager(private val context: Context) {
    private val dao: ImageDao

    init {
        val dataBase = Room.databaseBuilder(
            context.applicationContext,
            AppDataBase::class.java,
            "images_database"
        ).build()
        dao = dataBase.imageDao()
    }

    suspend fun getImage(menu: Menu, sid: String): Bitmap? {
        val menuFromDB = dao.getImageFromDB(menu.mid)

        if (menuFromDB == null || menu.imageVersion > menuFromDB.imageVersion) {
            Log.d("DataBaseManager", "Image not found in DB or outdated")
            val imageFromServer = CommunicationController.getMenuImg(menu.mid, sid)
            dao.insertImage(ImageForDB(menu.mid, menu.imageVersion, imageFromServer.base64))
            return base64ToImage(imageFromServer.base64)
        }

        Log.d("DataBaseManager", "Image found in DB")
        return base64ToImage(menuFromDB.base64)
    }

    fun base64ToImage(base64String: String): Bitmap? {
        return try {
            // Decodifica la stringa Base64 in un array di byte
            val decodedBytes = Base64.decode(base64String, Base64.DEFAULT)
            //Log.d("MainActivity", "${decodedBytes}")
            // Converti i byte in un Bitmap
            BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)
        } catch (e: IllegalArgumentException) {
            println("Errore nella decodifica Base64: ${e.message}")
            null
        }
    }
}
