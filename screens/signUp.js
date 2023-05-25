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
import axios from "axios";
import AppTextInput from "../components/AppTextInput";

const SignUpScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSignUp = async () => {
    setLoading(true);
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
      })
      .finally(() => setLoading(false));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View
          style={{
            padding: Spacing * 2,
            marginTop: Spacing * 1,
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
                // fontFamily: Font["poppins-bold"],
                marginVertical: Spacing * 3,
              }}
            >
              Create account
            </Text>
            <Text
              style={{
                fontSize: FontSize.small,
                maxWidth: "80%",
                textAlign: "center",
              }}
            >
              Create an account so you can explore all the existing jobs
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 3,
            }}
          >
            <AppTextInput
              placeholder="Username"
              onChangeText={(text) => setUserName(text)}
            />
            <AppTextInput
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
            />
            <AppTextInput
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
            />
            <AppTextInput
              placeholder="Confirm Password"
              onChangeText={(text) => setPasswordConfirmation(text)}
            />
            <AppTextInput
              placeholder="Phone Number"
              onChangeText={(text) => setNumber(text)}
            />
          </View>

          <TouchableOpacity
            style={{
              padding: Spacing * 2,
              backgroundColor: Colors.primary,
              marginVertical: Spacing,
              borderRadius: Spacing,
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}
            onPress={() => {
              handleSignUp();
            }}
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
                Sign Up
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
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
              Already have an account
            </Text>
          </TouchableOpacity>
          <View
            style={{
              marginVertical: Spacing * 3,
            }}
          ></View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignUpScreen;
