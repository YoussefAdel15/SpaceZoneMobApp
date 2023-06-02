import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProfilePage = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [isUpdateInfoVisible, setUpdateInfoVisible] = useState(false);
  const [isDeleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [isVerifyPhoneVisible, setVerifyPhoneVisible] = useState(false);
  const [isPhoneCallSelected, setPhoneCallSelected] = useState(false);
  const [isSMSSelected, setSMSSelected] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationCodeInputs, setShowVerificationCodeInputs] =
    useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = await retrieveData("token");
    try {
      const response = await axios.get(
        "https://spacezone-backend.cyclic.app/api/user/me2",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const currentUser = response.data.currentUser;
      setPhoneNumber(currentUser.number);
    } catch (error) {
      console.log(error);
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

  const handleChangePassword = () => {
    // Perform validation and submit password change request to the server
    if (newPassword !== confirmPassword) {
      console.log("New password and confirm password do not match");
      return;
    }

    console.log("Password change request submitted");
    // Make API request to change the password using the password and newPassword
  };

  const handleUpdatePersonalInfo = () => {
    // Update user's personal information
    // Make API request to update the user's personal information using the name and email
  };

  const handleDeleteAccount = () => {
    // Perform necessary actions to delete the user's account
    console.log("Account deletion request submitted");
  };

  const handleVerifyPhone = async () => {
    const token = await retrieveData("token");
    // Perform verification based on the selected option (phone call or SMS)
    if (isPhoneCallSelected) {
      console.log("Sending verification code via phone call");
      axios.post(
        "https://spacezone-backend.cyclic.app/api/user/phone/send-otp",
        {
          phoneNumber: phoneNumber,
          method: "call",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Make API request to send verification code via phone call
    } else if (isSMSSelected) {
      axios.post(
        "https://spacezone-backend.cyclic.app/api/user/phone/send-otp",
        {
          phoneNumber: phoneNumber,
          method: "sms",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Sending verification code via SMS");
      // Make API request to send verification code via SMS
    }

    // Show the verification code inputs
    setShowVerificationCodeInputs(true);
  };

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require("../assets/Background.png")}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setChangePasswordVisible(!isChangePasswordVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Change Password</Text>
            <Entypo name="lock" size={24} color="black" />
          </TouchableOpacity>
          {isChangePasswordVisible && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <Button title="Change Password" onPress={handleChangePassword} />
            </>
          )}

          <TouchableOpacity
            onPress={() => setUpdateInfoVisible(!isUpdateInfoVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Update Personal Information</Text>
            <AntDesign name="user" size={24} color="black" />
          </TouchableOpacity>
          {isUpdateInfoVisible && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <Button
                title="Update Personal Info"
                onPress={handleUpdatePersonalInfo}
              />
            </>
          )}

          <TouchableOpacity
            onPress={() => setDeleteAccountVisible(!isDeleteAccountVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Delete My Account</Text>
            <AntDesign name="deleteuser" size={24} color="black" />
          </TouchableOpacity>
          {isDeleteAccountVisible && (
            <>
              <Text style={styles.confirmationText}>
                Are you sure you want to delete your account? This action is
                irreversible.
              </Text>
              <Button title="Delete Account" onPress={handleDeleteAccount} />
            </>
          )}

          <TouchableOpacity
            onPress={() => setVerifyPhoneVisible(!isVerifyPhoneVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Verify Phone Number</Text>
            <FontAwesome5 name="phone" size={24} color="black" />
          </TouchableOpacity>
          {isVerifyPhoneVisible && (
            <>
              <Text style={styles.confirmationText}>
                We Will Send You A Verification Code To Your Phone Number{" "}
                {phoneNumber} To Verify Your Account And To Be Able To Book A
                Room In Our App Please Select The Way You Want To Receive The
                Code :
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setPhoneCallSelected(true);
                  setSMSSelected(false);
                }}
                style={[
                  styles.optionButton,
                  isPhoneCallSelected && styles.selectedOptionButton,
                ]}
              >
                <Text style={styles.optionButtonText}>Phone Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPhoneCallSelected(false);
                  setSMSSelected(true);
                }}
                style={[
                  styles.optionButton,
                  isSMSSelected && styles.selectedOptionButton,
                ]}
              >
                <Text style={styles.optionButtonText}>SMS</Text>
              </TouchableOpacity>
              <Button
                title="Send Verification Code"
                onPress={handleVerifyPhone}
              />

              {showVerificationCodeInputs && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                  />
                  <Button
                    title="Verify Phone Number"
                    onPress={() => {
                      // Perform verification code validation and submit request to the server
                      console.log("Verification code submitted");
                    }}
                  />
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
  },
  confirmationText: {
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    marginBottom: 10,
  },
  selectedOptionButton: {
    backgroundColor: "gray",
  },
  optionButtonText: {
    fontSize: 16,
  },
});

export default ProfilePage;
