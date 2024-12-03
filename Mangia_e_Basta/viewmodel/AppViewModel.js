import AsyncStorage from "@react-native-async-storage/async-storage";
import CommunicationController from "../model/CommunicationController";
import PositionManager from "../model/PositionManager";
import StorageManager from "../model/StorageManager";

export default class AppViewModel {
    static storageManager;

    //controlla se l'utente è già loggato
    static async checkFirstRun() {
        try {
            const sid = JSON.parse(await AsyncStorage.getItem('sid'));
            const uid = JSON.parse(await AsyncStorage.getItem('uid'));
    
            if (!sid || !uid) {
                console.log('User not logged in');
                const userData = await CommunicationController.postUser();
                if (userData && userData.sid && userData.uid) {
                    console.log('New user registered');
                    await AsyncStorage.setItem('sid', JSON.stringify(userData.sid));
                    await AsyncStorage.setItem('uid', JSON.stringify(userData.uid));

                    CommunicationController.setSidAndUid(userData.sid, userData.uid);
                    return false;
                }
            }

            console.log('User logged in');
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
                console.log("Permission granted!");
                return true;
            } else {
                console.log("Requesting location permission...");
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
            const location = PositionManager.currentLocation; 
            return await CommunicationController.getMenuList(location.coords.latitude, location.coords.longitude);
        } catch (error) {
            console.log("Error during fetchMenuList: ", error);
        }
    }

    //recupero l'immagine del menu dal DB o dal server se non presente o se non è aggiornata
    static async fetchMenuImage(mid) {
        try {
            if (!this.storageManager) {
                console.log("StorageManager not initialized");
                return;
            }
            const menuFromDB = await this.storageManager.getMenuFromDB(mid);
            const location = PositionManager.currentLocation;
            const menuFromServer = await CommunicationController.getMenuDetails(mid, location.coords.latitude, location.coords.longitude);

            if (!menuFromDB || menuFromServer.imageVersion > menuFromDB.imageVersion)  {
                console.log("image missing or outdated, fetching from server...");
                const image = await CommunicationController.getMenuImage(mid);
                await this.storageManager.saveMenuPic(mid, menuFromServer.imageVersion, image.base64);
                return image.base64;
            }

            console.log("image found and up to date, fetching from DB...");
            return menuFromDB.base64;
        } catch (error) {
            console.log("Error during fetchMenuImage: ", error);
        }
    }
}