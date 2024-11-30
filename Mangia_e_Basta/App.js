import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LocationScreen from './components/LocationScreen';
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import AppViewModel from './viewmodel/AppViewModel';

const Stack = createNativeStackNavigator(); 

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  )
}

export default function App() {
  const [isFirstRun, setIsFirstRun] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [accessCounter, setAccessCounter] = useState(0);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const firstRun = await AppViewModel.checkFirstRun();
      setIsFirstRun(firstRun);
      if (firstRun === false) {
        const location = await AppViewModel.getCurrentPosition();
        console.log('Location:', location);
        setLocationPermission(location ? true : false);
      }
    } catch (error) {
      console.log('Error initializing app:', error);
    }
  }

  const handleLocationPermission = (response) => {
    if (response === false) {
      setAccessCounter(accessCounter + 1);
      setLocationPermission(false);
    } else {
      setLocationPermission(true);
    }
  }
  
  if (isFirstRun === false && locationPermission === false) {
    return (
      <LocationScreen handleLocationPermission={handleLocationPermission} accessCounter={accessCounter} />
    );
  }

  if (isFirstRun === false && locationPermission === true) {
    return (
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    );
  }

  return (
    <SplashScreen />
  );
}