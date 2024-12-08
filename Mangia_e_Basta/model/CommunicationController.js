export default class CommunicationController {
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";
    static sid; 
    static uid;

    static setSidAndUid(sid, uid) {
      this.sid = sid;
      this.uid = uid;
    };

    static getSidAndUid() {
      return {sid: this.sid, uid: this.uid};
    };
  
    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
      console.log("genericRequest called");
  
      const queryParamsFormatted = new URLSearchParams(queryParams).toString();
      const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
  
      console.log("Sending " + verb + " request to: " + url);
  
      let fetchData = {
        method: verb,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      if (verb !== "GET") {
        fetchData.body = JSON.stringify(bodyParams);
      }
  
      let httpResponse;
      try {
        httpResponse = await fetch(url, fetchData);
      } catch (error) {
        // This means that the fetch request failed.
        // The request could not be sent or the server did not respond.
        console.error("Error during fetch request: ", error);
        throw error;
      }
  
      const status = httpResponse.status;
      console.log("HTTP response status: ", status);
      if (status === 200) {
        // 200 means that the request was successful.
        // The server responded with the data requested in JSON format.
        let deserializedObject = await httpResponse.json();
        return deserializedObject;
      } else if (status === 204) {
        // 204 means that the server has successfully processed the request
        // but that there is no content to send back.
        return null;
      } else {
        // The server responded with an error status.
        const errorObject = await httpResponse.json();
        console.error("Error message from the server:", errorObject);
        throw errorObject;
      }
    }

    static async postUser() {
      let endpoint = "user";
      console.log("postUser called with ebdpoint: " + endpoint);
      return await this.genericRequest(endpoint, "POST", {}, {});
    }

    static async getUserInfo() {
      let endpoint = "user/" + this.uid;
      let queryParams = {sid: this.sid};
      console.log("getUserInfo called with ebdpoint: " + endpoint + " and queryParams: " + JSON.stringify(queryParams));
      return await this.genericRequest(endpoint, "GET", queryParams, {});
    }

    static async putUserInfo(userInfo) {
      let endpoint = "user/" + this.uid;
      let bodyParams = {
        ...userInfo,
        sid: this.sid,
      };
      console.log("putUserInfo called with ebdpoint: " + endpoint + " and bodyParams: " + JSON.stringify(bodyParams));
      return await this.genericRequest(endpoint, "PUT", {}, bodyParams);
    }

    static async getMenuList(lat, lng) {
      let endpoint = "menu";
      let queryParams = {
        lat: lat,
        lng: lng,
        sid: this.sid,
      };
      console.log("getMenuList called with ebdpoint: " + endpoint + " and queryParams: " + JSON.stringify(queryParams));
      return await this.genericRequest(endpoint, "GET", queryParams, {});
    }

    static async getMenuDetails(mid, lat, lng) {
      let endpoint = "menu/" + mid;
      let queryParams = {
        lat: lat,
        lng: lng,
        sid: this.sid,
      };
      console.log("getMenuDetails called with ebdpoint: " + endpoint + " and queryParams: " + JSON.stringify(queryParams));
      return await this.genericRequest(endpoint, "GET", queryParams, {});
    }

    static async getMenuImage(mid) {
      let endpoint = "menu/" + mid + "/image";
      let queryParams = {sid: this.sid};
      console.log("getMenuImage called with ebdpoint: " + endpoint + " and queryParams: " + JSON.stringify(queryParams));
      return await this.genericRequest(endpoint, "GET", queryParams, {});
    }

    static async buyMenu(mid, lat, lng) {
      let endpoint = "menu/" + mid + "/buy";
      let bodyParams = {
        sid: this.sid,
        deliveryLocation: {
          lat: lat,
          lng: lng,
        },
      }
      console.log("buyMenu called with ebdpoint: " + endpoint + " and bodyParams: " + JSON.stringify(bodyParams));
      return await this.genericRequest(endpoint, "POST", {}, bodyParams);
    }

    static async getOrderStatus(oid) {
      let endpoint = "order/" + oid;
      let queryParams = {sid: this.sid};
      console.log("getOrderStatus called with ebdpoint: " + endpoint + " and queryParams: " + JSON.stringify(queryParams));
      return await this.genericRequest(endpoint, "GET", queryParams, {});
    }
}
