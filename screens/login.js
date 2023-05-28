import axios from "axios";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import AppTextInput from "../components/AppTextInput";
import Spinner from "react-native-loading-spinner-overlay";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleLogin = async () => {
    setLoading(true);
    // Perform login logic here
    let data = await axios
      .post("https://spacezone-backend.cyclic.app/api/user/loginUser", {
        email: email,
        password: password,
      })
      .then(async (response) => {
        console.log(response.data.data.user.userName);
        await storeData("token", response.data.token);
        const token = await retrieveData("token");
        // alert(
        //   `Login Successful Welcome ${response.data.data.user.userName} with token ${token}`
        // );
        await user();
        navigation.navigate("Home");
        // console.log("Token:", retrieveData("token"));
        console.log("Token:", token);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const user = async () => {
    const token = await retrieveData("token");
    let data = await axios
      .get(`https://spacezone-backend.cyclic.app/api/user/me2`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (response) => {
        console.log(response.data.currentUser);
        await storeData("userName", response.data.currentUser.userName);
        await storeData("userEmail", response.data.currentUser.email);
        await storeData("userID", response.data.currentUser._id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log("Data stored successfully");
    } catch (error) {
      console.log("Error storing data:", error);
    }
  };

  const retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log("Retrieved data:", value);
        return value; // Return the value
      } else {
        console.log("No data found");
        return null; // Return null if no data found
      }
    } catch (error) {
      console.log("Error retrieving data:", error);
      return null; // Return null in case of an error
    }
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View
          style={{
            padding: Spacing * 2,
            marginTop: Spacing * 10,
          }}
        >
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: FontSize.xLarge,
                color: Colors.primary,
                marginVertical: Spacing * 3,
              }}
            >
              Login here
            </Text>
            <Text
              style={{
                fontSize: FontSize.large,
                maxWidth: "60%",
                textAlign: "center",
              }}
            >
              Welcome back you've been missed!
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 3,
            }}
          >
            <AppTextInput
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
            />
            <AppTextInput
              placeholder="Password"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: FontSize.small,
                color: Colors.primary,
                alignSelf: "flex-end",
              }}
            >
              Forgot your password ?
            </Text>
          </View>

          <TouchableOpacity
            style={{
              padding: Spacing * 2,
              backgroundColor: Colors.primary,
              marginVertical: Spacing * 3,
              borderRadius: Spacing,
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
            onPress={() => handleLogin()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.onPrimary} /> // Show loading indicator while loading is true
            ) : (
              <Text
                style={{
                  color: Colors.onPrimary,
                  textAlign: "center",
                  fontSize: FontSize.large,
                }}
              >
                Sign in
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSignUp()}
            style={{
              padding: Spacing,
            }}
          >
            <Text
              style={{
                color: Colors.text,
                textAlign: "center",
                fontSize: FontSize.small,
              }}
            >
              Create new account
            </Text>
          </TouchableOpacity>

          <View
            style={{
              marginVertical: Spacing * 3,
            }}
          ></View>
          {/*
          this is the spinner that will show when loading is true
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={{ color: Colors.primary }}
          overlayColor={Colors.overlay}
        /> */}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
