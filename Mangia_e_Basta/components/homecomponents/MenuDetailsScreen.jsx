import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
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

    const handleCanPlaceOrder = async () => {
        try {
            console.log("checking if user can place order...");
            const checkUser = await AppViewModel.checkUser();
            const { isProfileComplete, isOrderInProgress } = checkUser;
            console.log("isProfileComplete: ", isProfileComplete);
            console.log("isOrderInProgress: ", isOrderInProgress);
            const onCancel = () => navigation.goBack();

            if (!isProfileComplete) {
                const reason = "non hai inserito i dati della carta di credito, pocedi alla schermata di modifica profilo per completare l'acquisto"; 
                Alert.alert(
                    "Impossibile Procedere",
                    `Non puoi completare l'acquisto perché ${reason}`,
                    [
                        {
                            text: "Annulla",
                            onPress: onCancel,
                            style: "cancel", 
                        },
                        {
                            text: "Modifica Profilo",
                            onPress: () => navigation.navigate('ProfileTab'),
                        },
                    ],
                    { cancelable: false } 
                );
            }

            if (isOrderInProgress) {
                const reason = "hai già un ordine in corso, non puoi farne un altro fiché l'utimo non è stato consegnato";                 
                Alert.alert(
                    "Impossibile Procedere",
                    `Non puoi completare l'acquisto perché ${reason}`,
                    [
                        {
                            text: "Annulla",
                            onPress: onCancel,
                            style: "cancel", 
                        },
                        {
                            text: "Visualizza Ordine",
                            onPress: () => navigation.navigate('OrderTab'), 
                        },
                    ],
                    { cancelable: false } 
                );
            }

            if (isProfileComplete && !isOrderInProgress) {
                navigation.navigate('CheckOut', {menu});
            }
        } catch (error) {
            console.error(error);
        }
    }

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
                    <TouchableOpacity style={styles.detailsButton} onPress={handleCanPlaceOrder}>
                        <Text style={styles.detailsButtonText}>Acquista</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MenuDetailsScreen;