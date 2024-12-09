import { StyleSheet, SafeAreaView, Text } from "react-native";
import { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import AppViewModel from "../../viewmodel/AppViewModel";
import { useIsFocused } from "@react-navigation/native";
import LoadingScreen from "../LoadingScreen";

export default function App() {
    const [orderInfo, setOrderInfo] = useState({
        mid: null,
        creationTimestamp: null,
        expectesDeliveryTimestamp: null,
        status: null,
    });
    const [menuInfo, setMenuInfo] = useState({
        menuName: null,
        menuLocation: [],
    });
    const [dronePosition, setDronePosition] = useState([]);
    const [deliveryLocation, setDeliveryLocation] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();   
    
    useEffect(() => {
        let requestInterval = null;
        if (isFocused) {
            requestInterval = setInterval(async () => {
                console.log("fetching order status...");
                const orderData = await AppViewModel.fetchOrderStatus();
                if (orderData) {
                    setOrderInfo({
                        mid: orderData.mid,
                        creationTimestamp: orderData.creationTimestamp,
                        expectesDeliveryTimestamp: orderData.expectesDeliveryTimestamp,
                        status: orderData.status,
                    });
                    setDeliveryLocation(orderData.deliveryLocation);
                    console.log("fetching menu info...");
                    const menuData = await AppViewModel.fetchMenuDetails(orderData.mid);
                    if (menuData) {
                        setMenuInfo({ menuLocation: menuData.location, menuName: menuData.name });
                    } 
                    setDronePosition(orderData.currentPosition);
                    setIsLoading(false);
                }
            }, 5000);    
        } 

        return () => clearInterval(requestInterval);
    }, [isFocused, dronePosition]);
    
    const handleRegionChanged = (region) => {
    };

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    };

    if (orderInfo && orderInfo.status) {
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
                        latitude: dronePosition.lat ? dronePosition.lat : 0, 
                        longitude: dronePosition.lng ? dronePosition.lng : 0,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    {deliveryLocation.lat && (
                        <Marker
                            coordinate={{ latitude: deliveryLocation.lat, longitude: deliveryLocation.lng }}
                            title="Posizione di consegna"
                            description="La tua posizione di consegna"
                            pinColor="blue"
                        />
                    )}
                    {menuInfo.menuLocation && (
                        <Marker
                            coordinate={{ latitude: menuInfo.menuLocation.lat, longitude: menuInfo.menuLocation.lng }}
                            title="Posizione del menu"
                            description="La posizione del menu che hai ordinato"
                        />
                    )}
                    {dronePosition && (
                        <Marker
                            coordinate={{ latitude: dronePosition.lat, longitude: dronePosition.lng }}
                            title="Drone"
                            description="Sto deliverando il tuo cibo"
                        />
                    )}
                    {deliveryLocation && menuInfo.menuLocation && dronePosition && (
                        <Polyline
                            coordinates={[{ latitude: deliveryLocation.lat, longitude: deliveryLocation.lng }, { latitude: dronePosition.lat, longitude: dronePosition.lng }, { latitude: menuInfo.menuLocation.lat, longitude: menuInfo.menuLocation.lng }]}
                            strokeColor="green"
                            strokeWidth={2}
                        />
                    )}
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
