package com.example.mangia_e_basta_kotlin

import android.graphics.Bitmap
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.mangia_e_basta_kotlin.model.CheckUser
import com.example.mangia_e_basta_kotlin.model.CommunicationController
import com.example.mangia_e_basta_kotlin.model.CompletedOrderResponse
import com.example.mangia_e_basta_kotlin.model.DataBaseManager
import com.example.mangia_e_basta_kotlin.model.DataStoreManager
import com.example.mangia_e_basta_kotlin.model.DeliveryLocationAndSid
import com.example.mangia_e_basta_kotlin.model.MenuAndImg
import com.example.mangia_e_basta_kotlin.model.MenuDetails
import com.example.mangia_e_basta_kotlin.model.MenuDetailsAndImg
import com.example.mangia_e_basta_kotlin.model.MenuMidAndImg
import com.example.mangia_e_basta_kotlin.model.OnDeliveryOrderResponse
import com.example.mangia_e_basta_kotlin.model.OrderInfoAndMenu
import com.example.mangia_e_basta_kotlin.model.Position
import com.example.mangia_e_basta_kotlin.model.UserForPut
import com.example.mangia_e_basta_kotlin.model.UserResponseFromCreate
import com.example.mangia_e_basta_kotlin.model.UserResponseFromGet
import com.example.mangiaebbasta.model.PositionManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AppViewModel(
    private val dataStoreManager: DataStoreManager,
    private val positionManager: PositionManager,
    private val dataBaseManager: DataBaseManager
) : ViewModel() {

    private val _screen = MutableStateFlow(null as String?)
    val screen: StateFlow<String?> = _screen

    private val _user = MutableStateFlow(null as UserResponseFromCreate?)
    val user: StateFlow<UserResponseFromCreate?> = _user

    private val _posizione = MutableStateFlow(null as Position?)
    val posizione: StateFlow<Position?> = _posizione

    private val _userInfo = MutableStateFlow(null as UserResponseFromGet?)
    val userInfo: StateFlow<UserResponseFromGet?> = _userInfo

    private val _lastMenuMidAndImg = MutableStateFlow(null as MenuMidAndImg?)
    val lastMenuMidAndImg: StateFlow<MenuMidAndImg?> = _lastMenuMidAndImg

    private val _menuDetailsAndImg = MutableStateFlow(null as MenuDetailsAndImg?)
    val menuDetailsAndImg: StateFlow<MenuDetailsAndImg?> = _menuDetailsAndImg

    private val _menuAndImgList = MutableStateFlow(null as List<MenuAndImg>?)
    val menuAndImgList: StateFlow<List<MenuAndImg>?> = _menuAndImgList

    private val _checkUser = MutableStateFlow(null as CheckUser?)
    val checkUser: StateFlow<CheckUser?> = _checkUser

    private val _orderInfoAndMenu = MutableStateFlow(null as OrderInfoAndMenu?)
    val orderInfoAndMenu: StateFlow<OrderInfoAndMenu?> = _orderInfoAndMenu

    // INGREDIENTI
    /*private val _ingredients = MutableStateFlow(null as List<IngredientFromGet>?)
    val ingredients: StateFlow<List<IngredientFromGet>?> = _ingredients*/

    fun checkfirstRun() {
        viewModelScope.launch {
            var utente = dataStoreManager.getUser()
            if (utente == null) {
                utente = CommunicationController.createUser()
            }
            dataStoreManager.saveUser(utente)
            _user.value = utente
        }
    }

    fun getUser() {
        viewModelScope.launch {
            var user = dataStoreManager.getUser()
            if (user == null) {
                user = CommunicationController.createUser()
                dataStoreManager.saveUser(user)
            }
            _user.value = user
        }
    }

    fun checkLocationPermission(): Boolean {
        return positionManager.checkLocationPermission()
    }

    fun getLocation() {
        viewModelScope.launch {
            val position = positionManager.getLocation()
            if (position != null) {
                _posizione.value = Position(position.latitude, position.longitude)
            }
        }
    }

    suspend fun getUserInfo() {
        withContext(Dispatchers.IO) {
            val userInfo = CommunicationController.getUserInfo(user.value!!)
            _userInfo.value = userInfo
        }
    }

    fun updateUserInfo(userData: UserResponseFromGet?) {
        if (userData != null) {
            val userForPut = UserForPut(
                userData.firstName,
                userData.lastName,
                userData.cardFullName,
                userData.cardNumber,
                userData.cardExpireMonth,
                userData.cardExpireYear,
                userData.cardCVV,
                user.value!!.sid
            )

            viewModelScope.launch {
                try {
                    CommunicationController.updateUserInfo(userForPut, user.value!!.uid)
                } catch (e: Exception) {
                    Log.e("AppViewModel", "Error updating user info: $e")
                }
            }
        } else {
            Log.e("AppViewModel", "Error updating user info: userData is null")
        }
    }

    suspend fun getMenuList() {
        withContext(Dispatchers.IO) {
            getLocation()
            if (_posizione.value != null) {
                val menuAndImgList = mutableListOf<MenuAndImg>()
                val menuList = CommunicationController.getMenuList(_posizione.value!!, user.value!!.sid)
                menuList.forEach { menu ->
                    val image = dataBaseManager.getImage(menu, user.value!!.sid)
                    menuAndImgList.add(MenuAndImg(menu, image))
                }
                _menuAndImgList.value = menuAndImgList
            } else {
                Log.e("AppViewModel", "Error getting menu list: position is null")
            }
        }
    }

    suspend fun getMenuDetails() {
        withContext(Dispatchers.IO) {
            if (_posizione.value != null) {
                val menuDetails = CommunicationController.getMenuDetails(_lastMenuMidAndImg.value!!.mid, _posizione.value!!, _user.value!!.sid)
                if (_lastMenuMidAndImg.value!!.img == null) {
                    // Get image from db convertendo menuDetails in Menu
                    val image = dataBaseManager.getImage(menuDetails.toMenu(), _user.value!!.sid)
                    _menuDetailsAndImg.value = MenuDetailsAndImg(menuDetails, image)
                } else {
                    _menuDetailsAndImg.value = MenuDetailsAndImg(menuDetails, _lastMenuMidAndImg.value!!.img)
                }
            }
        }
    }

    suspend fun checkUser() {
        withContext(Dispatchers.IO) {
            getUserInfo()
            val isProfileComplete = userInfo.value!!.cardFullName != null &&
                    userInfo.value!!.cardNumber != null &&
                    userInfo.value!!.cardExpireMonth != null &&
                    userInfo.value!!.cardExpireYear != null &&
                    userInfo.value!!.cardCVV != null

            val isOrderInProgress = userInfo.value!!.orderStatus == "ON_DELIVERY"
            _checkUser.value = CheckUser(isProfileComplete, isOrderInProgress)
        }
    }

    suspend fun buyMenu() {
        withContext(Dispatchers.IO) {
            if (_posizione.value != null) {
                try {
                    val result = CommunicationController.buyMenu(_lastMenuMidAndImg.value!!.mid, DeliveryLocationAndSid(_user.value!!.sid, _posizione.value!!))
                    Log.d("AppViewModel", "Order completed with oid: ${result.oid}")
                    saveLastOid(result.oid)
                } catch (e: Exception) {
                    Log.e("AppViewModel", "${e.message}")
                    throw e
                }
            }
        }
    }

    suspend fun getOrderStatus() {
        withContext(Dispatchers.IO) {
            val oid = getLastOid()
            if (oid != 0) {
                val orderInfo = CommunicationController.getOrderStatus(oid, _user.value!!.sid)
                var menu: MenuDetails? = null
                when (orderInfo) {
                    is CompletedOrderResponse -> {
                        menu = CommunicationController.getMenuDetails((orderInfo).mid, _posizione.value!!, _user.value!!.sid)
                    }
                    is OnDeliveryOrderResponse -> {
                        menu = CommunicationController.getMenuDetails((orderInfo).mid, _posizione.value!!, _user.value!!.sid)
                    }
                    else -> {
                            Log.e("AppViewModel", "Unexpected response type")
                        }
                    }
                _orderInfoAndMenu.value = OrderInfoAndMenu(orderInfo, menu!!)
            } else {
                Log.d("AppViewModel", "No active order")
            }
        }
    }

    // INGREDIENTI
    /*suspend fun getIngredients() {
        withContext(Dispatchers.IO) {
            val result = CommunicationController.getIngredients(_lastMenuMidAndImg.value!!.mid, _user.value!!.sid)
            Log.d("IngScreen", "${result.size} ingredienti per ${_menuDetailsAndImg.value!!.menu.name}")
            _ingredients.value = result
        }
    }*/

    // Setters
    fun setScreen(screen: String) {
        _screen.value = screen
        Log.d("AppViewModel", "Screen: $screen")
    }

    fun setLastMenuMidAndImg(mid: Int, img: Bitmap) {
        _lastMenuMidAndImg.value = MenuMidAndImg(mid, img)
    }

    // Savers
    suspend fun saveLastScreen() {
        withContext(Dispatchers.IO) {
            dataStoreManager.saveLastScreen(_screen.value!!)
            Log.d("AppViewModel", "Last screen saved: ${_screen.value}")
        }
    }

    suspend fun saveLastMid() {
        withContext(Dispatchers.IO) {
            dataStoreManager.saveLastMid(_lastMenuMidAndImg.value!!.mid)
            Log.d("AppViewModel", "Last mid saved: ${_lastMenuMidAndImg.value!!.mid}")
        }
    }

    suspend fun saveLastOid(oid: Int) {
        withContext(Dispatchers.IO) {
            dataStoreManager.saveLastOid(oid)
            Log.d("AppViewModel", "Last oid saved: $oid")
        }
    }

    // Reloaders
    suspend fun reloadLastScreen() {
        withContext(Dispatchers.IO) {
            _screen.value = dataStoreManager.getLastScreen()
            Log.d("AppViewModel", "Last screen reloaded: ${_screen.value}")
        }
    }

    suspend fun reloadLastMid() {
        withContext(Dispatchers.IO) {
            _lastMenuMidAndImg.value = MenuMidAndImg(dataStoreManager.getLastMid(), null)
            Log.d("AppViewModel", "Last mid reloaded: ${_lastMenuMidAndImg.value!!.mid}")
        }
    }

    // Getters
    private suspend fun getLastOid(): Int {
        val oid = dataStoreManager.getLastOid()
        Log.d("AppViewModel", "Last oid reloaded: $oid")
        return oid
    }

    suspend fun saveData() {
        withContext(Dispatchers.IO) {
            saveLastScreen()
            saveLastMid()
        }
    }

    suspend fun reloadData() {
        withContext(Dispatchers.IO) {
            reloadLastScreen()
            reloadLastMid()
        }
    }
}
