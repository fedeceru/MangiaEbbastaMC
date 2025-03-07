import AsyncStorage from "@react-native-async-storage/async-storage";
import CommunicationController from "../model/CommunicationController";
import PositionManager from "../model/PositionManager";
import StorageManager from "../model/StorageManager";

export default class AppViewModel {
    static storageManager;
    static currentLocation;

    //controlla se l'utente è già loggato
    static async checkFirstRun() {
        try {
            const sid = JSON.parse(await AsyncStorage.getItem('sid'));
            const uid = JSON.parse(await AsyncStorage.getItem('uid'));
    
            if (!sid || !uid) {
                console.log('user not logged in');
                const userData = await CommunicationController.postUser();
                if (userData && userData.sid && userData.uid) {
                    console.log('New user registered');
                    await AsyncStorage.setItem('sid', JSON.stringify(userData.sid));
                    await AsyncStorage.setItem('uid', JSON.stringify(userData.uid));

                    CommunicationController.setSidAndUid(userData.sid, userData.uid);
                    return false;
                }
            }

            console.log('user logged in');
            CommunicationController.setSidAndUid(sid, uid);
            return false;
        } catch (error) {
            console.log('Error during checkFirstRun: ', error);
        }
    }

    //inizializza il database e ritorna true se è stato inizializzato correttamente
    static async initDB() {
        try {
            const storageManager = new StorageManager();
            await storageManager.openDB();
            this.storageManager = storageManager;
            if (this.storageManager.db) {
                console.log('DB initialized');
                return true;
            } 
            return false;
        } catch (error) {
            console.log('Error during initDB: ', error);
        }
    }

    //controlla se l'app ha i permessi per accedere alla posizione
    static async getLocationPermission() {
        try {
            const grantedPermission = await PositionManager.checkLocationPermission();
            if (grantedPermission) {
                console.log("permission granted!");
                return true;
            } else {
                console.log("requesting location permission...");
                const permissionGranted = await PositionManager.requestLocationPermission();
                return permissionGranted;
            }
        }
        catch (error) {
            console.log("Error during checkLocationPermission: ", error);
        }
    }

    //calcola la posizione verificando prima i permessi
    static async getCurrentPosition() {
        try {
            if (await PositionManager.checkLocationPermission()) {
                const location = await PositionManager.getCurrentPosition();
                this.currentLocation = location;
                return location;
            } 
            return null;
        }
        catch (error) {
            console.log("Error during getCurrentPosition: ", error);
        }
    }

    //recupera le informazioni dell'utente
    static async fetchUserInfo() {
        try {
            return await CommunicationController.getUserInfo(); 
        } catch (error) {
            console.log("Error during fetchUserInfo: ", error);
        }
    }

    //aggiorna le informazioni dell'utente
    static async updateUserInfo(updatedUSerInfo) {
        try {
            return await CommunicationController.putUserInfo(updatedUSerInfo);
        } catch (error) {
            console.log("Error during updateUserInfo: ", error);
        }
    }

    //recupera i menu nelle vicinanze
    static async fetchMenuList() {
        try {
            if (!this.currentLocation) {
                console.log("currentLocation not initialized");
                return;
            }
            return await CommunicationController.getMenuList(this.currentLocation.coords.latitude, this.currentLocation.coords.longitude);
        } catch (error) {
            console.log("Error during fetchMenuList: ", error);
        }
    }

    //recupera i dettagli di un menu
    static async fetchMenuDetails(mid) {
        try {
            if (!this.currentLocation) {
                console.log("currentLocation not initialized");
                return;
            }
            return await CommunicationController.getMenuDetails(mid, this.currentLocation.coords.latitude, this.currentLocation.coords.longitude);
        } catch (error) {
            console.log("Error during fetchMenuDetails: ", error);
        }
    }

    //controlla che il profilo sia completo e che non ci siano ordini in corso per permettere l'acquisto di un menu
    static async checkUser() {
        let isProfileComplete = false;
        let isOrderInProgress = false;
        try {
            //chiedo se è giusto fare così
            const userInfo = await this.fetchUserInfo();
            if (userInfo && userInfo.cardFullName && userInfo.cardNumber && userInfo.cardExpireMonth && userInfo.cardExpireYear && userInfo.cardCVV) {
                isProfileComplete = true;
            }  
            if (userInfo.orderStatus === "ON_DELIVERY") {
                isOrderInProgress = true;
            }
            return { isProfileComplete: isProfileComplete, isOrderInProgress: isOrderInProgress };
        } catch (error) {
            console.log("Error during checkProdileCompleteness: ", error);
        }
    }

    //acquisto di un menu, se l'ordine va a buon fine mi salvo in asyncStorage l'oid dell'ordine e il mid del menu acquistato
    static async buyMenu(mid) {
        if (!this.currentLocation) {
            console.log("currentLocation not initialized");
            return;
        }
        try {
            const result = await CommunicationController.buyMenu(mid, this.currentLocation.coords.latitude, this.currentLocation.coords.longitude);
            if (result && result.oid) {
                console.log("Order placed successfully with oid: ", result.oid);
                await AsyncStorage.setItem( 'oid', JSON.stringify(result.oid));
                return result;
            } 
        } catch (error) {
            console.log("Error during buyMenu: ", error);
            return null;
        }
    }

    //recupero lo stato dell'ordine, solo se l'ordine è stato effettuato
    static async fetchOrderStatus() {
        try {
            const oid = await AsyncStorage.getItem('oid');
            if (!oid) {
                console.log("No order in progress or completed");
                return;
            }
            return await CommunicationController.getOrderStatus(JSON.parse(oid));
        } catch (error) {
            console.log("Error during fetchOrderStatus: ", error);
        }
    }

    //recupero le informazioni relative all'ultimo ordine effettuato
    static async fetchLastOrderInfo(lastOid) {
        try {
            let orderInfo = await CommunicationController.getOrderStatus(lastOid);
            if (orderInfo && orderInfo.mid) {
                const menuInfo = await CommunicationController.getMenuDetails(orderInfo.mid, this.currentLocation.coords.latitude, this.currentLocation.coords.longitude);
                orderInfo = {...orderInfo, name: menuInfo.name};                
            } 
            return orderInfo;
        } catch (error) {
            console.log("Error during fetchLastOrderInfo: ", error);
        }
    }

    //recupero l'immagine del menu dal DB o dal server se non presente o se non è aggiornata
    static async fetchMenuImage(menu) {
        try {
            if (!this.storageManager) {
                console.log("StorageManager not initialized");
                return;
            } 
            if (!this.currentLocation) {
                console.log("currentLocation not initialized");
                return;
            }
            const menuFromDB = await this.storageManager.getMenuFromDB(menu.mid);

            if (!menuFromDB || menu.imageVersion > menuFromDB.imageVersion)  {
                console.log("image missing or outdated, fetching from server...");
                const image = await CommunicationController.getMenuImage(menu.mid);
                await this.storageManager.saveMenuPic(menu.mid, menu.imageVersion, image.base64);
                return image.base64;
            }

            console.log("image found and up to date, fetching from DB...");
            return menuFromDB.base64;
        } catch (error) {
            console.log("Error during fetchMenuImage: ", error);
        }
    }
}