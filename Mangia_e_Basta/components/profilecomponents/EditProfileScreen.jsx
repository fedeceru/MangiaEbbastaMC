import { ScrollView, TouchableOpacity, View, Text, TextInput } from "react-native";
import { useState } from "react";
import { styles } from "../../Styles";
import AppViewModel from "../../viewmodel/AppViewModel";

const EditProfileScreen = ({ route, navigation }) => {
    const { userInfo, handleUpToDate } = route.params;
    const [updatedUserInfo, setUpdatedUserInfo] = useState({...userInfo});   

    const handleChange = (field, value) => {
        setUpdatedUserInfo({
            ...updatedUserInfo,
            [field]: value,
        });
    }

    const handleSave = async () => {
        try {
            console.log("Updating user info...");
            await AppViewModel.updateUserInfo(updatedUserInfo);
            () => handleUpToDate();
            navigation.goBack();    
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.text}>Nome:</Text>
            <TextInput
                value={updatedUserInfo.firstName}
                style={styles.infoContainer}
                onChangeText={(value) => handleChange('firstName', value)}
                placeholder="Inserisci il nome"
            />
            <Text style={styles.text}>Cognome:</Text>
            <TextInput
                value={updatedUserInfo.lastName}
                style={styles.infoContainer}
                onChangeText={(value) => handleChange('lastName', value)}
                placeholder="Inserisci il cognome"
            />
            <Text style={styles.text}>cardNumber:</Text>
            <TextInput
                value={updatedUserInfo.cardNumber}
                style={styles.infoContainer}
                onChangeText={(value) => handleChange('cardNumber', value)}
                placeholder="Inserisci il cardNumber"
            />
            <Text style={styles.text}>cardFullName:</Text>
            <TextInput
                value={updatedUserInfo.cardFullName}
                style={styles.infoContainer}
                onChangeText={(value) => handleChange('cardFullName', value)}
                placeholder="Inserisci il cardFullName"
            />
            <Text style={styles.text}>cardExpireMonth</Text>
            <TextInput
                value={updatedUserInfo.cardExpireMonth ? updatedUserInfo.cardExpireMonth.toString(): ''}
                style={styles.infoContainer}
                onChangeText={(value) => handleChange('cardExpireMonth', value)}  
                placeholder="Inserisci il cardExpireMonth"
            />
            <Text style={styles.text}>cardExpireYear</Text>
            <TextInput
                value={updatedUserInfo.cardExpireYear ? updatedUserInfo.cardExpireYear.toString(): ''}
                style={styles.infoContainer}
                onChangeText={(value) => handleChange('cardExpireYear', value)}
                placeholder="Inserisci il cardExpireYear"
            />
            <Text style={styles.text}>cardCVV</Text>
            <TextInput
                value={updatedUserInfo.cardCVV ? updatedUserInfo.cardCVV.toString(): ''}
                style={styles.infoContainer}
                onChangeText={(value) => handleChange('cardCVV', value)}
                placeholder="Inserisci il cardCVV"
            />
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Salva modifiche</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default EditProfileScreen;
