import { ActivityIndicator, Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../Styles";

const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/8095/8095039.png' }} 
        style={styles.loadingIcon} 
      />
      <ActivityIndicator 
        size="large" 
        color="#003366" 
        accessibilityLabel="Caricamento in corso" 
        style={styles.loadingLoader} 
      />
      <Text style={styles.loadingText}>Caricamento...</Text>
    </SafeAreaView>
  );
};

export default LoadingScreen;
