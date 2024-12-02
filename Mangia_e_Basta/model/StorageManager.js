import * as SQLite from 'expo-sqlite';

export default class StorageManager {
    constructor() {
        this.db = null;
    }

    async openDB() {
        try {
            this.db = await SQLite.openDatabaseAsync('menuDB');
            const query = "CREATE TABLE IF NOT EXISTS Menu (mid INTEGER PRIMARY KEY, imageVersion INTEGER, base64 TEXT);";
            await this.db.execAsync(query);    
        } catch (error) {
            console.log('Error during openDB: ', error);
            throw error;
        }
    }
    
    async saveMenuPic(mid, imageVersion, base64) {
        try {
            const query = "UPDATE Menu SET imageVersion = ?, base64 = ? WHERE mid = ?;";
            await this.db.runAsync(query, [imageVersion, base64, mid]);
        } catch (error) {
            console.log('Error during saveMenuPic: ', error);
            throw error;
        }
    }    
    
    async getImageFromDB(mid) {
        try {
            const query = "SELECT * FROM Menu WHERE mid = ?;";
            const result = await this.db.getFirstAsync(query, [mid]);
             return result;    
        } catch (error) {
            console.log('Error during getMenuFromDB: ', error);
            throw error;
        }
    }
    
    async getMenuListFromDB() {
        try {
            const query = "SELECT * FROM Menu;";
            const result = await this.db.getAllAsync(query);
            return result;    
        } catch (error) {
            console.log('Error during getMenusFromDB: ', error);
            throw error;
        }
    }
}
