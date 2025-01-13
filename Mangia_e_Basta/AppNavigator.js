import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "./components/homecomponents/HomeScreen";
import ProfileScreen from "./components/profilecomponents/ProfileScreen";
import MenuDetailsScreen from "./components/homecomponents/MenuDetailsScreen";
import EditProfileScreen from "./components/profilecomponents/EditProfileScreen";
import OrderStatusScreen from "./components/ordercomponents/OrderStatusScreen";
import CheckOutScreen from "./components/homecomponents/CheckOutScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "./components/initcomponents/SplashScreen";
import ConfirmationScreen from "./components/homecomponents/ConfirmationScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomePage" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="MenuDetails" component={MenuDetailsScreen} />
            <Stack.Screen name="CheckOut" component={CheckOutScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
            <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
        </Stack.Navigator>
    );
};

const OrderStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="OrderStatus" component={OrderStatusScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Profilo") {
                        iconName = focused ? "person" : "person-outline";
                    } else if (route.name === "Ordine") {
                        iconName = focused ? "cart" : "cart-outline";
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#2C3E50",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Profilo" component={ProfileStack} />
            <Tab.Screen name="Ordine" component={OrderStack} />
        </Tab.Navigator>
    );
};

export const MyAppNavigator = () => {
    const [initNavigationState, setInitNavigationState] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const loadNavigationState = async () => {
            try {
                const savedState = await AsyncStorage.getItem("navigationState");
                if (savedState) {
                    setInitNavigationState(JSON.parse(savedState));
                }
            } catch (error) {
                console.log("Error during the loading of the navigation state: ", error);
            } finally {
                setIsReady(true);
            }
        }

        loadNavigationState();
    }, []);

    const saveNavigationState = async (state) => {
        try {
            const stateString = JSON.stringify(state);
            await AsyncStorage.setItem("navigationState", stateString);
        } catch (error) {
            console.log("Error during the saving of the navigation state: ", error);
        }
    };

    if (!isReady) {
        return (
            <SplashScreen />
        )
    }

    return (
        <NavigationContainer initialState={initNavigationState} onStateChange={saveNavigationState}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar />
                <TabNavigator />
            </SafeAreaView>
        </NavigationContainer>
    );
};
