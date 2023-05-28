import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Colors from "../constants/colors";
import { useRoute } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";

const SurfScreen = ({ navigation }) => {
  const route = useRoute();
  const { data } = route.params || {}; // Default to an empty object if route.params is undefined
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (data && data.places) {
      setPlaces(data.places);
    } else {
      fetchSurfData();
    }
  }, [data]);

  const fetchSurfData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://spacezone-backend.cyclic.app/api/places/getAllPlaces"
      );
      setPlaces(response.data.data.places);
    } catch (error) {
      console.log("Error fetching surf data:", error);
    }
    setLoading(false);
  };

  const PlaceCard = ({ place }) => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <Card containerStyle={styles.cardContainer}>
          <View style={styles.cardContent}>
            <Image
              style={styles.cardImage}
              source={{ uri: place.placePhotos[0] }}
            />
            <View style={styles.cardDetails}>
              <Text>{place.placeName}</Text>
              <Text>Hourly Price: {place.hourPrice}</Text>
              <Text>Zone: {place.zone}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    return <PlaceCard place={item} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerS}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Do You Know The Place Name?"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              console.log(searchQuery);
              handleSearch();
            }}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerL}>
        <View>
          {places.length > 0 ? (
            <FlatList
              style={{ width: "100%" }}
              data={places}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
            />
          ) : (
            <Spinner
              visible={loading}
              textStyle={{ color: Colors.primary }}
              overlayColor={Colors.overlay}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = {
  containerS: {
    height: "15%",
    width: "100%",
    backgroundColor: "#87cefa",
    justifyContent: "center",
  },
  container: {
    height: "100%",
    width: "100%",
  },
  containerL: {
    height: "85%",
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  searchInput: {
    width: "70%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: "#6fa8dc",
    width: "25%",
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cardContainer: {
    borderRadius: 10,
    width: "95%",
    alignSelf: "center",
    marginBottom: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardImage: {
    height: 100,
    width: 150,
  },
  cardDetails: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    // alignItems: "space-around",
    // alignContent: "space-around",
    height: "8%",
    backgroundColor: "#87cefa",
  },
  navButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  navButton: {
    paddingHorizontal: 10,
    // textAlign: "center",
    justifyContent: "center",
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: "100%",
    borderRadius: 25,
    // marginRight: 10,
    justifyContent: "center",
  },
};

export default SurfScreen;
