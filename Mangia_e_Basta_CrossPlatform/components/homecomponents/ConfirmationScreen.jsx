import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "../../Styles";
import { StackActions } from "@react-navigation/native";

const ConfirmationScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.COcontainer}>
            <View style={styles.COconfirmationContainer}>
                <Image
                    source={require("../../assets/checkOutIcon.png")}
                    style={styles.COsuccessIcon}
                />
                <Text style={styles.COconfirmationTitle}>Ordine Confermato!</Text>
                <Text style={styles.COconfirmationMessage}>
                    Grazie per il tuo ordine. Stiamo preparando il tuo menù e sarà presto consegnato!
                </Text>
                <View style={styles.CObuttonsContainer}>
                    <TouchableOpacity
                      style={styles.COgoHomeButton}
                      onPress={() => navigation.navigate("Home", { screen: "HomePage" })}
                    >
                        <Text style={styles.CObuttonText}>Torna alla Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.COgoStatusButton}
                        onPress={() => {
                            navigation.dispatch(
                                StackActions.replace("HomePage")
                            );
                            navigation.navigate("Ordine")
                        }} 
                    >
                        <Text style={styles.CObuttonText}>Stato dell'ordine</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default ConfirmationScreen;