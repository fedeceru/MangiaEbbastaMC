import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import AppViewModel from '../../viewmodel/AppViewModel';
import { styles } from '../../Styles';
import LoadingScreen from "../LoadingScreen";
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            const fetchUserInfo = async () => {
                try {
                    console.log("Fetching user info...");
                    const userData = await AppViewModel.fetchUserInfo();
                    setUserInfo(userData);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            }
    
            fetchUserInfo();    
        }
    }, [isFocused]);

    if (isLoading) {
      return (
        <LoadingScreen />
      );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={localStyles.profileCard}>
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' }}
                    style={localStyles.profileImage}
                />
                <Text style={localStyles.profileName}>{`${userInfo.firstName || ''} ${userInfo.lastName || ''}`}</Text>
            </View>

            {userInfo.cardFullName || userInfo.cardNumber || userInfo.cardExpireMonth || userInfo.cardExpireYear || userInfo.cardCVV ? (
                <View style={localStyles.cardContainer}>
                    <Text style={localStyles.cardTitle}>Carta di Credito</Text>
                    <View style={localStyles.cardDetails}>
                        {userInfo.cardFullName && <Text style={localStyles.cardFullName}>{userInfo.cardFullName}</Text>}
                        {userInfo.cardNumber && <Text style={localStyles.cardNumber}>{userInfo.cardNumber}</Text>}
                        {(userInfo.cardExpireMonth || userInfo.cardExpireYear) && (
                            <View style={localStyles.cardExpiryContainer}>
                                {userInfo.cardExpireMonth && userInfo.cardExpireYear && (
                                    <Text style={localStyles.cardExpiry}>{`Scadenza: ${userInfo.cardExpireMonth < 10 ? '0' + userInfo.cardExpireMonth : userInfo.cardExpireMonth}/${userInfo.cardExpireYear}`}</Text>
                                )}
                                {userInfo.cardCVV && <Text style={localStyles.cardCVV}>{`CVV: ${userInfo.cardCVV}`}</Text>}
                            </View>
                        )}
                    </View>
                </View>
            ) : null}

            <View style={localStyles.navigationContainer}>
                <TouchableOpacity
                    style={localStyles.navigationButton}
                    onPress={() => navigation.navigate('EditProfile', { userInfo })}>
                    <View style={localStyles.buttonContent}>
                        <FontAwesome name="user" size={24} color="#fff" style={localStyles.icon} />
                        <Text style={localStyles.navigationButtonText}>Modifica Profilo</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={localStyles.navigationButton}
                    onPress={() => navigation.navigate('DeliveryStatus', { userId: userInfo.id })}>
                    <View style={localStyles.buttonContent}>
                        <FontAwesome name="truck" size={24} color="#fff" style={localStyles.icon} />
                        <Text style={localStyles.navigationButtonText}>Stato Ordine</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        marginTop: 20,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cardContainer: {
        marginTop: 30,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        marginHorizontal: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardDetails: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        padding: 15,
    },
    cardFullName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    cardNumber: {
        fontSize: 18,
        letterSpacing: 2,
        marginBottom: 10,
    },
    cardExpiryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardExpiry: {
        fontSize: 16,
    },
    cardCVV: {
        fontSize: 16,
    },
    navigationContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    navigationButton: {
        backgroundColor: '#000', // Sfondo nero per i pulsanti
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    navigationButtonText: {
        color: '#fff', // Testo bianco per contrastare il nero dello sfondo
        fontSize: 16,
        textAlign: 'center',
    },
});

export default ProfileScreen;
