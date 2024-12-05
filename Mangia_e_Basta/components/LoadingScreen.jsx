import { ActivityIndicator, Image, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadingScreen = () => {
  return (
    <SafeAreaView style={localStyles.container}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/8095/8095039.png' }} 
        style={localStyles.icon} 
      />
      <ActivityIndicator 
        size="large" 
        color="#003366" 
        accessibilityLabel="Caricamento in corso" 
        style={localStyles.loader} 
      />
      <Text style={localStyles.text}>Caricamento...</Text>
    </SafeAreaView>
  );
};

export default LoadingScreen;

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7', 
    padding: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 30, 
  },
  loader: {
    marginBottom: 20, 
  },
  text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#003366', 
  },
});
