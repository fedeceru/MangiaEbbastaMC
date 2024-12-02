import * as SQLite from 'expo-sqlite';
import AppViewModel from '../viewmodel/AppViewModel';

export default class StorageManager {
    static db;

    static async openDB() {
        try {
            this.db = await SQLite.openDatabaseAsync('menuDB');
            const query = "CREATE TABLE IF NOT EXISTS Menu (mid INTEGER PRIMARY KEY, imageVersion INTEGER, base64 TEXT);";
            await this.db.execAsync(query);    
        } catch (error) {
            console.log('Error during openDB: ', error);
            throw error;
        }
    }
    
    static async saveMenu(mid, imageVersion) {
        try {
            const query = "INSERT OR REPLACE INTO Menu (mid, imageVersion) VALUES (?, ?);";
            await this.db.runAsync(query, [mid, imageVersion]);    
        } catch (error) {
            console.log('Error during saveMenu: ', error);
            throw error;
        }
    }
    
    static async saveMenuPic(mid, imageVersion, base64) {
        try {
            const query = "UPDATE Menu SET imageVersion = ?, base64 = ? WHERE mid = ?;";
            await this.db.runAsync(query, [imageVersion, base64, mid]);
        } catch (error) {
            console.log('Error during saveMenuPic: ', error);
            throw error;
        }
    }    
    
    static async getMenuFromDB(mid) {
        try {
            const query = "SELECT * FROM Menu WHERE mid = ?;";
            const result = await this.db.getFirstAsync(query, [mid]);
             return result;    
        } catch (error) {
            console.log('Error during getMenuFromDB: ', error);
            throw error;
        }
    }
    
    static async getMenusFromDB() {
        try {
            const query = "SELECT * FROM Menu;";
            const result = await this.db.getAllAsync(query);
            return result;    
        } catch (error) {
            console.log('Error during getMenusFromDB: ', error);
            throw error;
        }
    }

    static async getPic(mid, lat, lng) {
        try {
            console.log("Getting from local DB...");
            const menuData = await this.getMenuFromDB(mid);
            console.log("Got menuData: ", menuData.mid, menuData.imageVersion);
            console.log("Fetching imageVersion from server...");
            const serverData = await AppViewModel.getMenuDetailsFromServer(mid, lat, lng);
            console.log("Got serverData: ", serverData.mid, serverData.imageVersion);
          
            if (!menuData.base64 || serverData.imageVersion > menuData.imageVersion) {
                console.log("Image missing, outdated, or version mismatch. Fetching from server...");
                const picData = await AppViewModel.getImageFromServer(mid);
                await this.saveMenuPic(mid, serverData.imageVersion, picData.base64);
                return { base64: picData.base64, stored: false };
            } else {
                console.log("Image found in local DB and up to date.");
                return { base64: menuData.base64, stored: true };
            }
        } catch (error) {
            console.log('Error during getPic: ', error);
            throw error;
        }
    }
    
    static async saveMenus(menuList, lat, lng) {
        try {
            for (const menu of menuList) {
                await this.saveMenu(menu.mid, menu.imageVersion);
                console.log(`Saved menu ${menu.mid}`);
                
                console.log("Checking image...");
                let { base64, stored } = await this.getPic(menu.mid, lat, lng);
                
                if (!stored) {
                    console.log("Saving new or updated image in local DB!");
                    await this.saveMenuPic(menu.mid, menu.imageVersion, base64);    
                } else {
                    console.log("Image already up to date in local DB!");
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
