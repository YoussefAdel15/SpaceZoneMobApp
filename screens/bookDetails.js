import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Rating } from "react-native-ratings";

const BookingDetailsScreen = ({ route }) => {
  const { booking } = route.params;
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleReviewSubmit = async () => {
    const token = await retrieveData("token");
    console.log(booking);
    const placeID = decodeURIComponent(booking.placeID);
    await axios.post(
      `https://spacezone-backend.cyclic.app/api/places/addFeedback/${placeID}`,
      {
        feedbackText: review,
        feedbackNumber: rating,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    navigation.navigate("BookingHistory");
  };

  const handleRatingChange = (value) => {
    setRating(value);
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
      <Rating
        showRating
        onFinishRating={handleRatingChange}
        style={styles.rating}
      />
      <Text style={styles.reviewLabel}>Your Rating: {rating} stars</Text>
      <TextInput
        style={styles.reviewInput}
        multiline
        value={review}
        onChangeText={setReview}
      />
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          style={styles.btnBook}
          onPress={() => {
            handleReviewSubmit();
          }}
        >
          <Text style={styles.buttonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
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
  rating: {
    marginBottom: 16,
    paddingVertical: 10,
  },
  reviewInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    padding: 8,
  },
  btnBook: {
    backgroundColor: "#4b86b4",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingDetailsScreen;
