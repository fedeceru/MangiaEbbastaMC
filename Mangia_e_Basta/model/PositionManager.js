import * as Location from 'expo-location';

export default class PositionManager {
    static permissionStatus = false;

    static async checkLocationPermission() {
        try {
            const grantedPermission = await Location.getForegroundPermissionsAsync();
            if (grantedPermission.status === "granted") { 
                this.permissionStatus = true;
            } 
            return this.permissionStatus;
            
        } catch (error) {
            console.log(error);
        }
    }

    static async requestLocationPermission() {
        try {
            const permissionResponse = await Location.requestForegroundPermissionsAsync();
            if (permissionResponse.status === "granted") {
                this.permissionStatus = true;
            } 
            return this.permissionStatus;
            
        } catch (error) {
            console.log(error);
        }
    }

    static async getCurrentPosition() {
        try {
            if (this.permissionStatus === true) {
                return await Location.getCurrentPositionAsync();
            }
            this.checkLocationPermission();
            return;    
        } catch (error) {
            console.log(error);
        }
    }
}
