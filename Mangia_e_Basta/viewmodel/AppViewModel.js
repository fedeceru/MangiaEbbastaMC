import AsyncStorage from "@react-native-async-storage/async-storage";
import CommunicationController from "../model/CommunicationController";
import PositionManager from "../model/PositionManager";

export default class AppViewModel {

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

    //recupera le informazioni dell'utente, controllando prima se è loggato
    static async fetchUserInfo() {
        try {
            if (CommunicationController.getSidAndUid() === null) {
                this.checkFirstRun();
            }

            return await CommunicationController.getUserInfo(); 
        } catch (error) {
            console.log("Error during fetchUserInfo: ", error);
        }
    }

    static async updateUserInfo(updatedUSerInfo) {
        try {
            return await CommunicationController.putUserInfo(updatedUSerInfo);
        } catch (error) {
            console.log("Error during updateUserInfo: ", error);
        }
    }
}