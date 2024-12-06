import { ScrollView, TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import AppViewModel from "../../viewmodel/AppViewModel";
import { styles } from "../../Styles"; 

const EditProfileScreen = ({ route, navigation }) => {
    const { userInfo } = route.params;
    const [updatedUserInfo, setUpdatedUserInfo] = useState({ ...userInfo });
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setUpdatedUserInfo({
            ...updatedUserInfo,
            [field]: value,
        });

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: undefined,
        }));
    };

    const validateFields = () => {
        const newErrors = {};

        if (!updatedUserInfo.firstName) {
            newErrors.firstName = "Il nome è obbligatorio.";
        }

        if (!updatedUserInfo.lastName) {
            newErrors.lastName = "Il cognome è obbligatorio.";
        }

        if (!updatedUserInfo.cardFullName || updatedUserInfo.cardFullName.split(" ").length !== 2) {
            newErrors.cardFullName = "Nome e cognome sulla carta sono obbligatori.";
        }

        if (!/^[0-9]{16}$/.test(updatedUserInfo.cardNumber)) {
            newErrors.cardNumber = "Il numero della carta deve essere di 16 cifre.";
        }

        if (!/^([1-9]|1[0-2])$/.test(updatedUserInfo.cardExpireMonth)) {
            newErrors.cardExpireMonth = "Il mese deve essere compreso tra 1 e 12.";
        }

        if (!/^[0-9]{4}$/.test(updatedUserInfo.cardExpireYear)) {
            newErrors.cardExpireYear = "L'anno deve essere valido e non già passato.";
        }

        if (!/^[0-9]{3}$/.test(updatedUserInfo.cardCVV)) {
            newErrors.cardCVV = "Il CVV deve essere di 3 cifre.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

    const handleSave = async () => {
        if (!validateFields()) {
            return; 
        }

        try {
            console.log("Updating user info...");
            await AppViewModel.updateUserInfo(updatedUserInfo);
            navigation.goBack();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ScrollView style={localStyles.editScrollViewContainer}>
            <View style={localStyles.editInputContainer}>
                <Text style={localStyles.editInputLabel}>Nome:</Text>
                <TextInput
                    value={updatedUserInfo.firstName}
                    style={[localStyles.editInput, errors.firstName && localStyles.editInputError]}
                    onChangeText={(value) => handleChange("firstName", value)}
                    placeholder="Inserisci il nome"
                />
                {errors.firstName && (
                    <Text style={localStyles.editErrorText}>{errors.firstName}</Text>
                )}
            </View>
            <View style={localStyles.editInputContainer}>
                <Text style={localStyles.editInputLabel}>Cognome:</Text>
                <TextInput
                    value={updatedUserInfo.lastName}
                    style={[localStyles.editInput, errors.lastName && localStyles.editInputError]} 
                    onChangeText={(value) => handleChange("lastName", value)}
                    placeholder="Inserisci il cognome"
                />
                {errors.lastName && (
                    <Text style={localStyles.editErrorText}>{errors.lastName}</Text>
                )}
            </View>
            <View style={localStyles.editInputContainer}>
                <Text style={localStyles.editInputLabel}>Numero carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardNumber}
                    style={[localStyles.editInput, errors.cardNumber && localStyles.editInputError]}
                    onChangeText={(value) => handleChange("cardNumber", value)}
                    placeholder="Inserisci il numero della carta"
                    keyboardType="numeric"
                />
                {errors.cardNumber && (
                    <Text style={localStyles.editErrorText}>{errors.cardNumber}</Text>
                )}
            </View>
            <View style={localStyles.editInputContainer}>
                <Text style={localStyles.editInputLabel}>Nome sulla carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardFullName}
                    style={[localStyles.editInput, errors.cardFullName && localStyles.editInputError]}
                    onChangeText={(value) => handleChange("cardFullName", value)}
                    placeholder="Inserisci il nome sulla carta"
                />
                {errors.cardFullName && (
                    <Text style={localStyles.editErrorText}>{errors.cardFullName}</Text>
                )}
            </View>
            <View style={localStyles.editInputContainer}>
                <Text style={localStyles.editInputLabel}>Mese di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireMonth ? updatedUserInfo.cardExpireMonth.toString() : ""}
                    style={[localStyles.editInput, errors.cardExpireMonth && localStyles.editInputError]}
                    onChangeText={(value) => handleChange("cardExpireMonth", value)}
                    placeholder="MM"
                    keyboardType="numeric"
                />
                {errors.cardExpireMonth && (
                    <Text style={localStyles.editErrorText}>{errors.cardExpireMonth}</Text>
                )}
            </View>
            <View style={localStyles.editInputContainer}>
                <Text style={localStyles.editInputLabel}>Anno di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireYear ? updatedUserInfo.cardExpireYear.toString() : ""}
                    style={[localStyles.editInput, errors.cardExpireYear && localStyles.editInputError]}
                    onChangeText={(value) => handleChange("cardExpireYear", value)}
                    placeholder="YYYY"
                    keyboardType="numeric"
                />
                {errors.cardExpireYear && (
                    <Text style={localStyles.editErrorText}>{errors.cardExpireYear}</Text>
                )}
            </View>
            <View style={localStyles.editInputContainer}>
                <Text style={localStyles.editInputLabel}>CVV:</Text>
                <TextInput
                    value={updatedUserInfo.cardCVV ? updatedUserInfo.cardCVV.toString() : ""}
                    style={[localStyles.editInput, errors.cardCVV && localStyles.editInputError]}
                    onChangeText={(value) => handleChange("cardCVV", value)}
                    placeholder="Inserisci il CVV"
                    keyboardType="numeric"
                />
                {errors.cardCVV && (
                    <Text style={localStyles.editErrorText}>{errors.cardCVV}</Text>
                )}
            </View>
            <View style={localStyles.editButtonContainer}>
                <TouchableOpacity style={localStyles.editButton} onPress={handleSave}>
                    <Text style={localStyles.editButtonText}>Salva modifiche</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default EditProfileScreen;
