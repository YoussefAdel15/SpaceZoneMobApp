import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import Colors from "../constants/colors";

const BookingCard = ({ booking }) => {
  return (
    <TouchableOpacity>
      <View style={styles.itemContainer}>
        <Text>Booking ID: {booking._id}</Text>
        <Text>Place Name: {booking.placeName}</Text>
        <Text>Room Name: {booking.roomName}</Text>
        <Text>Booking Date: {booking.bookingDate}</Text>
        <Text>
          Start Time: {booking.startTime} {booking.startTime > 12 ? "PM" : "AM"}
        </Text>
        <Text>
          End Time: {booking.endTime} {booking.endTime > 12 ? "PM" : "AM"}
        </Text>
        <Text>Booking Status: {booking.bookingStatus}</Text>
        <Text>Booking Price: {booking.priceToPay} L.E</Text>
      </View>
    </TouchableOpacity>
  );
};

const BookingHistoryScreen = ({ route, navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookingHistory();
  }, []);

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

  const fetchBookingHistory = async () => {
    setLoading(true);
    const token = await retrieveData("token");
    await axios.get("https://spacezone-backend.cyclic.app/api/user/getMyBookings", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      setBookings(response.data.bookings);
    });
    setLoading(false);
  };

  const renderItem = ({ item }) => <BookingCard booking={item} />;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booking History</Text>
      {bookings.length > 0 ? (
        <FlatList data={bookings} renderItem={renderItem} style={styles.list} />
      ) : (
        <Text style={styles.emptyText}>No bookings found.</Text>
      )}
      <Spinner visible={loading} textStyle={{ color: Colors.primary }} overlayColor={Colors.overlay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
});

export default BookingHistoryScreen;
