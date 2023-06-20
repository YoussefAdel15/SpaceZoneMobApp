import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Linking } from "react-native";

const PayVoucherScreen = () => {
  const [voucherCode, setVoucherCode] = useState(0);

  const handlePay = async () => {
    const voucherValue = parseFloat(voucherCode);
    if (isNaN(voucherValue) || voucherValue <= 0) {
      Alert.alert(
        "Error",
        "Voucher value is not valid. Please enter a value greater than 0."
      );
      return;
    } else {
      const response = await axios.post(
        "https://spacezone-backend.cyclic.app/api/voucher/payVoucher",
        {
          voucherValue: voucherValue,
        }
      );
      if (response.data.status === "Success") {
        await Linking.openURL(response.data.url);
      } else {
        Alert.alert("Error", "Voucher Code is not valid");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay Voucher Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter voucher Value You Want To Pay"
        value={voucherCode}
        onChangeText={setVoucherCode}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handlePay}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  button: {
    width: "50%",
    height: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
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
});

export default PayVoucherScreen;
