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
        <SafeAreaView style={styles.detailsContainer}>
            <ScrollView>
                <Image source={{ uri: "data:image/jpeg;base64," + menuDetails.image }} style={styles.detailsImage} />
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>{menuDetails.name}</Text>
                    <Text style={styles.detailsText}>{menuDetails.shortDescription}</Text>
                    <Text style={styles.detailsText}>Tempo di consegna: {menuDetails.deliveryTime}</Text>
                    <Text style={styles.detailsText}>Prezzo: {menuDetails.price}€</Text>
                    <Text style={styles.detailsText}>{menuDetails.longDescription}</Text>
                    <TouchableOpacity style={styles.detailsButton}>
                        <Text style={styles.detailsButtonText}>Acquista</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MenuDetailsScreen;