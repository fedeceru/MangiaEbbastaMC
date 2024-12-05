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
        <ScrollView >
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
                    style={localStyles.button}
                    onPress={() => navigation.navigate('EditProfile', { userInfo })}>
                    <View style={localStyles.buttonContent}>
                        <FontAwesome name="user" size={24} color="#fff" style={localStyles.icon} />
                        <Text style={localStyles.buttonText}>Modifica Profilo</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={localStyles.button}
                    onPress={() => navigation.navigate('DeliveryStatus', { userId: userInfo.id })}>
                    <View style={localStyles.buttonContent}>
                        <FontAwesome name="truck" size={24} color="#fff" style={localStyles.icon} />
                        <Text style={localStyles.buttonText}>Stato Ordine</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    profileCard: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#000',
    },
    profileName: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    cardContainer: {
        backgroundColor: '#f1f1f1',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    cardDetails: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    cardFullName: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
    },
    cardNumber: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
    },
    cardExpiryContainer: {
        marginTop: 10,
    },
    cardExpiry: {
        fontSize: 16,
        color: '#000',
        marginBottom: 5,
    },
    cardCVV: {
        fontSize: 16,
        color: '#000',
    },
    navigationContainer: {
        marginTop: 30,
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: '#333', 
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
  });

export default ProfileScreen;
