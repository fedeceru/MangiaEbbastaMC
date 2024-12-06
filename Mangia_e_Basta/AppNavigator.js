import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "./components/homecomponents/HomeScreen";
import ProfileScreen from "./components/profilecomponents/ProfileScreen";
import MenuDetailsScreen from "./components/homecomponents/MenuDetailsScreen";
import EditProfileScreen from "./components/profilecomponents/EditProfileScreen";
import OrderStatusScreen from "./components/ordercomponents/OrderStatusScreen";
import DeliveryStatusScreen from "./components/profilecomponents/DeliveryStatusScreen";
import { KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="MenuDetails" component={MenuDetailsScreen} />
        </Stack.Navigator>
    );
};

const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="DeliveryStatus" component={DeliveryStatusScreen} />
        </Stack.Navigator>
    );
};

const OrderStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="OrderStatus" component={OrderStatusScreen} />
        </Stack.Navigator>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "HomeTab") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "ProfileTab") {
                        iconName = focused ? "person" : "person-outline";
                    } else if (route.name === "OrderTab") {
                        iconName = focused ? "cart" : "cart-outline";
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#2C3E50",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeStack} />
            <Tab.Screen name="ProfileTab" component={ProfileStack} />
            <Tab.Screen name="OrderTab" component={OrderStack} />
        </Tab.Navigator>
    );
};

export const MyAppNavigator = () => {
    return (
        <NavigationContainer>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar />
                <TabNavigator />
            </SafeAreaView>
        </NavigationContainer>
    );
};
