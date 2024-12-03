import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from '../../Styles';
import AppViewModel from '../../viewmodel/AppViewModel';
import LoadingScreen from '../LoadingScreen';

const MenuDetailsScreen = ({ route, navigation }) => {
    const { menu } = route.params;
    const [menuDetails, setMenuDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenuDetails = async () => {
            try {
                console.log("fetching menu details...");
                const menuDetailsData = await AppViewModel.fetchMenuDetails(menu.mid);
                if (menuDetailsData) {
                    setMenuDetails({ ...menuDetailsData, image: menu.image });
                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchMenuDetails();
    }, []);

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Image source={{ uri: "data:image/jpeg;base64," + menuDetails.image }} style={styles.image} />
                <View style={styles.card}>
                    <Text style={styles.title}>{menuDetails.name}</Text>
                    <Text style={styles.text}>{menuDetails.shortDescription}</Text>
                    <Text style={styles.text}>Tempo di consegna: {menuDetails.deliveryTime}</Text>
                    <Text style={styles.text}>Prezzo: {menuDetails.price}€</Text>
                    <Text style={styles.text}>{menuDetails.longDescription}</Text>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Acquista</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

};

export default MenuDetailsScreen;