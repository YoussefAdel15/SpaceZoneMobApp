import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Rating, AirbnbRating } from "react-native-ratings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Image } from "react-native";
import QRCode from "react-native-qrcode-svg";
// import QRCode from "react-native-qrcode";
import { FontAwesome } from "@expo/vector-icons";

const BookingDetailsScreen = ({ route }) => {
  const { booking } = route.params;
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookStatus, setBookStatus] = useState(booking.bookingStatus);
  // const bookingStatus = booking.bookingStatus;
  const room = booking.bookingRoom;
  const seats = booking.bookingSeats;

  const qrData = `Person Name :${userName}
  Email :${email}
  Phone :${phone}
  Booking ID :${booking._id}
  Booking Date :${booking.bookingDate}
  Booking Time :${booking.startTime} ${booking.startTime > 12 ? "PM" : "AM"}
  End Time :${booking.endTime} ${booking.endTime > 12 ? "PM" : "AM"}
  `; // Replace with your specific data
  let logoFromFile = require("../assets/SpaceZone.png");
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
      console.log(currentUser);
      setUserName(currentUser.userName);
      setEmail(currentUser.email);
      setPhone(currentUser.number);
      
    } catch (error) {
      console.log(error);
    }
  };

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

  const ReviewSection = () => {
    const [showModal, setShowModal] = useState(false);

    const currentDate = new Date();
    const bookingDate = new Date(booking.bookingDate);

    if (bookingDate <= currentDate) {
      return (
        <View>
          <Text style={styles.reviewLabel}>Add a Review:</Text>
          <Text>NOTE:</Text>
          <Text>
            To set your Rating, please DOUBLE press the stars corresponding to
            the rating you want!
          </Text>
          <View style={{ paddingBottom: 10 }}>
            <AirbnbRating
              count={5}
              reviews={["1", "2", "3", "4", "5"]}
              defaultRating={0}
              size={30}
              onFinishRating={handleRatingChange}
            />
          </View>
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
              onPress={handleReviewSubmit}
            >
              <Text style={styles.buttonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      const handleCancelBooking = async () => {
        const token = await retrieveData("token");
        const bookingID = booking._id;
        try {
          const request = await axios.post(
            `https://spacezone-backend.cyclic.app/api/booking/cancelBooking/${bookingID}`,
            {
              bookingID: bookingID,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (request.data.status === "success") {
            alert("Booking Cancelled Successfully");
          } else {
            alert("Booking Cancellation Failed");
          }
        } catch (error) {
          console.log(error);
        }
      };

      const handleCancellationRules = () => {
        setShowModal(true);
      };

      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.futureBookingContainer}>
            {/* Future booking content */}
          </View>
          <View style={styles.cancelContainer}>
            <TouchableOpacity
              style={styles.btnCancel}
              onPress={handleCancelBooking}
            >
              <Text style={styles.btnCancelText}>Cancel Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancellationRules}>
              <Text style={styles.cancellationRulesText}>
                Cancellation Rules
              </Text>
            </TouchableOpacity>
          </View>
          <Modal visible={showModal} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Cancellation Rules</Text>
                {/* Add your cancellation rules text here */}
                <Text>
                  Rule 1: Cancellation requests made 48 hours prior to the
                  booking date are eligible for a full refund.
                </Text>
                <Text>
                  Rule 2: Cancellation requests made between 24 to 48 hours
                  prior to the booking date will be charged a 50% cancellation
                  fee.
                </Text>
                <Text>
                  Rule 3: Cancellation requests made less than 24 hours prior to
                  the booking date are not eligible for a refund.
                </Text>
                <Text>
                  Rule 4: No-shows will be charged the full booking amount.
                </Text>
                {/* Add any other rules as needed */}
                <TouchableOpacity
                  style={styles.btnCloseModal}
                  onPress={() => setShowModal(false)}
                >
                  <Text style={styles.btnCloseModalText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      );
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.heading}>Booking Details</Text>

        <View style={styles.detailsContainer}>
          <TouchableHighlight
            underlayColor={"white"}
            activeOpacity={0.9}
            onPress={() => console.log(booking)}
          >
            <View
              style={{
                height: "auto",
                marginHorizontal: 10,
                marginBottom: 10,
                marginTop: 10,
                borderRadius: 25,
                elevation: 13,
                backgroundColor: "white",
              }}
            >
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <Image
                  source={require("../assets/success.png")}
                  style={{ height: 50, width: 50, borderRadius: 20 }}
                />
              </View>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {booking.placeName}
                  </Text>
                  <Text
                    style={{ fontSize: 15, fontWeight: "bold", marginTop: 5 }}
                  >
                    ID: {booking._id}
                  </Text>
                  {room && <Text>Room Number : {room}</Text>}
                  {seats && <Text>Seats Number : {seats}</Text>}
                  {bookStatus == true && <Text>Booking Status: true</Text>}
                  {booking.paymentStatus == true && (
                    <Text>Payment Status : success</Text>
                  )}
                  {booking.paymentStatus == false && (
                    <Text>Payment Status : pending or failed</Text>
                  )}
                  <Text>Payment Method: {booking.paymentMethod}</Text>
                  <View>
                    <View style={styles.lineStyle} />

                    <Text
                      style={{ fontSize: 15, fontWeight: "bold", marginTop: 8 }}
                    >
                      <MaterialCommunityIcons
                        name="calendar-blank"
                        size={15}
                        color="#4b86b4"
                        style={{ paddingHorizontal: 5 }}
                      />
                      {booking.bookingDate.split("T")[0]}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 5,
                      }}
                    >
                      <Text>
                        Start: {booking.startTime}
                        {":00"}
                      </Text>
                      <Text style={{ marginLeft: 10 }}>
                        End : {booking.endTime}
                        {":00"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          flexDirection: "row",
                          color: "#938129",
                          marginLeft: 80,
                          marginBottom: 15,
                        }}
                      >
                        {booking.priceToPay} L.E
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
        </View>
        <View
          style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              style={{
                flexWrap: "wrap",
                flex: 1,
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Booking QR Code , Please Show it to the receptionist to confirm
              your booking
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ alignItems: "center" }}>
              <QRCode value={qrData} logo={logoFromFile} />
            </View>
          </View>
        </View>
        {/* Review Section */}
        <ReviewSection />
        {/* End of Review Section */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingTop: 50,
    height: "100%",
    width: "100%",
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
  futureBookingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  futureBookingText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },

  cancelContainer: {
    marginTop: 20,
  },
  btnCancel: {
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  btnCancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancellationRulesText: {
    color: "#3498db",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  btnCloseModal: {
    marginTop: 20,
    backgroundColor: "#3498db",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnCloseModalText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingDetailsScreen;
