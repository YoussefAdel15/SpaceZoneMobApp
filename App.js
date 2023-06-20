import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ViewPropTypes } from "deprecated-react-native-prop-types";

import LoginScreen from "./screens/login";
import SignUpScreen from "./screens/signUp";
import WelcomeScreen from "./screens/welcome";
import HomeScreen from "./screens/Home";
import SurfScreen from "./screens/surf";
import ProfileScreen from "./screens/profile";
import PlaceDetailsScreen from "./screens/placeDetails";
import RoomDetailsScreen from "./screens/roomDetails";
import ProfileEditScreen from "./screens/profileEdit";
import RoomBookingScreen from "./screens/roomBooking";
import BookingHistoryScreen from "./screens/bookingHistory";
import BookingDetailsScreen from "./screens/bookDetails";
import SharedArea from "./screens/sharedArea";
import SharedBooking from "./screens/sharedBooking";
import SilentRoom from "./screens/silentRoom";
import SilentBooking from "./screens/silentBooking";
import Voucher from "./screens/voucher";
import PayVoucherScreen from "./screens/payVoucher";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Token found, navigate to Home screen
        navigation.replace("Home");
      } else {
        // Token not found, navigate to Welcome screen or other initial screen
        navigation.replace("Welcome");
      }
    } catch (error) {
      // Handle AsyncStorage error
      console.log("AsyncStorage error:", error);
      // Navigate to Welcome screen or other initial screen
      navigation.replace("Welcome");
    }
  };

  return null;
};

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Surf"
        component={SurfScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "albums" : "albums-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AuthLoading"
          component={AuthLoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PlaceDetails"
          component={PlaceDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomDetails"
          component={RoomDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileEdit"
          component={ProfileEditScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomBooking"
          component={RoomBookingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookingHistory"
          component={BookingHistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookingDetails"
          component={BookingDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SharedArea"
          component={SharedArea}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SharedBooking"
          component={SharedBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SilentRoom"
          component={SilentRoom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SilentBooking"
          component={SilentBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Voucher"
          component={Voucher}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PayVoucher"
          component={PayVoucherScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
