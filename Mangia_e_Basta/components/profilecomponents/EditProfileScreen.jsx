import { ScrollView, TouchableOpacity, View, Text, TextInput } from "react-native";
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
            newErrors.cardExpireYear = "L'anno di scadenza deve essere di 4 cifre.";
        }

        if (!/^[0-9]{3}$/.test(updatedUserInfo.cardCVV)) {
            newErrors.cardCVV = "Il CVV deve essere di 3 cifre.";
        }

        setErrors(newErrors);
        //mi restituisce true se non ci sono errori 
        return Object.keys(newErrors).length === 0; 
    };

    const handleSave = async () => {
        //controlla che non ci siano errori
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
        <ScrollView style={styles.editScrollViewContainer}>
            <View style={styles.editInputContainer}>
                <Text style={styles.editInputLabel}>Nome:</Text>
                <TextInput
                    value={updatedUserInfo.firstName}
                    style={[styles.editInput, errors.firstName && styles.editInputError]}
                    onChangeText={(value) => handleChange("firstName", value)}
                    placeholder="Inserisci il nome"
                />
                {errors.firstName && (
                    <Text style={styles.editErrorText}>{errors.firstName}</Text>
                )}
            </View>
            <View style={styles.editInputContainer}>
                <Text style={styles.editInputLabel}>Cognome:</Text>
                <TextInput
                    value={updatedUserInfo.lastName}
                    style={[styles.editInput, errors.lastName && styles.editInputError]} 
                    onChangeText={(value) => handleChange("lastName", value)}
                    placeholder="Inserisci il cognome"
                />
                {errors.lastName && (
                    <Text style={styles.editErrorText}>{errors.lastName}</Text>
                )}
            </View>
            <View style={styles.editInputContainer}>
                <Text style={styles.editInputLabel}>Numero carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardNumber}
                    style={[styles.editInput, errors.cardNumber && styles.editInputError]}
                    onChangeText={(value) => handleChange("cardNumber", value)}
                    placeholder="Inserisci il numero della carta"
                    keyboardType="numeric"
                />
                {errors.cardNumber && (
                    <Text style={styles.editErrorText}>{errors.cardNumber}</Text>
                )}
            </View>
            <View style={styles.editInputContainer}>
                <Text style={styles.editInputLabel}>Nome sulla carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardFullName}
                    style={[styles.editInput, errors.cardFullName && styles.editInputError]}
                    onChangeText={(value) => handleChange("cardFullName", value)}
                    placeholder="Inserisci il nome sulla carta"
                />
                {errors.cardFullName && (
                    <Text style={styles.editErrorText}>{errors.cardFullName}</Text>
                )}
            </View>
            <View style={styles.editInputContainer}>
                <Text style={styles.editInputLabel}>Mese di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireMonth ? updatedUserInfo.cardExpireMonth.toString() : ""}
                    style={[styles.editInput, errors.cardExpireMonth && styles.editInputError]}
                    onChangeText={(value) => handleChange("cardExpireMonth", value)}
                    placeholder="MM"
                    keyboardType="numeric"
                />
                {errors.cardExpireMonth && (
                    <Text style={styles.editErrorText}>{errors.cardExpireMonth}</Text>
                )}
            </View>
            <View style={styles.editInputContainer}>
                <Text style={styles.editInputLabel}>Anno di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireYear ? updatedUserInfo.cardExpireYear.toString() : ""}
                    style={[styles.editInput, errors.cardExpireYear && styles.editInputError]}
                    onChangeText={(value) => handleChange("cardExpireYear", value)}
                    placeholder="YYYY"
                    keyboardType="numeric"
                />
                {errors.cardExpireYear && (
                    <Text style={styles.editErrorText}>{errors.cardExpireYear}</Text>
                )}
            </View>
            <View style={styles.editInputContainer}>
                <Text style={styles.editInputLabel}>CVV:</Text>
                <TextInput
                    value={updatedUserInfo.cardCVV ? updatedUserInfo.cardCVV.toString() : ""}
                    style={[styles.editInput, errors.cardCVV && styles.editInputError]}
                    onChangeText={(value) => handleChange("cardCVV", value)}
                    placeholder="Inserisci il CVV"
                    keyboardType="numeric"
                />
                {errors.cardCVV && (
                    <Text style={styles.editErrorText}>{errors.cardCVV}</Text>
                )}
            </View>
            <View style={styles.editButtonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={handleSave}>
                    <Text style={styles.editButtonText}>Salva modifiche</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default EditProfileScreen;
