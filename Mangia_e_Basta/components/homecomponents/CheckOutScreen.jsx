import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import AppViewModel from "../../viewmodel/AppViewModel";

const CheckOutScreen = ({ route, navigation }) => {
    const { menu } = route.params;
    const [isBought, setIsBought] = useState(false);

    const handleConfirmOrder = async () => {
        console.log("Ordine confermato per:", menu.name);
        const result = await AppViewModel.buyMenu(menu.mid);
        console.log("Risultato acquisto:", result);
        if (result) {
            setIsBought(true);
        }
    };

    const handleCancelOrder = () => {
        console.log("Ordine annullato");
        navigation.goBack();
    };

    if (isBought) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.confirmationContainer}>
                    <Image
                        source={{ uri: "https://cdn-icons-png.flaticon.com/128/3765/3765478.png" }}
                        style={styles.successIcon}
                    />
                    <Text style={styles.confirmationTitle}>Ordine Confermato!</Text>
                    <Text style={styles.confirmationMessage}>
                        Grazie per il tuo ordine. Stiamo preparando il tuo menu e sarà presto consegnato!
                    </Text>
                    <TouchableOpacity
                        style={styles.goHomeButton}
                        onPress={() => navigation.navigate("HomeTab", { screen: "Home" })}
                    >
                        <Text style={styles.goHomeButtonText}>Torna alla Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Image source={{ uri: "data:image/jpeg;base64," + menu.image }} style={styles.image} />
                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>{menu.name}</Text>
                        <Text style={styles.description}>{menu.shortDescription}</Text>
                        <View style={styles.detailsRow}>
                            <Text style={styles.label}>Tempo di consegna:</Text>
                            <Text style={styles.value}>{menu.deliveryTime} minuti</Text>
                        </View>
                        <View style={styles.detailsRow}>
                            <Text style={styles.label}>Prezzo:</Text>
                            <Text style={styles.value}>{menu.price}€</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryTitle}>Riepilogo Ordine</Text>
                    <View style={styles.detailsRow}>
                        <Text style={styles.label}>Totale:</Text>
                        <Text style={styles.totalValue}>{menu.price}€</Text>
                    </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmOrder}>
                        <Text style={styles.buttonText}>Conferma Ordine</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={handleCancelOrder}>
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
        backgroundColor: "#F5F5F5",
    },
    confirmationContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#FFFFFF",
    },
    successIcon: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    confirmationTitle: {
        fontSize: 24,
        fontWeight: "600",
        color: "#1E1E1E",
        marginBottom: 10,
        textAlign: "center",
    },
    confirmationMessage: {
        fontSize: 16,
        color: "#4A4A4A",
        textAlign: "center",
        marginBottom: 20,
    },
    goHomeButton: {
        backgroundColor: "#007BFF",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    goHomeButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    content: {
        padding: 16,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 200,
    },
    infoContainer: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
        color: "#1E1E1E",
    },
    description: {
        fontSize: 16,
        color: "#4A4A4A",
        marginBottom: 16,
    },
    detailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: "#737373",
    },
    value: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1E1E1E",
    },
    divider: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginVertical: 16,
    },
    summaryContainer: {
        padding: 16,
        backgroundColor: "#FFF",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
        color: "#1E1E1E",
    },
    totalValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#007BFF",
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    primaryButton: {
        flex: 1,
        backgroundColor: "#007BFF",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginRight: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: "#FF3B30",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginLeft: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFF",
    },
});

export default CheckOutScreen;
