import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

const ProfilePage = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [isUpdateInfoVisible, setUpdateInfoVisible] = useState(false);
  const [isDeleteAccountVisible, setDeleteAccountVisible] = useState(false);

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

  return (
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
        <Ionicons name="person" size={24} color="black" />
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
        <AntDesign name="delete" size={24} color="black" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default ProfilePage;
