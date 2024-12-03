import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { styles } from '../../Styles';

const MenuDetailsScreen = ({ route, navigation }) => {
    //faccio la chiamata per i dettagli del menu e prendo l'immagine dal DB se è già presente 
    const { menu } = route.params;
    const [menuDetails, setMenuDetails] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        
    }, []);

    return (
        <SafeAreaView>
            <View>
                <Text style={styles.title}>{menuDetails.name}</Text>
                <Text>{menuDetails.shortDescription}</Text>
                <Text>{menuDetails.deliveryTime}</Text>
                <Text>{menuDetails.price}</Text>
                <Text>{menuDetails.longDescription}</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Acquista</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

};

export default MenuDetailsScreen;