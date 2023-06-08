import React, { useState } from "react";
import {
  SafeAreaView,
  Keyboard,
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
  const [errors, setErrors] = React.useState({});
  const [fontLoaded, setFontLoaded] = useState(false);
  const [number, setNumber] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSignUp = async () => {
    Keyboard.dismiss();
    let isValid = true;
  
    if (!userName) {
      handleError("Please enter your username", "userName");
      isValid = false;
    }
  
    if (!email) {
      handleError("Please enter email", "email");
      isValid = false;
    } else if (!email.match(/\S+@\S+\.\S+/)) {
      handleError("Please enter a valid email", "email");
      isValid = false;
    }
  
    if (!password) {
      handleError("Please enter password", "password");
      isValid = false;
    } else if (password.length < 5) {
      handleError("Min password length of 5", "password");
      isValid = false;
    }
  
    if (!passwordConfirmation) {
      handleError("Please enter your password confirmation", "passwordConfirmation");
      isValid = false;
    } else if (passwordConfirmation.length < 5) {
      handleError("Min password length of 5", "passwordConfirmation");
      isValid = false;
    }
  
    if (!number) {
      handleError("Please enter phone number", "number");
      isValid = false;
    }
  
    if (isValid) {
      setLoading(true);
      try {
        let data = await axios.post("https://spacezone-backend.cyclic.app/api/user/signupUser", {
          userName: userName,
          password: password,
          email: email,
          number: number,
          passwordConfirmation: passwordConfirmation,
        });
  
        console.log(data);
        alert("Account created successfully. Now you can login");
        navigation.navigate("Login");
      } catch (error) {
        console.log(error);
        alert("Error creating account. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  
  

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
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
              Create an account so you can explore all the Working Spaces
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 3,
            }}
          >
            <AppTextInput
              value={userName}
              onChangeText={setUserName}
              onFocus={() => handleError(null, userName)}
              iconName="account-outline"
              label="Username"
              placeholder="Enter your Username"
              error={errors.userName}
              userName
            />
            <AppTextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => handleError(null, email)}
              iconName="email-outline"
              label="Email"
              placeholder="Enter your email address"
              error={errors.email}
            />
            <AppTextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => handleError(null, password)}
              iconName="onepassword"
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
              password
            />
            <AppTextInput
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              onFocus={() => handleError(null, passwordConfirmation)}
              iconName="lock-outline"
              label="Confirm Password"
              placeholder="Enter your password again"
              error={errors.passwordConfirmation}
              passwordConfirmation
            />
            <AppTextInput
              keyboardType="numeric"
              value={number}
              onChangeText={setNumber}
              onFocus={() => handleError(null, number)}
              iconName="phone-outline"
              label="Phone Number"
              placeholder="Enter your phone number"
              error={errors.number}
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
