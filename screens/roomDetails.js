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
  const [selectedHours, setSelectedHours] = useState([]);
  const [firstHour, setFirstHour] = useState(null);
  const [lastHour, setLastHour] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const { roomId } = route.params;
  const { placeId } = route.params;
  const { roomDetails } = route.params;
  const startDate = roomDetails.days[0].date.split("T")[0];
  const endDate =
    roomDetails.days[roomDetails.days.length - 1].date.split("T")[0];
  const [openHours, setOpenHours] = useState([]);
  const handleDateChange = async (date) => {
    const formattedDate = date.replace(/\//g, "-");
    const selectedDate = new Date(formattedDate);
    const hours = await getOpeningHours(selectedDate);
    setOpenHours(hours);
  };

  const getOpeningHours = async (date) => {
    try {
      const response = await axios.post(
        `https://spacezone-backend.cyclic.app/api/booking/getOpenHours/${placeId}`,
        { Date: date }
      );
      return response.data.openHoursArray;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleHourPress = (hour) => {
    if (selectedHours.includes(hour)) {
      setSelectedHours(
        selectedHours.filter((selectedHour) => selectedHour !== hour)
      );
    } else {
      setSelectedHours([...selectedHours, hour]);
    }
  };

  const handleCheckAvailability = () => {
    if (selectedHours.length > 0 && firstHour && lastHour && selectedDate) {
      // Call the CheckAvailability API with selectedDate, firstHour, and lastHour
      console.log("Selected Date:", selectedDate);
      console.log("First Hour:", firstHour);
      console.log("Last Hour:", lastHour);
    } else {
      console.log("Please select a date and hours");
    }
  };

  const renderHours = async () => {
    if (selectedDate) {
      const hours = await getOpeningHours(selectedDate);
      return hours.map((hour) => (
        <TouchableOpacity
          key={hour}
          style={[
            styles.hourCard,
            selectedHours.includes(hour) ? styles.selectedHourCard : null,
          ]}
          onPress={() => handleHourPress(hour)}
        >
          <Text>{hour}:00</Text>
        </TouchableOpacity>
      ));
    }
    return null;
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
            <Text>Selected Date is {selectedDate}</Text>
            <DatePicker
              onSelectedChange={handleDateChange}
              // selected={new Date(), 'YYYY/MM/DD')}
              options={{
                backgroundColor: "#090C08",
                textHeaderColor: "#FFA25B",
                textDefaultColor: "#F6E7C1",
                selectedTextColor: "#fff",
                mainColor: "#F4722B",
                textSecondaryColor: "#D6C7A1",
                borderColor: "rgba(122, 146, 165, 0.1)",
              }}
              current="2023-06-01"
              mode="calendar"
              minimumDate={startDate}
              maximumDate={endDate}
              minuteInterval={30}
              style={{ borderRadius: 10 }}
            />
          </View>

          {/* List of selectable hours */}
          {openHours && openHours.length > 0 ? (
            <>
              <Text style={styles.subtitle}>Select Hours</Text>
              <View style={styles.hoursContainer}>
                {openHours.map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.hourCard,
                      selectedHours.includes(hour)
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
