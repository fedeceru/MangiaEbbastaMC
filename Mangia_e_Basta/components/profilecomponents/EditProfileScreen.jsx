import { ScrollView, TouchableOpacity, View, Text, TextInput } from "react-native";
import { useState } from "react";
import { styles } from "../../Styles";
import AppViewModel from "../../viewmodel/AppViewModel";

const EditProfileScreen = ({ route, navigation }) => {
    const { userInfo } = route.params;
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
            navigation.goBack();    
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Nome:</Text>
                <TextInput
                    value={updatedUserInfo.firstName}
                    style={styles.value}
                    onChangeText={(value) => handleChange('firstName', value)}
                    placeholder="Inserisci il nome"
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Cognome:</Text>
                <TextInput
                    value={updatedUserInfo.lastName}
                    style={styles.value}
                    onChangeText={(value) => handleChange('lastName', value)}
                    placeholder="Inserisci il cognome"
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>cardNumber:</Text>
                <TextInput
                    value={updatedUserInfo.cardNumber}
                    style={styles.value}
                    onChangeText={(value) => handleChange('cardNumber', value)}
                    placeholder="Inserisci il cardNumber"
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>cardFullName:</Text>
                <TextInput
                    value={updatedUserInfo.cardFullName}
                    style={styles.value}
                    onChangeText={(value) => handleChange('cardFullName', value)}
                    placeholder="Inserisci il cardFullName"
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>cardExpireMonth</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireMonth ? updatedUserInfo.cardExpireMonth.toString(): ''}
                    style={styles.value}
                    onChangeText={(value) => handleChange('cardExpireMonth', value)}  
                    placeholder="Inserisci il cardExpireMonth"
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>cardExpireYear</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireYear ? updatedUserInfo.cardExpireYear.toString(): ''}
                    style={styles.value}
                    onChangeText={(value) => handleChange('cardExpireYear', value)}
                    placeholder="Inserisci il cardExpireYear"
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>cardCVV</Text>
                <TextInput
                    value={updatedUserInfo.cardCVV ? updatedUserInfo.cardCVV.toString(): ''}
                    style={styles.value}
                    onChangeText={(value) => handleChange('cardCVV', value)}
                    placeholder="Inserisci il cardCVV"
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
