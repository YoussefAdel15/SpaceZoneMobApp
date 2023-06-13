import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import Colors from "../constants/colors";
import { TouchableHighlight } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BookingCard = ({ booking, onPress }) => {
  return (
    
    <TouchableOpacity onPress={onPress}>
      {/* <TouchableOpacity> 
         <Image source={require('../assets/tick.png')}/>
      </TouchableOpacity> */}

            <View style={styles.row}>
            <View style={styles.itemContainer}> 
            <TouchableHighlight underlayColor={"white"} activeOpacity={0.9}>
              <View
                style={{
                  height: 200,
                  marginHorizontal: 10,
                  marginBottom: 10,
                  marginTop: 10,
                  borderRadius: 25,
                  elevation: 13,
                  backgroundColor: "white",
                }}
              >
                <View
                  style={{ alignItems: "center", marginVertical: 10 }}
                >
                  <Image
                    source={require("../assets/positive-vote.png")}
                    style={{ height: 50, width: 50 , borderRadius:20 }}
                  />
                </View>
                <View style={{flexDirection:"row" , marginTop:8}}>
                <View style={{ marginHorizontal: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>{booking.placeName}</Text>
               <Text style={{ fontSize: 15, fontWeight: "bold" , marginTop:5}}>ID: {booking._id}</Text>
               <Text>Room :{booking.roomName}</Text>
               <Text>Booking Status: {booking.bookingStatus}</Text>
               <View>
               <View style = {styles.lineStyle} />

               <Text style={{ fontSize: 15, fontWeight: "bold" , marginTop:8}}>    
                <MaterialCommunityIcons name="calendar-blank" size={15} color="#4b86b4" style={{paddingHorizontal:5}} />
                {(booking.bookingDate).split('T')[0]}</Text>

                  <View style={{flexDirection:"row" ,  justifyContent: "space-between" , marginTop:5}}>
                  <Text>
                  Start: {booking.startTime} {booking.startTime > 12 ? "PM" : "AM"}
                </Text>
                <Text style={{marginLeft:10 }} >
                  End : {booking.endTime} {booking.endTime > 12 ? "PM" : "AM"}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "bold" , flexDirection:"row" , color:"#938129" , marginLeft:80 , marginBottom:15}}>{booking.priceToPay} L.E</Text>

                </View>
                  </View>
                </View>

                </View>
              </View>
            </TouchableHighlight>
        {/* <Text>Booking ID: {booking._id}</Text> */}
        {/* <Text>Place Name: {booking.placeName}</Text> */}
        {/* <Text>Room Name: {booking.roomName}</Text> */}
        {/* <Text>Booking Date: {(booking.bookingDate).split('T')[0]}</Text> */}
        {/* <Text>
          Start Time: {booking.startTime} {booking.startTime > 12 ? "PM" : "AM"}
        </Text>
        <Text>
          End Time: {booking.endTime} {booking.endTime > 12 ? "PM" : "AM"}
        </Text> */}
        {/* <Text>Booking Status: {booking.bookingStatus}</Text>
        <Text>Booking Price: {booking.priceToPay} L.E</Text> */}
      </View>
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
    await axios
      .get("https://spacezone-backend.cyclic.app/api/user/getMyBookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBookings(response.data.bookings);
      });
    setLoading(false);
  };

  const navigateToBookingDetails = (booking) => {
    navigation.navigate("BookingDetails", { booking });
  };

  const renderItem = ({ item }) => (
    <BookingCard
      booking={item}
      onPress={() => navigateToBookingDetails(item)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Booking History</Text>
      {bookings.length > 0 ? (
        <FlatList data={bookings} renderItem={renderItem} style={styles.list} />
      ) : (
        <Text style={styles.emptyText}>No bookings found.</Text>
      )}
      <Spinner
        visible={loading}
        textStyle={{ color: Colors.primary }}
        overlayColor={Colors.overlay}
      />
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
    borderRadius: 25,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  lineStyle: {
    borderWidth: 0.3,
    borderColor: "lightgray",
    marginTop: 8,
    width: "90%",
    alignContent: "center",
    justifyContent: "center",
  },
});

export default BookingHistoryScreen;
