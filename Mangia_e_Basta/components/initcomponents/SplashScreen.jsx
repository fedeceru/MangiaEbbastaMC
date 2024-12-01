import { SafeAreaView, Text, ActivityIndicator, StyleSheet } from 'react-native';

const SplashScreen = () => { 
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Caricamento...</Text>
      <ActivityIndicator 
        size="large" 
        color={styles.loader.color} 
        accessibilityLabel="Caricamento in corso"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', 
  },
  loader: {
    color: '#0000ff', 
  },
});

export default SplashScreen;
