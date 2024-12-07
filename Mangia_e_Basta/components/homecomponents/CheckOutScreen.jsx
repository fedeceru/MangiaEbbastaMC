import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";

const CheckOutScreen = ({ route, navigation }) => {
    const { menu } = route.params;

    const handleConfirmOrder = () => {
        console.log("Ordine confermato per:", menu.name);
        // Implementa la logica per confermare l'ordine
        navigation.navigate("OrderConfirmationScreen"); // Vai alla schermata di conferma ordine
    };

    const handleCancelOrder = () => {
        console.log("Ordine annullato");
        navigation.goBack(); // Torna indietro alla schermata precedente
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Image source={{ uri: "data:image/jpeg;base64," + menu.image }} style={styles.image} />
                <Text style={styles.title}>{menu.name}</Text>
                <Text style={styles.description}>{menu.shortDescription}</Text>
                <Text style={styles.deliveryTime}>Tempo di consegna: {menu.deliveryTime} minuti</Text>
                <Text style={styles.price}>Prezzo: {menu.price}€</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
                        <Text style={styles.buttonText}>Conferma Ordine</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
                        <Text style={styles.buttonText}>Annulla</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    content: {
        alignItems: "center",
        padding: 16,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        color: "#555",
        marginBottom: 16,
        textAlign: "center",
    },
    deliveryTime: {
        fontSize: 16,
        color: "#333",
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 24,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    confirmButton: {
        backgroundColor: "#28a745",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: "#dc3545",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default CheckOutScreen;
