import { StyleSheet, SafeAreaView, Text } from "react-native";
import { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import AppViewModel from "../../viewmodel/AppViewModel";
import { useIsFocused } from "@react-navigation/native";

export default function App() {
    //devo recuperare la posizione attuale dell'utente e la posizione del menu che ho ordinato, inoltre calcolo ogni 5 secondi anche la posizione del drone che mi porta il cibo
    //qua deve essere presente il nome del menu, la sua posizione, la posizione del drone che deve essere aggionrata ogni 5 secondi, la posizione nella quale deve essere spedito il menu
    const [orderInfo, setOrderInfo] = useState({
        creationTimestamp: null,
        expectedDeliveryTimestamp: null,
        status: null,
    });
    const [dronePosition, setDronePosition] = useState([]);
    const [menuInfo, setMenuInfo] = useState([]);
    const [userPosition, setUserPosition] = useState([]);
    const [deliveryPosition, setDeliveryPosition] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();   
    
    //creo un interval che ogni 5 secondi faccia la chiamata dello stato dell'ordine e aggiorno la posizione del drone
    useEffect(() => {
        let requestInterval = null;
        if (isFocused) {
            requestInterval = setInterval(async () => {
                console.log("fetching order status...");
                const orderData = await AppViewModel.fetchOrderStatus();
                console.log("orderInfo: ", orderData); 
                if (orderData) {
                    setOrderInfo(orderData);
                    if (!orderData.menuPosition && !orderData.userPosition) {
                        setUserPosition(orderData.deliveryLocation);
                        const menuData = await AppViewModel.fetchMenuDetails(orderData.mid);
                        console.log("menuData: ", menuData);
                        if (menuData) {
                            setMenuInfo({ menuPosition: menuData.location, menuName: menuData.name });
                        } 
                    }
                    setDronePosition(orderData.dronePosition);
                    
                }
            }, 5000);    
        } 

        return () => clearInterval(requestInterval);
    }, [isFocused]);

    const handleRegionChanged = (region) => {
    };

    if (orderInfo.status) {
        return (
            <SafeAreaView style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    onRegionChange={handleRegionChanged}
                    showsCompass={true}
                    showsMyLocationButton={true}
                    showsUserLocation={true}
                    zoomControlEnabled={true}
                    loadingEnabled={true}
                    initialRegion={{
                        latitude: userPosition.lat,
                        longitude: userPosition.lng,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker
                        coordinate={userPosition}
                        title="Posizione attuale"
                        description="La mia posizione attuale"
                        pinColor="blue"
                    />
                    <Marker
                        coordinate={menuInfo.menuPosition}
                        title="Dipartimento di Informatica"
                        description="Via Celoria 18, 20133 Milano"
                    />
                    <Polyline
                        coordinates={[userPosition, menuInfo.menuPosition]}
                        strokeColor="green"
                        strokeWidth={2}
                    />
                </MapView>
            </SafeAreaView>
        );
    } 

    return (
        <SafeAreaView>
            <Text>Non ci sono ordini</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
