import { StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function App() {
    //devo recuperare la posizione attuale dell'utente e la posizione del menu che ho ordinato, inoltre calcolo ogni 5 secondi anche la posizione del drone che mi porta il cibo
    const [position, setPosition] = useState({
        latitude: 45.476943606879416,
        longitude: 9.230041510470127,
    });
    const unimi = {
        latitude: 45.476046,
        longitude: 9.2318665,
    };

    const handleRegionChanged = (region) => {
    };

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
                    latitude: position.latitude,
                    longitude: position.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                <Marker
                    coordinate={position}
                    title="Posizione attuale"
                    description="La mia posizione attuale"
                    pinColor="blue"
                />
                <Marker
                    coordinate={unimi}
                    title="Dipartimento di Informatica"
                    description="Via Celoria 18, 20133 Milano"
                />
                <Polyline
                    coordinates={[position, unimi]}
                    strokeColor="green"
                    strokeWidth={2}
                />
            </MapView>
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
