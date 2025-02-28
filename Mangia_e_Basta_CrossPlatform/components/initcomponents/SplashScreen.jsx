import React from 'react';
import { SafeAreaView, Text, Image } from 'react-native';
import { styles } from '../../Styles';

const SplashScreen = () => {
  return (
    <SafeAreaView style={styles.splashContainer}>
      <Image 
        source={require("../../assets/splashDroneIcon.png")} 
        style={styles.splashIcon} 
      />
      <Text style={styles.splashTitle}>MANGIA E BASTA</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;
