import { ScrollView, TouchableOpacity, View, Text, TextInput } from "react-native";
import { useState } from "react";
import { styles } from "../../Styles";
import AppViewModel from "../../viewmodel/AppViewModel";

const EditProfileScreen = ({ route, navigation }) => {
    const { userInfo } = route.params;
    const [updatedUserInfo, setUpdatedUserInfo] = useState({...userInfo});   

    const handleChange = (field, value) => {
        if (field === 'cardExpireYear' && value.length ) {    
            return;
        } else if (field === 'cardExpireMonth' && value > 12 && value.toString() < 1 && value.toString().length > 2) {
            return;
        } else if (field === 'cardNumber' && value.length != 16) {
            return;
        } else if (field === 'cardFullName' && value.split(' ').length > 2) {
            return;
        } 

        setUpdatedUserInfo({
            ...updatedUserInfo,
            [field]: value,
        });
    }

    const handleSave = async () => {
        try {
            console.log("Updating user info...");
            await AppViewModel.updateUserInfo(updatedUserInfo);
            navigation.goBack();    
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome:</Text>
                <TextInput
                    value={updatedUserInfo.firstName}
                    style={styles.input}
                    onChangeText={(value) => handleChange('firstName', value)}
                    placeholder="Inserisci il nome"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cognome:</Text>
                <TextInput
                    value={updatedUserInfo.lastName}
                    style={styles.input}
                    onChangeText={(value) => handleChange('lastName', value)}
                    placeholder="Inserisci il cognome"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Numero carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardNumber}
                    style={styles.input}
                    onChangeText={(value) => handleChange('cardNumber', value)}
                    placeholder="Inserisci il numero della carta"
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome sulla carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardFullName}
                    style={styles.input}
                    onChangeText={(value) => handleChange('cardFullName', value)}
                    placeholder="Inserisci il nome sulla carta"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mese di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireMonth ? updatedUserInfo.cardExpireMonth.toString() : ''}
                    style={styles.input}
                    onChangeText={(value) => handleChange('cardExpireMonth', value)}  
                    placeholder="MM"
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Anno di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireYear ? updatedUserInfo.cardExpireYear.toString() : ''}
                    style={styles.input}
                    onChangeText={(value) => handleChange('cardExpireYear', value)}
                    placeholder="YYYY"
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>CVV:</Text>
                <TextInput
                    value={updatedUserInfo.cardCVV ? updatedUserInfo.cardCVV.toString() : ''}
                    style={styles.input}
                    onChangeText={(value) => handleChange('cardCVV', value)}
                    placeholder="Inserisci il CVV"
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Salva modifiche</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default EditProfileScreen;
