import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AppViewModel from '../../viewmodel/AppViewModel';

const ProfileScreen = ({ navigation }) => {
//in questa schermata mi aspetto di ottenere dal server i dati dell'utente, essa si aggiorna ogni volata che i dati dell'utente cambiano
//Percio la soluzione sarebbe quella di fare la chimata al server solamente quando c'è stata una modifica dei dati dell'utente, in questo modo si evita di fare chiamate inutili

    const [userInfo, setUserInfo] = useState([]);
    const [upToDate, setUpToDate] = useState(true);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                console.log("Fetching user info...");
                const userData = await AppViewModel.fetchUserInfo();
                console.log("User info fetched:", userData);
                setUserInfo(userData);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        }

        fetchUserInfo();
    }, [upToDate]);

    const updateInfo = () => {
        setUpToDate(false);
    }

    return(
        <View style={styles.profileContainer}>
            <Text style={styles.header}>Profilo</Text>
            <View style={styles.profileSection}>
                <Text style={styles.label}>Nome e Cognome</Text>
                <Text style={styles.value}>{userInfo.firstName} {userInfo.lastName}</Text>
            </View>
            
            <View style={styles.profileSection}>
                <Text style={styles.label}>Nome sulla Carta di Credito</Text>
                <Text style={styles.value}>{userInfo.cardName}</Text>
            </View>
            
            <View style={styles.profileSection}>
                <Text style={styles.label}>Numero Carta di Credito</Text>
                <Text style={styles.value}>**** **** **** {userInfo.cardNumber}</Text>
            </View>
            
            <View style={styles.profileSection}>
                <Text style={styles.label}>Data Scadenza Carta</Text>
                <Text style={styles.value}>{userInfo.cardExpiryMonth}/{userInfo.cardExpiryYear}</Text>
            </View>
            
            <View style={styles.profileSection}>
                <Text style={styles.label}>Codice Segreto Carta</Text>
                <TouchableOpacity onPress={togglePinVisibility}>
                    <Text style={styles.value}>{userInfo.cardPin}</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.profileSection}>
                <Text style={styles.label}>Ultimo Ordine</Text>
                <Text style={styles.value}>{userInfo.lastOrder ? userInfo.lastOrder.description : "Nessun ordine effettuato."}</Text>
                <TouchableOpacity onPress={viewLastOrder}>
                <Text style={styles.link}>Visualizza Dettagli</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen', updateInfo={updateInfo}, userInfo={userInfo})} style={styles.editButton}>
                <Text style={styles.editButtonText}>Modifica Profilo</Text>
            </TouchableOpacity>
        </View>
    )
};

export default ProfileScreen;

const styles = StyleSheet.create({
    profileContainer: {
      padding: 20,
      backgroundColor: "#fff",
      flex: 1,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    profileSection: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      color: "#7F8C8D",
    },
    value: {
      fontSize: 18,
      color: "#2C3E50",
    },
    link: {
      color: "#3498DB",
      textDecorationLine: "underline",
    },
    editButton: {
      backgroundColor: "#1ABC9C",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 30,
    },
    editButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });