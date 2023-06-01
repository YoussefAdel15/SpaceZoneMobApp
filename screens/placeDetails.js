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
        // console.log("Room details:", item);
        navigation.navigate("RoomDetails", {
          placeId: placeData._id,
          roomId: item._id,
          roomDetails: item,
        });
      }}
    >
      <View style={styles.roomCardContainer}>
        <View style={styles.roomCard}>
          <Image source={{ uri: item.image }} style={styles.roomImage} />
          <View style={styles.roomCardContent}>
            <Text style={styles.roomTitle}>
              {item.roomType} {item.roomNumber}
            </Text>
            <Text style={styles.roomDescription}>
              Number Of Seats: {item.seats}
            </Text>
            {/* Add more room details as needed */}
          </View>
        </View>
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
              inactiveSlideOpacity={0.7}
              inactiveSlideScale={0.9}
            />
          </View>
          <Text style={styles.description}>{placeData.description}</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>Address: {placeData.address}</Text>
          </View>
          <Text style={styles.contact}>Contact: {placeData.number}</Text>
          <View style={styles.roomCardsContainer}>
            <Text style={styles.sectionTitle}>Shared Area</Text>
            <View style={styles.sharedAreaCard}>
              <Text style={styles.roomDescription}>
                Number Of Seats: {placeData.numberOfSeats}
              </Text>
              {/* Add more shared area details as needed */}
            </View>
            {placeData.rooms && placeData.rooms.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Rooms</Text>
                <FlatList
                  data={placeData.rooms}
                  renderItem={renderRoomCard}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={2}
                />
              </>
            )}
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
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    paddingTop: 16,
    color: Colors.primary,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    color: Colors.text,
  },
  addressContainer: {
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.text,
  },
  contact: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.text,
  },
  roomCardsContainer: {
    marginTop: 16,
    width: "100%",
  },
  sharedAreaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    height: 150,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary,
  },
  roomDescription: {
    fontSize: 14,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },

  roomCardContainer: {
    alignItems: "space-between",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  roomCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: screenWidth * 0.4,
    overflow: "hidden",
  },
  roomImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  roomCardContent: {
    padding: 12,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary,
  },
  roomDescription: {
    fontSize: 14,
    color: Colors.text,
  },
});

export default PlaceDetailsPage;
