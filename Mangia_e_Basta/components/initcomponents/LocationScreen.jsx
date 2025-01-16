import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, Image, View } from 'react-native';
import { useEffect, useState } from 'react';
import { styles } from '../../Styles';
import AppViewModel from '../../viewmodel/AppViewModel';

const LocationScreen = ({ handleLocationPermission, accessCounter }) => {
    const [status, setStatus] = useState("undetermined");

    useEffect(() => {
        if (accessCounter > 2) {
            setStatus("denied");
        }
    }, [accessCounter]);

    const tryGetPermission = async () => {
        try {
            const response = await AppViewModel.getLocationPermission();
            handleLocationPermission(response);
        } catch (error) {
            console.log(error);
        }
    }

    if (status === "denied") {
        return (
            <SafeAreaView style={styles.locationContainer}>
                <View style={styles.locationImageWrapper}>
                    <View style={styles.locationImageBackgroundDenied}>
                        <Image source={require("../../assets/locationDeniedIcon.png")} style={styles.locationImage} />
                    </View>
                </View>
                <Text style={styles.locationTitle}>Permesso Negato</Text>
                <Text style={styles.locationDescription}>
                    Non possiamo proseguire senza il permesso di accedere alla tua posizione.
                </Text>
                <Text style={styles.locationInstructions}>
                    Per favore, riavvia l'app o vai nelle impostazioni del sistema operativo e abilita l'accesso alla
                    posizione per questa applicazione.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.locationContainer}>
            <View style={styles.locationImageWrapper}>
                <View style={styles.locationImageBackgroundGranted}>
                    <Image source={require("../../assets/locationPermissionIcon.png")} style={styles.locationImage} />
                </View>
            </View>
            <Text style={styles.locationTitle}>Condividi la tua posizione</Text>
            <Text style={styles.locationDescription}>
                La useremo per mostrarti i menù nei dintorni e la mappa per tenerne traccia.
            </Text>
            <TouchableOpacity style={styles.locationButton} onPress={tryGetPermission}>
                <Text style={styles.locationButtonText}>Concedi Permesso</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default LocationScreen;