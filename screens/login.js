import axios from "axios";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
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
        alert(
          `Login Successful Welcome ${response.data.data.user.userName} with token ${token}`
        );
        // console.log("Token:", retrieveData("token"));
        console.log("Token:", token);
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
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
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
