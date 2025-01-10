import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View, Image } from "react-native";
import { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import AppViewModel from "../../viewmodel/AppViewModel";
import LoadingScreen from "../LoadingScreen";
import { useIsFocused } from "@react-navigation/native";

const OrderStatusScreen = ({ navigation }) => {
    const [orderInfo, setOrderInfo] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [menuInfo, setMenuInfo] = useState(null);
    const [dronePosition, setDronePosition] = useState(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [region, setRegion] = useState(null);
    const isFocused = useIsFocused();
    const intervalId = useRef(null); 

    useEffect(() => {
        if (isFocused) {
            fetchOrderData().then((status) => {
                if (status === "ON_DELIVERY") {
                    intervalId.current = setInterval(droneTracking, 5000);
                }       
            });
        } else {
            clearInterval(intervalId.current); 
        }
    }, [isFocused]);

    const droneTracking = async () => {
        const orderData = await AppViewModel.fetchOrderStatus();
        if (orderData.status === "COMPLETED") {
            setOrderStatus(orderData.status);
            setOrderInfo({ deliveryTimestamp: orderData.deliveryTimestamp });
            clearInterval(intervalId.current);
        }
        if (!region) {
            setRegion({
                latitude: orderData.currentPosition.lat,
                longitude: orderData.currentPosition.lng,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
        setDronePosition(orderData.currentPosition);
    };

    const fetchOrderData = async () => {
        try {
            const orderData = await AppViewModel.fetchOrderStatus();
            if (orderData) {
                setIsLoading(true);
                setOrderStatus(orderData.status);
                setOrderInfo({
                    creationTimestamp: orderData.creationTimestamp,
                    expectedDeliveryTimestamp: orderData.expectedDeliveryTimestamp,
                    deliveryTimestamp: orderData.deliveryTimestamp
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
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                });
                setIsLoading(false);
            }
            return orderData.status;
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    const extractTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    if (!orderStatus) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.imageWrapper}>
                    <View style={styles.imageBackground}>
                        <Image source={require("../../assets/emptyCartIcon.png")} style={styles.image} />
                    </View>
                </View>
                <Text style={styles.title}>Nessun ordine trovato</Text>
                <Text style={styles.description}>Al momento non ci sono ordini disponibili.</Text>
                <Text style={styles.instructions}>Puoi ordinare un menu nella sezione dedicata!</Text>
                
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('HomeTab')}>
                        <Text style={styles.buttonText}>Ordina</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.mapContainer}>                
            <MapView
                style={styles.map}
                initialRegion={region || { latitude: 0, longitude: 0, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
                scrollEnabled={true}
                showsCompass={true}
                zoomControlEnabled={true}
            >
                {deliveryLocation && (
                    <Marker
                        anchor={ { x: 0.5, y: 0.5 } }
                        coordinate={{ latitude: deliveryLocation.lat, longitude: deliveryLocation.lng }}
                        image={require("../../assets/deliveryMarker.png")}
                        title="Posizione di consegna"
                        description="L'ordine verrà consegnato qui"
                    />
                )}
                {menuInfo && menuInfo.menuLocation && (
                    <Marker
                        anchor={ { x: -0.05, y: 0.5 } }
                        coordinate={{ latitude: menuInfo.menuLocation.lat, longitude: menuInfo.menuLocation.lng }}
                        image={require("../../assets/menuMarker.png")}
                        title="Posizione del menu"
                        description="Il menu che hai acquistato"
                    />
                )}
                {dronePosition && (
                    <Marker
                        anchor={{ x: 0.5, y: 0.5 }}
                        coordinate={{ latitude: dronePosition.lat, longitude: dronePosition.lng }}
                        image={require("../../assets/droneMarker.png")}
                        title="Drone"
                        description="Sto consegnando il tuo cibo"                        
                    />
                )}
                {deliveryLocation && menuInfo && menuInfo.menuLocation && dronePosition && (
                    <Polyline
                        coordinates={[
                            { latitude: deliveryLocation.lat, longitude: deliveryLocation.lng },
                            { latitude: dronePosition.lat, longitude: dronePosition.lng },
                            { latitude: menuInfo.menuLocation.lat, longitude: menuInfo.menuLocation.lng }
                        ]}
                        strokeColor="#007bff"
                        strokeWidth={3}
                        lineDashPattern={[10, 5]}
                    />
                )}
            </MapView>
            <View style={styles.statusContainer}>
                <Image
                    source={
                        orderStatus === "COMPLETED"
                            ? require("../../assets/deliverySuccessIcon.png")
                            : require("../../assets/deliveryOnTheWayIcon.png")
                    }
                    style={styles.statusImage}
                />
                <Text style={styles.statusTitle}>
                    {orderStatus === "COMPLETED" ? "Ordine Consegnato" : "In Consegna"}
                </Text>
                <Text style={styles.statusSubtitle}>
                    {orderStatus === "COMPLETED"
                        ? `Consegnato alle ${extractTime(orderInfo.deliveryTimestamp)}`
                        : `Arrivo previsto alle ${extractTime(orderInfo.expectedDeliveryTimestamp)}`}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default OrderStatusScreen;

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
        backgroundColor: "#f8f9fc",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    statusContainer: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: 15,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statusImage: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    statusSubtitle: {
        fontSize: 14,
        color: "#666",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f8f9fc",
    },
    imageWrapper: {
        alignItems: "center",
        marginBottom: 20,
    },
    imageBackground: {
        backgroundColor: "#eaeaea",
        borderRadius: 50,
        padding: 20,
    },
    image: {
        width: 80,
        height: 80,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
        textAlign: "center",
    },
    instructions: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    primaryButton: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
});
