import { ScrollView, TouchableOpacity, View, Text, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import { styles } from "../../Styles";
import AppViewModel from "../../viewmodel/AppViewModel";

const EditProfileScreen = ({ route, navigation }) => {
    const { userInfo } = route.params;
    const [updatedUserInfo, setUpdatedUserInfo] = useState({ ...userInfo });
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setUpdatedUserInfo({
            ...updatedUserInfo,
            [field]: value,
        });

        // Rimuovi l'errore se il campo viene modificato
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
        return Object.keys(newErrors).length === 0; // Ritorna true se non ci sono errori
    };

    const handleSave = async () => {
        if (!validateFields()) {
            return; // Blocca il salvataggio se ci sono errori
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
        <ScrollView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome:</Text>
                <TextInput
                    value={updatedUserInfo.firstName}
                    style={[styles.input, errors.firstName && localStyles.inputError]}
                    onChangeText={(value) => handleChange("firstName", value)}
                    placeholder="Inserisci il nome"
                />
                {errors.firstName && (
                    <Text style={localStyles.errorText}>{errors.firstName}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cognome:</Text>
                <TextInput
                    value={updatedUserInfo.lastName}
                    style={[styles.input, errors.lastName && localStyles.inputError]} //se esiste un errore associato al campo cambia lo stile
                    onChangeText={(value) => handleChange("lastName", value)}
                    placeholder="Inserisci il cognome"
                />
                {errors.lastName && (
                    <Text style={localStyles.errorText}>{errors.lastName}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Numero carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardNumber}
                    style={[styles.input, errors.cardNumber && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardNumber", value)}
                    placeholder="Inserisci il numero della carta"
                    keyboardType="numeric"
                />
                {errors.cardNumber && (
                    <Text style={localStyles.errorText}>{errors.cardNumber}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome sulla carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardFullName}
                    style={[styles.input, errors.cardFullName && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardFullName", value)}
                    placeholder="Inserisci il nome sulla carta"
                />
                {errors.cardFullName && (
                    <Text style={localStyles.errorText}>{errors.cardFullName}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mese di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireMonth ? updatedUserInfo.cardExpireMonth.toString() : ""}
                    style={[styles.input, errors.cardExpireMonth && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardExpireMonth", value)}
                    placeholder="MM"
                    keyboardType="numeric"
                />
                {errors.cardExpireMonth && (
                    <Text style={localStyles.errorText}>{errors.cardExpireMonth}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Anno di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireYear ? updatedUserInfo.cardExpireYear.toString() : ""}
                    style={[styles.input, errors.cardExpireYear && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardExpireYear", value)}
                    placeholder="YYYY"
                    keyboardType="numeric"
                />
                {errors.cardExpireYear && (
                    <Text style={localStyles.errorText}>{errors.cardExpireYear}</Text>
                )}
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>CVV:</Text>
                <TextInput
                    value={updatedUserInfo.cardCVV ? updatedUserInfo.cardCVV.toString() : ""}
                    style={[styles.input, errors.cardCVV && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardCVV", value)}
                    placeholder="Inserisci il CVV"
                    keyboardType="numeric"
                />
                {errors.cardCVV && (
                    <Text style={localStyles.errorText}>{errors.cardCVV}</Text>
                )}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleSave}>
                    <Text style={styles.buttonText}>Salva modifiche</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    inputError: {
        borderColor: "red",
        borderWidth: 1,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 4,
    },
});

export default EditProfileScreen;
