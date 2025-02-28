package com.example.mangia_e_basta_kotlin.model

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [ImageForDB::class], version = 1)
abstract class AppDataBase: RoomDatabase() {
    abstract fun imageDao(): ImageDao
}