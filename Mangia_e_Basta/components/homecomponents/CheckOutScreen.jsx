import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import AppViewModel from "../../viewmodel/AppViewModel";
import { styles } from "../../Styles";
import LoadingScreen from "../LoadingScreen";
//faccio una schermata dedicata per il checkout e un'altra per la conferma dell'ordine in modo da poterne salvare lo stato e poterlo ripristinare in un secondo avvio

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
            }    
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
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

    if (isBought === true) {
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
              <View style={styles.CObuttonsContainer}>
                <TouchableOpacity
                  style={styles.COgoHomeButton}
                  onPress={() => navigation.navigate("Home", { screen: "HomePage" })}
                >
                  <Text style={styles.CObuttonText}>Torna alla Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.COgoStatusButton}
                  onPress={() => navigation.navigate("Ordine")}
                >
                  <Text style={styles.CObuttonText}>Stato dell'ordine</Text>
                </TouchableOpacity>
              </View>
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