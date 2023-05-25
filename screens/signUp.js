import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

const SignUpScreen = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSignUp = async () => {
    // Perform sign-up logic here
    console.log("Username:", userName);
    console.log("Password:", password);
    console.log("Email:", email);
    console.log("Number:", number);
    let data = await axios
      .post("https://spacezone-backend.cyclic.app/api/user/signupUser", {
        userName: userName,
        password: password,
        email: email,
        number: number,
        passwordConfirmation: passwordConfirmation,
      })
      .then((response) => {
        console.log(response.data);
        alert(`Sign Up Successful`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUserName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="PasswordConfirmation"
        secureTextEntry
        onChangeText={(text) => setPasswordConfirmation(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Number"
        keyboardType="numeric"
        onChangeText={(text) => setNumber(text)}
      />
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

export default SignUpScreen;
