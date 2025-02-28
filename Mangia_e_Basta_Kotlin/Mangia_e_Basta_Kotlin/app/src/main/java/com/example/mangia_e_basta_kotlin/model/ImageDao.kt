package com.example.mangia_e_basta_kotlin.model

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface ImageDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertImage(imageForDB: ImageForDB)

    @Query("SELECT * FROM imagesDB WHERE mid = :mid")
    suspend fun getImageFromDB(mid: Int): ImageForDB?

    @Query("SELECT * FROM imagesDB")
    suspend fun getAllImages(): List<ImageForDB>
}