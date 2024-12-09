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
        menuLocation: null,
    });
    const [dronePosition, setDronePosition] = useState(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    
    const [isLoading, setIsLoading] = useState(null);
    const isFocused = useIsFocused();   
    
    useEffect(() => {
        let requestInterval = null;
        if (isFocused) {
            const fetchOrderStatus = async () => {
                try {
                    const checkUser = await AppViewModel.checkUser();
                    if (checkUser.isOrderInProgress === true) {
                        setIsLoading(true);
                        requestInterval = setInterval(async () => {
                            const orderData = await AppViewModel.fetchOrderStatus();
                            if (orderData) {
                                setOrderInfo({
                                    mid: orderData.mid,
                                    creationTimestamp: orderData.creationTimestamp,
                                    expectesDeliveryTimestamp: orderData.expectesDeliveryTimestamp,
                                    status: orderData.status,
                                });
                                setDeliveryLocation(orderData.deliveryLocation);
                                const menuData = await AppViewModel.fetchMenuDetails(orderData.mid);
                                if (menuData) {
                                    setMenuInfo({ menuLocation: menuData.location, menuName: menuData.name });
                                } 
                                setDronePosition(orderData.currentPosition);
                                setIsLoading(false);
                            }    
                        }, 5000);   
                    }   
                } catch (error) {
                    console.log("Error during fetchOrderStatus: ", error);
                }
            }
            fetchOrderStatus();
        } 

        return () => clearInterval(requestInterval);
    }, [isFocused]);
        
    const handleRegionChanged = (region) => {
    };

    if (isLoading === true) {
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
                        latitude: deliveryLocation.lat ? deliveryLocation.lat : 0, 
                        longitude: deliveryLocation.lng ? deliveryLocation.lng : 0,
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
    }; 

    return (
        <SafeAreaView>
            <Text>Non ci sono ordini</Text>
        </SafeAreaView>
    );
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
