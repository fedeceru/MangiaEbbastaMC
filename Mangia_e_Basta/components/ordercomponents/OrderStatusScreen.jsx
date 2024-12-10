import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import AppViewModel from "../../viewmodel/AppViewModel";
import { useIsFocused } from "@react-navigation/native";
import LoadingScreen from "../LoadingScreen";
import { styles } from "../../Styles";

const OrderStatusScreen = ({ navigation }) => {
    const [orderInfo, setOrderInfo] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [menuInfo, setMenuInfo] = useState(null);
    const [dronePosition, setDronePosition] = useState(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const isFocused = useIsFocused();
    const [region, setRegion] = useState(null);

    useEffect(() => {
        let interval = null;
        const initDroneTracking = async () => {
            try {
                setIsLoading(true);
                const status = await fetchOrderStatus();
                if (status === "ON_DELIVERY") {
                    interval = setInterval(droneTracking, 5000);
                } else {
                    if (interval) {
                        clearInterval(interval);
                    }
                }
                setIsLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        if (isFocused) {
            initDroneTracking();
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [isFocused]);

    const droneTracking = async () => {
        const orderData = await AppViewModel.fetchOrderStatus();
        setDronePosition(orderData.currentPosition);
        setRegion({
            latitude: orderData.currentPosition.lat,
            longitude: orderData.currentPosition.lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        });
    }

    const fetchOrderStatus = async () => {
        try {
            const orderData = await AppViewModel.fetchOrderStatus();
            if (orderData) {
                setOrderStatus(orderData.status);
                setOrderInfo({
                    creationTimestamp: orderData.creationTimestamp,
                    expectesDeliveryTimestamp: orderData.expectesDeliveryTimestamp,
                });
                setDeliveryLocation(orderData.deliveryLocation);
                const menuData = await AppViewModel.fetchMenuDetails(orderData.mid);
                if (menuData) {
                    setMenuInfo({ menuLocation: menuData.location, menuName: menuData.name });
                }
                setDronePosition(orderData.currentPosition);
                setRegion({
                    latitude: orderData.currentPosition.lat,
                    longitude: orderData.currentPosition.lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                });
                return orderData.status;
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    if (!orderStatus) {
        return (
            <SafeAreaView>
                <Text style={styles.listTitle}>Al momento non ci sono ordini</Text>
                <Text style={styles.listCaption}>Puoi ordinare un menu nella sezione dedicata!</Text>
                <View style={styles.CObuttonsContainer}>
                    <TouchableOpacity style={styles.COprimaryButton} onPress={() => navigation.navigate('HomeTab')}>
                        <Text style={styles.CObuttonText}>Ordina</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={localStyles.mapContainer}>                
            <MapView
                style={localStyles.map}
                scrollEnabled={true}
                showsCompass={true}
                showsMyLocationButton={true}
                showsUserLocation={true}
                zoomControlEnabled={true}
                loadingEnabled={false}
                region={region ? region : { latitude: 0, longitude: 0, latitudeDelta: 0.05, longitudeDelta: 0.05, }}
            >
                {deliveryLocation && (
                    <Marker
                        image={require("../../assets/deliveryMarker.png")}
                        coordinate={{ latitude: deliveryLocation.lat, longitude: deliveryLocation.lng }}
                        title="Posizione di consegna"
                        description="La tua posizione di consegna"
                    />
                )}
                {menuInfo && menuInfo.menuLocation && (
                    <Marker
                        image={require("../../assets/menuMarker.png")}
                        coordinate={{ latitude: menuInfo.menuLocation.lat, longitude: menuInfo.menuLocation.lng }}
                        title="Posizione del menu"
                        description="La posizione del menu che hai ordinato"
                    />
                )}
                {dronePosition && (
                    <Marker
                        image={require("../../assets/droneMarker.png")}
                        coordinate={{ latitude: dronePosition.lat, longitude: dronePosition.lng }}
                        title="Drone"
                        description="Sto deliverando il tuo cibo"
                    />
                )}
                {deliveryLocation && menuInfo && menuInfo.menuLocation && dronePosition && (
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

export default OrderStatusScreen;

const localStyles = StyleSheet.create({
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
