import { useEffect, useRef, useState } from 'react';
import AppViewModel from './viewmodel/AppViewModel';
import SplashScreen from './components/initcomponents/SplashScreen';
import LocationScreen from './components/initcomponents/LocationScreen';
import { MyAppNavigator } from './AppNavigator';

export default function App() {
  const [isFirstRun, setIsFirstRun] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [accessCounter, setAccessCounter] = useState(0);
  const [reloadApp, setReloadApp] = useState(false);

  useEffect(() => {
    initializeApp();
  }, [reloadApp]);

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
    if (response === true) {
      setLocationPermission(true);
      //ricarico l'app per far si che venga calcolata la posizione, solo quando ho i permessi
      setReloadApp(true);
    } else {
      setAccessCounter(accessCounter + 1);
      setLocationPermission(false);
    } 
  }
  
  if (isFirstRun === false && locationPermission === false) {
    return (
      <LocationScreen handleLocationPermission={handleLocationPermission} accessCounter={accessCounter} />
    );
  }

  if (isFirstRun === false && locationPermission === true) {
    return (
      <MyAppNavigator />
    );
  }

  return (
    <SplashScreen />
  );
}