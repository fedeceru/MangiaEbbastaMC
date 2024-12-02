import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import HomeScreen from "./components/homecomponents/HomeScreen";
import ProfileScreen from "./components/profilecomponents/ProfileScreen";
import MenuDetailsScreen from "./components/homecomponents/MenuDetailsScreen";
import EditProfileScreen from "./components/profilecomponents/EditProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MenuDetails" component={MenuDetailsScreen} />
        </Stack.Navigator>
    );
};

const ProfileStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
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
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#2C3E50",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeStack} />
            <Tab.Screen name="ProfileTab" component={ProfileStack} />
        </Tab.Navigator>
    );
};

export const MyAppNavigator = () => {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
};
