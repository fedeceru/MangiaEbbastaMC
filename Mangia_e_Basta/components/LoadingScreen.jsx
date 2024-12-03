import { View, Text, ActivityIndicator } from "react-native";
import { styles } from "../Styles";

const LoadingScreen = () => {
    return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Caricamento...</Text>
          <ActivityIndicator size={50} color="#3498DB" />
        </View>
    )
}

export default LoadingScreen;