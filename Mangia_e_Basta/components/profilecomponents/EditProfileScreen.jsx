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
        <ScrollView style={localStyles.scrollViewContainer}>
            <View style={localStyles.inputContainer}>
                <Text style={localStyles.inputLabel}>Nome:</Text>
                <TextInput
                    value={updatedUserInfo.firstName}
                    style={[localStyles.input, errors.firstName && localStyles.inputError]}
                    onChangeText={(value) => handleChange("firstName", value)}
                    placeholder="Inserisci il nome"
                />
                {errors.firstName && (
                    <Text style={localStyles.errorText}>{errors.firstName}</Text>
                )}
            </View>
            <View style={localStyles.inputContainer}>
                <Text style={localStyles.inputLabel}>Cognome:</Text>
                <TextInput
                    value={updatedUserInfo.lastName}
                    style={[localStyles.input, errors.lastName && localStyles.inputError]} 
                    onChangeText={(value) => handleChange("lastName", value)}
                    placeholder="Inserisci il cognome"
                />
                {errors.lastName && (
                    <Text style={localStyles.errorText}>{errors.lastName}</Text>
                )}
            </View>
            <View style={localStyles.inputContainer}>
                <Text style={localStyles.inputLabel}>Numero carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardNumber}
                    style={[localStyles.input, errors.cardNumber && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardNumber", value)}
                    placeholder="Inserisci il numero della carta"
                    keyboardType="numeric"
                />
                {errors.cardNumber && (
                    <Text style={localStyles.errorText}>{errors.cardNumber}</Text>
                )}
            </View>
            <View style={localStyles.inputContainer}>
                <Text style={localStyles.inputLabel}>Nome sulla carta di credito:</Text>
                <TextInput
                    value={updatedUserInfo.cardFullName}
                    style={[localStyles.input, errors.cardFullName && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardFullName", value)}
                    placeholder="Inserisci il nome sulla carta"
                />
                {errors.cardFullName && (
                    <Text style={localStyles.errorText}>{errors.cardFullName}</Text>
                )}
            </View>
            <View style={localStyles.inputContainer}>
                <Text style={localStyles.inputLabel}>Mese di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireMonth ? updatedUserInfo.cardExpireMonth.toString() : ""}
                    style={[localStyles.input, errors.cardExpireMonth && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardExpireMonth", value)}
                    placeholder="MM"
                    keyboardType="numeric"
                />
                {errors.cardExpireMonth && (
                    <Text style={localStyles.errorText}>{errors.cardExpireMonth}</Text>
                )}
            </View>
            <View style={localStyles.inputContainer}>
                <Text style={localStyles.inputLabel}>Anno di scadenza:</Text>
                <TextInput
                    value={updatedUserInfo.cardExpireYear ? updatedUserInfo.cardExpireYear.toString() : ""}
                    style={[localStyles.input, errors.cardExpireYear && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardExpireYear", value)}
                    placeholder="YYYY"
                    keyboardType="numeric"
                />
                {errors.cardExpireYear && (
                    <Text style={localStyles.errorText}>{errors.cardExpireYear}</Text>
                )}
            </View>
            <View style={localStyles.inputContainer}>
                <Text style={localStyles.inputLabel}>CVV:</Text>
                <TextInput
                    value={updatedUserInfo.cardCVV ? updatedUserInfo.cardCVV.toString() : ""}
                    style={[localStyles.input, errors.cardCVV && localStyles.inputError]}
                    onChangeText={(value) => handleChange("cardCVV", value)}
                    placeholder="Inserisci il CVV"
                    keyboardType="numeric"
                />
                {errors.cardCVV && (
                    <Text style={localStyles.errorText}>{errors.cardCVV}</Text>
                )}
            </View>
            <View style={localStyles.buttonContainer}>
                <TouchableOpacity style={localStyles.button} onPress={handleSave}>
                    <Text style={localStyles.buttonText}>Salva modifiche</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 20,
      },
      inputContainer: {
        marginBottom: 20,
      },
      inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
      },
      input: {
        backgroundColor: '#F5F5F5',
        color: '#000000',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#D1D1D1',
      },
      inputError: {
        borderColor: '#FF5C5C',
      },
      errorText: {
        fontSize: 14,
        color: '#FF5C5C',
        marginTop: 5,
      },
      buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
      },
      button: {
        backgroundColor: '#FF5C5C',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
      },
      buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      },
  });

export default EditProfileScreen;
