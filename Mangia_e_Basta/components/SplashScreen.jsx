import { SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { styles } from '../Styles';

const SplashScreen = () => { 
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Caricamento...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </SafeAreaView>
  );
};

export default SplashScreen;