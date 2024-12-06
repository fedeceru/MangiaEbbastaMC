import React from 'react';
import { SafeAreaView, Text, Image } from 'react-native';
import { styles } from '../../Styles';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.splashContainer}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/128/8095/8095039.png' }} 
        style={styles.splashIcon} 
      />
      <Text style={styles.splashTitle}>MANGIA E BASTA</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;
