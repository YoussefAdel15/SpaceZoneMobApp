import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome } from "react-native-vector-icons";

const SilentBookingScreen = ({ route, navigation }) => {
  const { place } = route.params;
  const [date, setDate] = useState();
  const endDate =
    place.silentSeats[0].days[place.silentSeats[0].days.length - 1].date.split(
      "T"
    )[0];
  const [openHours, setOpenHours] = useState([]);
  const [selectedStartHour, setSelectedStartHour] = useState(null);
  const [selectedEndHour, setSelectedEndHour] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);
  const [openHours2, setOpenHours2] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);


  useEffect(() => {
    if (date) {
      const formattedDate = date.replace(/\//g, "-"); // Replaces "/" with "-" to convert the format
      const selectedDate = new Date(formattedDate);
      const getOpeningHours = async () => {
        try {
          const response = await axios.post(
            `https://spacezone-backend.cyclic.app/api/booking/getOpenHours/${placeId}`,
            { Date: selectedDate }
          );
          if (response.data.status === "success")
            setOpenHours(response.data.openHoursArray);
          else alert("No open hours for this date");
        } catch (error) {
          console.log(error);
        }
      };

      getOpeningHours();

      if (openHours && openHours.length !== 0) {
        setOpenHours(openHours);
        setSelectedStartHour(null);
        setSelectedEndHour(null);
        setStartHour(null);
        setEndHour(null);
      }
    }
  }, [date]);

  const handleBooking = async () => {
    const token = await retrieveData("token");
    // startTime , date , endTime , paymentMethod / /:pid/:rid / auth
    const formattedDate = date.replace(/\//g, "-"); // Replaces "/" with "-" to convert the format
    const selectedDate = new Date(formattedDate);
    const data = {
      Date: selectedDate,
      startTime: startHour,
      endTime: endHour,
      paymentMethod: paymentMethod,
    };
    if (date && selectedEndHour && selectedStartHour && setPaymentMethod) {
      // Perform booking logic
      await axios
        .post(
          `https://spacezone-backend.cyclic.app/api/booking/bookRoom/${placeId}/${roomId}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.status === "success") {
            navigation.navigate("Home");
            Alert.alert(
              "Booking Successful",
              "Your booking has been confirmed you can check your Booking History."
            );
          } else {
            alert("there is a problem with your booking please try again");
          }
        })
        .catch((error) => {
          console.log(error);
          alert(`Booking Failed`);
        });
    } else {
      Alert.alert("Missing Information", "Please fill in all the fields.");
    }
  };

  useEffect(() => {
    if (selectedStartHour) {
      const startHourIndex = openHours.indexOf(selectedStartHour);
      const openHours2 = openHours.slice(startHourIndex + 1);
      setOpenHours2(openHours2);
      // console.log("Selected Start Hour:", startHour);
    }
  }, [selectedStartHour]);

  const handleHourPress = (hour) => {
    if (hour === selectedStartHour) {
      // If the selected hour is already the start hour, deselect it
      setSelectedStartHour(null);
      setStartHour(null);
    } else {
      // Select the new hour and deselect any previous selection
      setSelectedStartHour(hour);
      setStartHour(hour);
      setSelectedEndHour(null);
      setEndHour(null);
    }
  };
  const handleHourPress2 = (hour) => {
    if (hour === selectedEndHour) {
      // If the selected hour is already the start hour, deselect it
      setSelectedEndHour(null);
      setEndHour(null);
    } else {
      // Select the new hour and deselect any previous selection
      setSelectedEndHour(hour);
      setEndHour(hour);
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
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Book a Room</Text>
        <Text style={{ marginBottom: 10 }}>
          Selected Date is <Text style={{ fontWeight: "bold" }}>{date}</Text>
        </Text>
        <DatePicker
          onSelectedChange={(value) => setDate(value)}
          options={{
            backgroundColor: "rgba(173,203,227 ,0.5)",
            textHeaderColor: "#030303",
            textDefaultColor: "#0d0900",
            selectedTextColor: "#fff",
            mainColor: "#4b86b4",
            textSecondaryColor: "#141414",
            borderColor: "rgba(42,77,105,0.5)",
          }}
          current="2023-06-01"
          mode="calendar"
          minimumDate={new Date().toISOString().split("T")[0]}
          maximumDate={endDate}
          minuteInterval={30}
          style={{ borderRadius: 20, marginBottom: 10 }}
        />
        {/* List of selectable hours */}
        {openHours && openHours.length > 0 ? (
          <>
            <Text style={styles.subtitle}>Select Start Hour</Text>
            <View style={styles.hoursContainer}>
              {openHours.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.hourCard,
                    hour === selectedStartHour ? styles.selectedHourCard : null,
                  ]}
                  onPress={() => handleHourPress(hour)}
                >
                  <Text>{hour}:00</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <Text>Loading open hours...</Text>
        )}
        {openHours && openHours.length > 0 && selectedStartHour !== null ? (
          <>
            <Text style={styles.subtitle}>Select End Hour</Text>
            <View style={styles.hoursContainer}>
              {openHours2.map((hour) => (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.hourCard,
                    hour === selectedEndHour ? styles.selectedHourCard : null,
                  ]}
                  onPress={() => handleHourPress2(hour)}
                >
                  <Text>{hour}:00</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <Text style={{ marginBottom: 10, marginTop: 10 }}>
            Choose Start Hour To Be Able To Select End Hour
          </Text>
        )}
        {selectedStartHour && selectedEndHour ? (
          <View>
            <Text style={styles.subtitle}>Booking Details:</Text>
            <Text style={{ marginBottom: 10, marginTop: 10, fontSize: 18 }}>
              <Text style={{ paddingRight: 1 }}>You have selected </Text>
              <Text style={styles.subtitle}>
                {selectedStartHour}:00 to {selectedEndHour}:00 on {date}
              </Text>{" "}
              on Room Name:{" "}
              <Text style={styles.subtitle}>
                {roomDetails.roomType} {roomDetails.roomNumber}
              </Text>
            </Text>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.subtitle}>
                Total Payments :{" "}
                {roomDetails.price * (selectedEndHour - selectedStartHour)} L.E
              </Text>
            </View>
          </View>
        ) : null}

        {selectedStartHour && selectedEndHour ? (
          <View style={styles.paymentContainer}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "Cash" ? styles.selectedPaymentOption : null,
              ]}
              onPress={() => setPaymentMethod("Cash")}
            >
              <FontAwesome name="money" size={24} color="#4b86b4" />
              <Text style={styles.paymentText}>Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "Credit Card"
                  ? styles.selectedPaymentOption
                  : null,
              ]}
              onPress={() => setPaymentMethod("Credit Card")}
            >
              <FontAwesome name="credit-card" size={24} color="#4b86b4" />
              <Text style={styles.paymentText}>Credit Card</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {selectedStartHour && selectedEndHour ? (
          <TouchableOpacity
            style={{
              width: "90%",
              backgroundColor: "#4b86b4",
              padding: 10,
              borderRadius: 25,
              marginTop: 10,
              marginLeft: 15,
            }}
            onPress={handleBooking}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Book</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#4b86b4",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#4b86b4",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  hoursContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  hourCard: {
    width: "30%",
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    marginRight: 8,
    flexDirection: "row",
  },
  selectedHourCard: {
    backgroundColor: "rgba(173,203,227 , 0.5)",
  },
  paymentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  paymentOption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
    justifyContent: "center",
  },
  selectedPaymentOption: {
    backgroundColor: "lightblue",
  },
  paymentText: {
    marginLeft: 8,
  },
});

export default SilentBookingScreen;
