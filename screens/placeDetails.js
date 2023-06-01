import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Carousel from "react-native-snap-carousel";
import Colors from "../constants/colors";
import { Dimensions } from "react-native";

const window = Dimensions.get("window");
const screenHeight = window.height;
const screenWidth = window.width;

const PlaceDetailsPage = ({ route, navigation }) => {
  const { data } = route.params;
  const [placeData, setPlaceData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaceData();
  }, []);

  const fetchPlaceData = async () => {
    setLoading(true);
    const decodedData = decodeURIComponent(data);
    try {
      const response = await axios.get(
        `https://spacezone-backend.cyclic.app/api/places/${decodedData}`
      );
      setPlaceData(response.data.data);
    } catch (error) {
      console.log("Error fetching place data:", error);
    }
    setLoading(false);
  };

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  );

  const renderRoomCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("RoomDetails", {
          placeId: placeData._id,
          roomId: item._id,
          roomDetails: item,
        });
      }}
    >
      <View style={styles.roomCard}>
        <Text style={styles.roomTitle}>
          {item.roomType} {item.roomNumber}
        </Text>
        <Text style={styles.roomDescription}>
          Number Of Seats: {item.seats}
        </Text>
        {/* Add more room details as needed */}
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require("../assets/Background.png")}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>{placeData.placeName}</Text>
          <View style={styles.carouselContainer}>
            <Carousel
              data={placeData.placePhotos}
              renderItem={renderImageItem}
              sliderWidth={screenWidth}
              itemWidth={screenWidth}
              layout={"default"}
            />
          </View>
          <Text style={styles.description}>{placeData.description}</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>Address: {placeData.address}</Text>
          </View>
          <Text style={styles.contact}>Contact: {placeData.number}</Text>
          <View style={styles.roomCardsContainer}>
            <View style={styles.roomCardRow}>
              <View style={styles.roomCard}>
                <Text style={styles.roomTitle}>Shared Area</Text>
                <Text style={styles.roomDescription}>
                  Number Of Seats {placeData.numberOfSeats}
                </Text>
                {/* Add more shared area details as needed */}
              </View>
              {placeData.rooms && placeData.rooms.length > 0 && (
                <FlatList
                  data={placeData.rooms}
                  renderItem={renderRoomCard}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                />
              )}
            </View>
          </View>
          <Spinner
            visible={loading}
            textStyle={{ color: Colors.primary }}
            overlayColor={Colors.overlay}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  carouselContainer: {
    height: screenHeight * 0.4,
    marginBottom: 16,
  },
  carouselImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    paddingTop: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  addressContainer: {},
  address: {
    fontSize: 16,
    marginBottom: 4,
  },
  contact: {
    fontSize: 16,
    marginBottom: 4,
  },
  roomCardsContainer: {
    marginTop: 16,
    width: "100%",
  },
  roomCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  roomCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 8,
    width: 10,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  roomDescription: {
    fontSize: 14,
    color: "#888888",
  },
});

export default PlaceDetailsPage;
