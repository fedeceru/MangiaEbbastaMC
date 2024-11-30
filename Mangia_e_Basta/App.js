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
  const [LocationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  
  const initializeApp = async () => {
    try {
      console.log('Checking if user is already logged in');
      const isFirstRun = await AppViewModel.checkFirstRun();
      setIsFirstRun(isFirstRun);
      const response = await AppViewModel.checkPermission();
      setLocationPermission(response);
    } catch (error) {
      console.log('Error initializing app:', error);
    }
  }

  const handleLocationPermission = (response) => {
    setLocationPermission(response);
  }

  if (isFirstRun === null || LocationPermission === null) {
    return (
      <SplashScreen />
    );
  }
  
  if (!LocationPermission) {
    return (
      <LocationScreen handleLocationPermission={handleLocationPermission}/>
    );
  }

  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}





/*
oggetto relativo allo stato di navigazione
const state = {
  type: 'stack',
  key: 'stack-1',
  routeNames: ['Home', 'Profile', 'Settings'],
  routes: [
    { key: 'home-1', name: 'Home', params: { sortBy: 'latest' } },
    { key: 'settings-1', name: 'Settings' },
  ],
  index: 1,
  stale: false,
};
*/ 


