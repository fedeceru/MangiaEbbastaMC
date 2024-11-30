import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { styles } from '../Styles';
import AppViewModel from '../viewmodel/AppViewModel';

const locationDeniedImage = 'https://t3.ftcdn.net/jpg/05/83/96/22/360_F_583962262_5G5ewl75uZWW9KmsIjREuHSo1prjTbOU.jpg';

const LocationScreen = ({ handleLocationPermission }) => {
    //const [status, setStatus] = useState("undetermined");

    const getLocationPermission = async () => {
        try {
            const response = await AppViewModel.checkLocationPermission();
            handleLocationPermission(response);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Condividi la tua posizione</Text>
                <Text>La useremo per mostrarti i menu nei dintorni e la mappa per tenerne traccia</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={getLocationPermission}>
                        <Text style={styles.buttonText}>Continua</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );

        /*if (status === "denied") {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.profileImageContainer}>
                        <Image source={{ uri:  locationDeniedImage}} style={styles.image} />
                    </View>
                    <Text style={styles.title}>Permesso Negato o non ancora concesso</Text>
                    <Text style={styles.text}>
                        Non possiamo proseguire senza il permesso di accedere alla tua posizione.
                    </Text>
                    <Text style={styles.text}>
                        Per favore, riavvia l'app o vai nelle impostazioni del sistema operativo e abilita l'accesso alla posizione per questa applicazione.
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setStatus("undetermined")}>
                            <Text style={styles.buttonText}>Riprova</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            );
        }*/
};

export default LocationScreen;
