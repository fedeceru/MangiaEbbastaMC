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
            <View style={styles.profileCard}>
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' }}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>{`${userInfo.firstName || ''} ${userInfo.lastName || ''}`}</Text>
            </View>

            {userInfo.cardFullName || userInfo.cardNumber || userInfo.cardExpireMonth || userInfo.cardExpireYear || userInfo.cardCVV ? (
                <View style={styles.cardContainer}>
                    <Text style={styles.cardTitle}>Carta di Credito</Text>
                    <View style={styles.cardDetails}>
                        {userInfo.cardFullName && <Text style={styles.cardFullName}>{userInfo.cardFullName}</Text>}
                        {userInfo.cardNumber && <Text style={styles.cardNumber}>{userInfo.cardNumber}</Text>}
                        {(userInfo.cardExpireMonth || userInfo.cardExpireYear) && (
                            <View style={styles.cardExpiryContainer}>
                                {userInfo.cardExpireMonth && userInfo.cardExpireYear && (
                                    <Text style={styles.cardExpiry}>{`Scadenza: ${userInfo.cardExpireMonth < 10 ? '0' + userInfo.cardExpireMonth : userInfo.cardExpireMonth}/${userInfo.cardExpireYear}`}</Text>
                                )}
                                {userInfo.cardCVV && <Text style={styles.cardCVV}>{`CVV: ${userInfo.cardCVV}`}</Text>}
                            </View>
                        )}
                    </View>
                </View>
            ) : null}

            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={() => navigation.navigate('EditProfile', { userInfo })}>
                    <View style={styles.buttonContent}>
                        <FontAwesome name="user" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.navigationButtonText}>Modifica Profilo</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={() => navigation.navigate('DeliveryStatus', { userId: userInfo.id })}>
                    <View style={styles.buttonContent}>
                        <FontAwesome name="truck" size={24} color="#fff" style={styles.icon} />
                        <Text style={styles.navigationButtonText}>Stato Ordine</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;
