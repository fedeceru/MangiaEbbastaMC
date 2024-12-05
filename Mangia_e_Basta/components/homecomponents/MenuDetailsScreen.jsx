import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
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
        <SafeAreaView style={localStyles.container}>
            <ScrollView>
                <Image source={{ uri: "data:image/jpeg;base64," + menuDetails.image }} style={localStyles.image} />
                <View style={localStyles.card}>
                    <Text style={localStyles.title}>{menuDetails.name}</Text>
                    <Text style={localStyles.text}>{menuDetails.shortDescription}</Text>
                    <Text style={localStyles.text}>Tempo di consegna: {menuDetails.deliveryTime}</Text>
                    <Text style={localStyles.text}>Prezzo: {menuDetails.price}€</Text>
                    <Text style={localStyles.text}>{menuDetails.longDescription}</Text>
                    <TouchableOpacity style={localStyles.button}>
                        <Text style={localStyles.buttonText}>Acquista</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 10,
    },
    image: {
        width: '100%',
        height: 300,  
        borderRadius: 10,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#e63946',  
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default MenuDetailsScreen;