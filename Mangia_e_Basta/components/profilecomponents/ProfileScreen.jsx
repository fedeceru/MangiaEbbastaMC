import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import AppViewModel from '../../viewmodel/AppViewModel';
import { styles } from '../../Styles';
import LoadingScreen from "../LoadingScreen";
import { useIsFocused } from '@react-navigation/native';

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
                <Text style={styles.profileName}>{`${userInfo.firstName} ${userInfo.lastName}`}</Text>
                <Text style={styles.profileInfo}>{userInfo.cardFullName}</Text>
                <Text style={styles.profileInfo}>Last Order: {userInfo.lastOid}</Text>
            </View>
            
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Numero carta di credito</Text>
                <Text style={styles.value}>{userInfo.cardNumber}</Text>
            </View>          
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Data scadenza</Text>
                <Text style={styles.value}>
                {userInfo.cardExpireMonth}/{userInfo.cardExpireYear}
                </Text>
            </View>      
            <View style={styles.infoContainer}>
                <Text style={styles.label}>CVV</Text>
                <Text style={styles.value}>{userInfo.cardCVV}</Text>
            </View>          
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('EditProfile', {userInfo}); }}>
                    <Text style={styles.buttonText}>Modifica Profilo</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;