import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View, Image, StyleSheet } from 'react-native';
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
            <SafeAreaView style={styles.container}>
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/17463/17463780.png' }} style={styles.image} />
                <Text style={styles.title}>Permesso Negato</Text>
                <Text style={styles.description}>
                    Non possiamo proseguire senza il permesso di accedere alla tua posizione.
                </Text>
                <Text style={styles.instructions}>
                    Per favore, riavvia l'app o vai nelle impostazioni del sistema operativo e abilita l'accesso alla posizione per questa applicazione.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/128/854/854878.png' }} style={styles.image} />
            <Text style={styles.title}>Condividi la tua posizione</Text>
            <Text style={styles.description}>
                La useremo per mostrarti i menu nei dintorni e la mappa per tenerne traccia.
            </Text>
            <TouchableOpacity style={styles.button} onPress={tryGetPermission}>
                <Text style={styles.buttonText}>Concedi Permesso</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default LocationScreen;