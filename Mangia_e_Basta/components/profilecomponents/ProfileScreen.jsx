import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
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
            <View style={styles.profileCard}>
                <Image
                    source={require("../../assets/userPlaceholder.png")}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>{`${userInfo.firstName || ''} ${userInfo.lastName || ''}`}</Text>
            </View>

            {userInfo.cardFullName || userInfo.cardNumber || userInfo.cardExpireMonth || userInfo.cardExpireYear || userInfo.cardCVV ? (
                <View style={styles.profileCardContainer}>
                    <Text style={styles.profileCardTitle}>Carta di Credito</Text>
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

            <View style={styles.profileButtonContainer}>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('EditProfile', { userInfo })}>
                    <View style={styles.profileButtonContent}>
                        <FontAwesome name="user" size={24} color="#fff" style={styles.profileIcon} />
                        <Text style={styles.profileButtonText}>Modifica Profilo</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('DeliveryStatus', { lastOid: userInfo.lastOid, orderStatus: userInfo.orderStatus })}>
                    <View style={styles.profileButtonContent}>
                        <FontAwesome name="truck" size={24} color="#fff" style={styles.profileIcon} />
                        <Text style={styles.profileButtonText}>Stato Ordine</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;
