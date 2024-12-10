import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import AppViewModel from "../../viewmodel/AppViewModel";
import { styles } from "../../Styles";
import LoadingScreen from "../LoadingScreen";

const CheckOutScreen = ({ route, navigation }) => {
    const { menu } = route.params;
    const [isBought, setIsBought] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmOrder = async () => {
        try {
            setIsLoading(true);
            const result = await AppViewModel.buyMenu(menu.mid);
            if (result) {
                console.log("Ordine confermato per:", menu.name);
                setIsBought(true);
                setIsLoading(false);
            }    
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancelOrder = () => {
        console.log("Ordine annullato");
        navigation.goBack();
    };

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    if (isBought) {
        return (
            <SafeAreaView style={styles.COcontainer}>
                <View style={styles.COconfirmationContainer}>
                    <Image
                        source={require("../../assets/checkOutIcon.png")}
                        style={styles.COsuccessIcon}
                    />
                    <Text style={styles.COconfirmationTitle}>Ordine Confermato!</Text>
                    <Text style={styles.COconfirmationMessage}>
                        Grazie per il tuo ordine. Stiamo preparando il tuo menu e sarà presto consegnato!
                    </Text>
                    <TouchableOpacity
                        style={styles.COgoHomeButton}
                        onPress={() => navigation.navigate("HomeTab", { screen: "Home" })}
                    >
                        <Text style={styles.COgoHomeButtonText}>Torna alla Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.COcontainer}>
            <ScrollView contentContainerStyle={styles.COcontent}>
                <View style={styles.COcard}>
                    <Image source={{ uri: "data:image/jpeg;base64," + menu.image }} style={styles.COimage} />
                    <View style={styles.COinfoContainer}>
                        <Text style={styles.COtitle}>{menu.name}</Text>
                        <Text style={styles.COdescription}>{menu.shortDescription}</Text>
                        <View style={styles.COdetailsRow}>
                            <Text style={styles.COlabel}>Tempo di consegna:</Text>
                            <Text style={styles.COvalue}>{menu.deliveryTime} minuti</Text>
                        </View>
                        <View style={styles.COdetailsRow}>
                            <Text style={styles.COlabel}>Prezzo:</Text>
                            <Text style={styles.COvalue}>{menu.price}€</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.COdivider} />
                <View style={styles.COsummaryContainer}>
                    <Text style={styles.COsummaryTitle}>Riepilogo Ordine</Text>
                    <View style={styles.COdetailsRow}>
                        <Text style={styles.COlabel}>Totale:</Text>
                        <Text style={styles.COtotalValue}>{menu.price}€</Text>
                    </View>
                </View>
                <View style={styles.COdivider} />
                <View style={styles.CObuttonsContainer}>
                    <TouchableOpacity style={styles.COprimaryButton} onPress={handleConfirmOrder}>
                        <Text style={styles.CObuttonText}>Conferma Ordine</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.COsecondaryButton} onPress={handleCancelOrder}>
                        <Text style={styles.CObuttonText}>Annulla</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CheckOutScreen;