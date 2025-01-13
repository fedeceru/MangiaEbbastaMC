import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import AppViewModel from '../../viewmodel/AppViewModel';
import { styles } from '../../Styles';
import LoadingScreen from "../LoadingScreen";
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { set } from 'react-hook-form';

const ProfileScreen = ({ navigation }) => {
    const [userInfo, setUserInfo] = useState([]);
    const [orderInfo, setOrderInfo] = useState([]);
    const [isLoading, setIsLoading] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setIsLoading(true);
            const fetchProfileInfo = async () => {
                try {
                    console.log("Fetching user info...");
                    const userData = await AppViewModel.fetchUserInfo();
                    setUserInfo(userData);
                    if (userData.lastOid !== null) {
                        console.log("Fetching order info...");
                        const orderData = await AppViewModel.fetchLastOrderInfo(userData.lastOid);
                        setOrderInfo(orderData);
                    }
                } catch (error) {
                    console.error("Error fetching profile info:", error);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchProfileInfo();    
        } 
    }, [isFocused]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear(); 
        const hours = date.getHours().toString().padStart(2, '0'); 
        const minutes = date.getMinutes().toString().padStart(2, '0'); 
        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    };

    if (isLoading) {
      return (
        <LoadingScreen />
      );
    }

    return (
        <ScrollView >
            <View style={styles.profileCard}>
                <Image
                    source={require("../../assets/userPlaceholder.png")}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>{`${userInfo.firstName || ''} ${userInfo.lastName || ''}`}</Text>
            </View>

            {userInfo.cardFullName || userInfo.cardNumber || userInfo.cardExpireMonth || userInfo.cardExpireYear || userInfo.cardCVV ? (
                <View style={styles.profileCardContainer}>
                    <Text style={styles.profileCardTitle}>Metodo di Pagamento</Text>
                    <View style={styles.profileCardDetails}>
                        {userInfo.cardFullName && <Text style={styles.cardFullName}>{userInfo.cardFullName}</Text>}
                        {userInfo.cardNumber && <Text style={styles.cardNumber}>{userInfo.cardNumber}</Text>}
                        {(userInfo.cardExpireMonth || userInfo.cardExpireYear) && (
                            <View style={styles.profileCardExpiryContainer}>
                                {userInfo.cardExpireMonth && userInfo.cardExpireYear && (
                                    <Text style={styles.profileCardExpiry}>{`Scadenza: ${userInfo.cardExpireMonth}/${userInfo.cardExpireYear}`}</Text>
                                )}
                                {userInfo.cardCVV && <Text style={styles.profileCardCVV}>{`CVV: ${userInfo.cardCVV}`}</Text>}
                            </View>
                        )}
                    </View>
                </View>
            ) : null}

            {userInfo.lastOid || userInfo.orderStatus ? (
                <View style={styles.profileCardContainer}>
                    <Text style={styles.profileCardTitle}>Ultimo Ordine Effettuato</Text>
                        {userInfo.orderStatus === "ON_DELIVERY" ? (
                            <View style={styles.profileCardDetails}> 
                                <Text>Hai ordinato: {orderInfo.name}</Text>
                                <Text>Stima di consegna: {formatTimestamp(orderInfo.expectedDeliveryTimestamp)}</Text>
                            </View> 
                        ) : userInfo.orderStatus === "COMPLETED" ? (
                            <View style={styles.profileCardDetails}> 
                            <Text>Hai ordinato: {orderInfo.name}</Text>
                                <Text>Consegnato in data: {formatTimestamp(orderInfo.deliveryTimestamp)}</Text>
                            </View>
                        ) : null }
                </View>
            ) : null}

            <View style={styles.profileButtonContainer}>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('EditProfile', { userInfo })}>
                    <View style={styles.profileButtonContent}>
                        <FontAwesome name="user" size={24} color="#fff" style={styles.profileIcon} />
                        <Text style={styles.profileButtonText}>Modifica Profilo</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;
