import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AppViewModel from '../../viewmodel/AppViewModel';
import { styles } from '../../Styles';

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

    /*<View style={styles.profileImageContainer}>
      <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
    </View>*/

    return (
      <ScrollView style={stili.container}>
          <View style={stili.infoContainer}>
              <Text style={stili.label}>Nome</Text>
              <Text style={stili.value}>{userInfo.firstName}</Text>
          </View>
          <View style={stili.infoContainer}>
              <Text style={stili.label}>Cognome</Text>
              <Text style={stili.value}>{userInfo.lastName}</Text>
          </View>
          <View style={stili.infoContainer}>
              <Text style={stili.label}>Nome sulla carta di credito</Text>
              <Text style={stili.value}>{userInfo.cardFullName}</Text>
          </View>          
          <View style={stili.infoContainer}>
              <Text style={stili.label}>Numero carta di credito</Text>
              <Text style={stili.value}>{userInfo.cardNumber}</Text>
          </View>          
          <View style={stili.infoContainer}>
              <Text style={stili.label}>Data scadenza</Text>
              <Text style={stili.value}>
              {userInfo.cardExpireMonth}/{userInfo.cardExpireYear}
              </Text>
          </View>      
          <View style={stili.infoContainer}>
              <Text style={stili.label}>CVV</Text>
              <Text style={stili.value}>{userInfo.cardCVV}</Text>
          </View>          
          <View style={stili.infoContainer}>
              <Text style={stili.label}>Ultimo ordine</Text>
              <Text style={stili.value}>{userInfo.lastOid}</Text>
          </View>
          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('EditProfile', {userInfo}, {upToDate}); }}>
                  <Text style={styles.buttonText}>Modifica Profilo</Text>
              </TouchableOpacity>
          </View>
      </ScrollView>
  );
};

export default ProfileScreen;

const stili = StyleSheet.create({
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