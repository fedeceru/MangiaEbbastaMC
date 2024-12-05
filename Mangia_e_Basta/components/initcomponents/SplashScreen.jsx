import React from 'react';
import { SafeAreaView, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <SafeAreaView style={localStyles.splashContainer}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/8095/8095039.png' }} 
        style={localStyles.splashIcon} 
      />
      <Text style={localStyles.title}>MANGIA E BASTA</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;

const localStyles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF', 
  },
  splashIcon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333', 
    marginBottom: 20,
  },
});
