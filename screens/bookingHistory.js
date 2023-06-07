import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import Colors from "../constants/colors";

const BookingHistoryScreen = ({ route, navigation }) => {
  const [bookings, setBookings] = useState([]);
  //   const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch booking history data from an API or local storage
    // and update the 'bookings' state
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
    // Replace this with your actual API call or data retrieval logic
    await axios
      .get("https://spacezone-backend.cyclic.app/api/user/getMyBookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data.bookings);
        setBookings(response.data.bookings);
      });
    setLoading(false);
  };

  //   const fetchFeedback = async () => {
  //     const token = await retrieveData("token");
  //     // Replace this with your actual API call or data retrieval logic
  //     await axios
  //       .get("https://spacezone-backend.cyclic.app/api/user/getMyFeedbacks", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((response) => {
  //         console.log(response.data.feedbacks);
  //         setFeedbacks(response.data.feedbacks);
  //       });
  //   };

  const renderItem = ({ item }) => (
    <TouchableOpacity
    // onPress={() => {
    //   navigation.navigate("BookingDetails", {
    //     bookingId: item._id,
    //   });
    // }}
    >
      <View style={styles.itemContainer}>
        <Text>Booking ID : {item._id}</Text>
        <Text>Place Name : {item.placeName}</Text>
        <Text>Room Name : {item.roomName}</Text>
        <Text>Booking Date : {item.bookingDate}</Text>
        <Text>
          Start Time : {item.startTime} {item.startTime > 12 && <Text>PM</Text>}
          {item.startTime < 12 && <Text>PM</Text>}
          {item.startTime == 12 && <Text>PM</Text>}
        </Text>
        <Text>
          End Time : {item.endTime} {item.endTime > 12 && <Text>PM</Text>}
          {item.endTime < 12 && <Text>PM</Text>}
          {item.endTime == 12 && <Text>PM</Text>}
        </Text>
        <Text>Booking Status : {item.bookingStatus}</Text>
        <Text>Booking Price : {item.priceToPay} L.E</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Booking History</Text>
        {bookings.length > 0 ? (
          <FlatList
            data={bookings}
            renderItem={renderItem}
            style={styles.list}
          />
        ) : (
          <Text style={styles.emptyText}>No bookings found.</Text>
        )}
        <Spinner
          visible={loading}
          textStyle={{ color: Colors.primary }}
          overlayColor={Colors.overlay}
        />
      </View>
    </ScrollView>
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
  bookingName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bookingDate: {
    fontSize: 14,
    color: "#888",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
});

export default BookingHistoryScreen;
