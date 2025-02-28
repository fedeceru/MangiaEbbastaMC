package com.example.mangia_e_basta_kotlin.model

import android.util.Log
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import kotlinx.coroutines.flow.first

class DataStoreManager(private val dataStore: DataStore<Preferences>) {

    private val SID = stringPreferencesKey("sid")
    private val UID = intPreferencesKey("uid")
    private val LAST_SCREEN = stringPreferencesKey("last_screen")
    private val LAST_MID = intPreferencesKey("last_mid")
    private val LAST_OID = intPreferencesKey("last_oid")

    suspend fun saveUser(userResponseFromCreate: UserResponseFromCreate) {
        dataStore.edit { preferences ->
            preferences[SID] = userResponseFromCreate.sid
            preferences[UID] = userResponseFromCreate.uid
        }
    }

    suspend fun getUser(): UserResponseFromCreate? {
        val preferences = dataStore.data.first()
        val sid = preferences[SID]
        val uid = preferences[UID]
        Log.d("DataStoreManager", "SID: $sid and UID: $uid")
        if (sid != null && uid != null) {
            return UserResponseFromCreate(sid, uid)
        } else {
            return null
        }
    }

    suspend fun saveLastScreen(screen: String) {
        dataStore.edit { preferences ->
            preferences[LAST_SCREEN] = screen
        }
    }

    suspend fun getLastScreen(): String {
        val preferences = dataStore.data.first()
        val lastScreen = preferences[LAST_SCREEN]
        return lastScreen ?: "home"
    }

    suspend fun saveLastMid(mid: Int) {
        dataStore.edit { preferences ->
            preferences[LAST_MID] = mid
        }
    }

    suspend fun getLastMid(): Int {
        val preferences = dataStore.data.first()
        val lastMid = preferences[LAST_MID]
        return lastMid ?: 0
    }

    suspend fun getLastOid(): Int {
        val preferences = dataStore.data.first()
        val lastOid = preferences[LAST_OID]
        return lastOid ?: 0
    }

    suspend fun saveLastOid(oid: Int) {
        dataStore.edit { preferences ->
            preferences[LAST_OID] = oid
        }
    }
}