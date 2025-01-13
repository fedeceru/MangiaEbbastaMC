import { SafeAreaView, Text, TouchableOpacity, View, Image } from "react-native";
import { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import AppViewModel from "../../viewmodel/AppViewModel";
import LoadingScreen from "../LoadingScreen";
import { useIsFocused } from "@react-navigation/native";
import { styles } from "../../Styles";

const OrderStatusScreen = ({ navigation }) => {
    const [orderInfo, setOrderInfo] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [menuInfo, setMenuInfo] = useState(null);
    const [dronePosition, setDronePosition] = useState(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [region, setRegion] = useState(null);
    const isFocused = useIsFocused();
    const intervalId = useRef(null); 

    useEffect(() => {
        if (isFocused) {
            fetchOrderData().then((status) => {
                if (status === "ON_DELIVERY") {
                    intervalId.current = setInterval(droneTracking, 5000);
                }       
            }).catch((error) => {
                console.log(error);
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
                return orderData.status;
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        } finally {
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

    if (!orderStatus && !isLoading) {
        return (
            <SafeAreaView style={styles.OScontainer}>
                <View style={styles.OSimageWrapper}>
                    <View style={styles.OSimageBackground}>
                        <Image source={require("../../assets/emptyCartIcon.png")} style={styles.OSimage} />
                    </View>
                </View>
                <Text style={styles.OStitle}>Nessun ordine trovato</Text>
                <Text style={styles.OSdescription}>Al momento non ci sono ordini disponibili.</Text>
                <Text style={styles.OSinstructions}>Puoi ordinare un menu nella sezione dedicata!</Text>
                
                <View style={styles.OSbuttonsContainer}>
                    <TouchableOpacity style={styles.OSprimaryButton} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.OSbuttonText}>Ordina</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.OSmapContainer}>                
            <MapView
                style={styles.OSmap}
                initialRegion={region || { latitude: 0, longitude: 0, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
                scrollEnabled={true}
                showsCompass={true}
                zoomControlEnabled={true}
            >
                {deliveryLocation && (
                    <Marker
                        anchor={{ x: 0.5, y: 0.5 }}
                        coordinate={{ latitude: deliveryLocation.lat, longitude: deliveryLocation.lng }}
                        image={require("../../assets/deliveryMarker.png")}
                        title="Posizione di consegna"
                        description="L'ordine verrà consegnato qui"
                    />
                )}
                {menuInfo && menuInfo.menuLocation && (
                    <Marker
                        anchor={{ x: 0.5, y: 0.5 }}
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
            <View style={styles.OSstatusContainer}>
                <Image
                    source={
                        orderStatus === "COMPLETED"
                            ? require("../../assets/deliverySuccessIcon.png")
                            : require("../../assets/deliveryOnTheWayIcon.png")
                    }
                    style={styles.OSstatusImage}
                />
                <Text style={styles.OSstatusTitle}>
                    {orderStatus === "COMPLETED" ? "Ordine Consegnato" : "In Consegna"}
                </Text>
                <Text style={styles.OSstatusSubtitle}>
                    {orderStatus === "COMPLETED"
                        ? `Consegnato alle ${extractTime(orderInfo.deliveryTimestamp)}`
                        : `Arrivo previsto alle ${extractTime(orderInfo.expectedDeliveryTimestamp)}`}
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default OrderStatusScreen;