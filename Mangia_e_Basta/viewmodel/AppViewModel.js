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
                const userData = await this.fetchNewUser();
                if (userData && userData.sid && userData.uid) {
                    console.log('New user registered');
                    await AsyncStorage.setItem('sid', JSON.stringify(userData.sid));
                    await AsyncStorage.setItem('uid', JSON.stringify(userData.uid));
                    CommunicationController.setSidAndUid(userData.sid, userData.uid);
                    return true;
                }
            }

            console.log('User already logged in');
            CommunicationController.setSidAndUid(sid, uid);
            return false;
        } catch (error) {
            console.log('Error during checkFirstRun: ', error);
        }
    }

    //controlla se l'app ha i permessi per accedere alla posizione
    static async checkLocationPermission() {
        try {
            const grantedPermission = await PositionManager.checkLocationPermission();
            if (grantedPermission) {
                console.log("Permission already granted!");
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

    //TODO: da rivedere, capisco se tenere il check e la request assieme o separati
    static async checkPermission() {
        try {
            response = await PositionManager.checkLocationPermission();
            return response;
        } catch (error) {
            console.log("Error during checkLocationPermission: ", error);
        }
    }

    //calcola la posizione verificando prima i permessi
    static async getCurrentPosition() {
        try {
            if (await this.checkLocationPermission()) {
                const data = await PositionManager.getCurrentPosition();
                return data;
            }
        }
        catch (error) {
            console.log("Error during getCurrentPosition: ", error);
        }
    }
    
    //registra un nuovo utente
    static async fetchNewUser() {
        try {
            const data = await CommunicationController.postUser();
            return data;
        } catch (error) {
            console.log("Error during registerUser: ", error);
        }
    }  

}