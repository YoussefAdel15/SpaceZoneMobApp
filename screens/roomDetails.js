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

const RoomDetailsPage = ({ route }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStartHour, setSelectedStartHour] = useState(null);
  const [selectedEndHour, setSelectedEndHour] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const { roomId } = route.params;
  const { placeId } = route.params;
  const { roomDetails } = route.params;
  const startDate = roomDetails.days[0].date.split("T")[0];
  const endDate =
    roomDetails.days[roomDetails.days.length - 1].date.split("T")[0];
  const [openHours, setOpenHours] = useState([]);

  const [date, setDate] = useState();
  const [selectedIndex, setSelectedIndex] = useState(null);
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
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../assets/Background.png")}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Room Details</Text>
          {/* Room details */}
          <Text>
            Room Name: {roomDetails.roomType} {roomDetails.roomNumber}
          </Text>
          <Text>Capacity: {roomDetails.seats}</Text>
          <Text>Price: {roomDetails.price} EGP</Text>

          {/* Date input form */}
          <View>
            <Text style={styles.subtitle}>Select Date</Text>
            {/* Other components */}
            <Text style={{ marginBottom: 10 }}>Selected Date is {date}</Text>
            <DatePicker
              onSelectedChange={(value) => setDate(value)}
              options={{
                backgroundColor: "#ecf0eb",
                textHeaderColor: "#030303",
                textDefaultColor: "#0d0900",
                selectedTextColor: "#fff",
                mainColor: "#089ba8",
                textSecondaryColor: "#141414",
                borderColor: "rgba(122, 146, 165, 0.1)",
              }}
              current="2023-06-01"
              mode="calendar"
              minimumDate={new Date().toISOString().split("T")[0]}
              maximumDate={endDate}
              minuteInterval={30}
              style={{ borderRadius: 10 }}
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
                      hour === selectedStartHour
                        ? styles.selectedHourCard
                        : null,
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
          <Button
            title="Check Availability"
            onPress={handleCheckAvailability}
          />
        </View>
      </ImageBackground>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
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
});

export default RoomDetailsPage;
