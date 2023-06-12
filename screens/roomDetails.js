import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import DatePicker from "react-native-modern-datepicker";

const RoomDetailsPage = ({ route, navigation }) => {
  const [selectedStartHour, setSelectedStartHour] = useState(null);
  const [selectedEndHour, setSelectedEndHour] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);
  const { roomId } = route.params;
  const { placeId } = route.params;
  const { roomDetails } = route.params;
  const endDate =
    roomDetails.days[roomDetails.days.length - 1].date.split("T")[0];
  const [openHours, setOpenHours] = useState([]);

  const [date, setDate] = useState();
  const [openHours2, setOpenHours2] = useState([]);

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

  const handleCheckAvailability = () => {
    // place / room
    if (startHour && endHour && date) {
      const formattedDate = date.replace(/\//g, "-"); // Replaces "/" with "-" to convert the format
      const selectedDate = new Date(formattedDate);
      console.log("Selected Date:", selectedDate);
      console.log("Selected Start Hour:", selectedStartHour);
      console.log("Selected End Hour:", selectedEndHour);
      axios
        .post(
          `https://spacezone-backend.cyclic.app/api/booking/checkAvailabilityRoom/${placeId}/${roomId}`,
          {
            Date: selectedDate,
            startTime: startHour,
            endTime: endHour,
          }
        )
        .then((response) => {
          console.log(response);
          if (response.data.status === "success") {
            alert("Room is available");
          } else {
            alert("Room is not available");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("Please select a date and hours");
    }
  };

  return (
    <ScrollView>
      {/* <ImageBackground
        style={styles.backgroundImage}
        source={require("../assets/Background.png")}
      > */}
      <View style={styles.container}>
        <TouchableOpacity style={styles.roomDet}>
          <Text style={styles.title}>Room Details</Text>
          {/* Room details */}
          <Text>
            Room Name: {roomDetails.roomType} {roomDetails.roomNumber}
          </Text>
          <Text>Capacity: {roomDetails.seats}</Text>
          <Text>Price: {roomDetails.price} EGP</Text>
        </TouchableOpacity>

        {/* Date input form */}
        <View>
          <Text style={styles.subtitle}>Select Date</Text>
          {/* Other components */}
          <Text style={{ marginBottom: 10 }}>Selected Date is {date}</Text>
          <DatePicker
            onSelectedChange={(value) => setDate(value)}
            options={{
              backgroundColor: "rgba(173,203,227 , 0.5)",
              textHeaderColor: "#030303",
              textDefaultColor: "#0d0900",
              selectedTextColor: "#fff",
              mainColor: "#089ba8",
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
        </View>

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

        {/* Check Availability button */}
        <TouchableOpacity style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnBook}
            onPress={handleCheckAvailability}
          >
            <Text style={styles.buttonText}>Check Availability</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnBook}
            onPress={() =>
              navigation.navigate("RoomBooking", {
                roomId: roomId,
                placeId: placeId,
                roomDetails: roomDetails,
              })
            }
          >
            <Text style={styles.buttonText}>Book Room</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    // flex: 1,
    padding: 16,
  },
  roomDet: {
    marginTop: 40,
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 5,
    paddingTop: 16,
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
  },
  selectedHourCard: {
    backgroundColor: "lightblue",
  },
  btnBook: {
    backgroundColor: "#4b86b4",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
    width: "50%",
    marginRight: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  btnContainer: {
    flexDirection: "row",
  },
});

export default RoomDetailsPage;
