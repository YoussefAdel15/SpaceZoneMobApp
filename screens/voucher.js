import axios from "axios";
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VoucherPage = () => {
  const [voucherCode, setVoucherCode] = useState("");

  const handleVoucherSubmit = async() => {
    const token = await retrieveData("token");
    // Here, you can implement the logic to validate and process the voucher code
    const response = await axios.post("https://spacezone-backend.cyclic.app/api/voucher/consumeVoucher", {
      voucherCode: voucherCode,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
    );
    if (response.data.status === "Success") {
      Alert.alert("Success", "Voucher code is valid and its Value has been added to your wallet!");
    } else {
      Alert.alert("Error", "Invalid voucher code. Please try again.");
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
  return (
    <View style={styles.container}>
        <Image
          source={require("./../assets/money-rain-money-money-money.gif")}
          style={styles.gif}
        />
        {/* Rest of the code */}

      <TextInput
        style={styles.input}
        placeholder="Enter voucher code"
        onChangeText={(text) => setVoucherCode(text)}
        value={voucherCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleVoucherSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 25,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    width: "50%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  gif: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default VoucherPage;
