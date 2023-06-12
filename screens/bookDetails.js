import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookingDetailsScreen = ({ route }) => {
  const { booking } = route.params;
  const [review, setReview] = useState("");

  const handleReviewSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    // Make an API request to submit the review
    // Example code, modify it according to your API endpoint
    await axios.post(
      "https://spacezone-backend.cyclic.app/api/reviews/add",
      {
        bookingId: booking._id,
        reviewText: review,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Optionally, you can navigate back to the booking history screen
    // after the review is submitted.
    // Replace "BookingHistory" with the name of your booking history screen.
    navigation.navigate("BookingHistory");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booking Details</Text>
      <View style={styles.detailsContainer}>
        <Text>Booking ID: {booking._id}</Text>
        <Text>Place Name: {booking.placeName}</Text>
        <Text>Room Name: {booking.roomName}</Text>
        <Text>Booking Date: {booking.bookingDate.split("T")[0]}</Text>
        <Text>
          Start Time: {booking.startTime} {booking.startTime > 12 ? "PM" : "AM"}
        </Text>
        <Text>
          End Time: {booking.endTime} {booking.endTime > 12 ? "PM" : "AM"}
        </Text>
        <Text>Booking Status: {booking.bookingStatus}</Text>
        <Text>Booking Price: {booking.priceToPay} L.E</Text>
      </View>
      <Text style={styles.reviewLabel}>Add a Review:</Text>
      <TextInput
        style={styles.reviewInput}
        multiline
        value={review}
        onChangeText={setReview}
      />
      <Button title="Submit Review" onPress={handleReviewSubmit} />
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
  detailsContainer: {
    marginBottom: 16,
  },
  reviewLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  reviewInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    padding: 8,
  },
});

export default BookingDetailsScreen;
