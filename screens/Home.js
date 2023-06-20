import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Touchable,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import SquareCard from "../components/SquareCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { FontAwesome } from "react-native-vector-icons";

const { width } = Dimensions.get("screen");
const cardWidth = width / 2 - 20;
const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const userName = await retrieveData("userName");
    setUserName(userName);
  };

  useEffect(() => {
    fetchSurfData();
  }, []);

  const fetchSurfData = async () => {
    try {
      const response = await axios.get(
        "https://spacezone-backend.onrender.com/api/places/getAllPlaces/?sort=rating"
      );
      const places = response.data.data.places.reverse();
      setPlaces(places);
    } catch (error) {
      console.log("Error fetching surf data:", error);
    }
  };

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
      console.log("Data stored successfully");
    } catch (error) {
      console.log("Error storing data:", error);
    }
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

  const handleSearch = () => {};

  const categories = [
    {
      id: 1,
      name: "Shared Area",
      image: require("../assets/icon_7793-300x300-removebg-preview.png"),
    },
    {
      id: 2,
      name: "Silent Room",
      image: require("../assets/mute-removebg.png"),
    },
    {
      id: 3,
      name: "Training Room",
      image: require("../assets/png-transparent-classroom-computer-icons-training-class-room-text-class-logo-removebg-preview.png"),
    },
    {
      id: 4,
      name: "Meeting Room",
      image: require("../assets/meeting-room-removebg-preview.png"),
    },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={{ flexDirection: "column" }}>
        <Image source={item.image} style={styles.categoryImage} />
        <Text style={styles.categoryText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRecommended = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );
  const ListCategories = () => {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesListContainer}
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: category, index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedCategoryIndex(index)}
          >
            <View
              style={{
                backgroundColor: "rgba(99,172,229,0.7)",
                ...styles.categoryBtn,
              }}
            >
              <View style={styles.categoryBtnImgCon}>
                <Image
                  source={category.image}
                  style={{ height: 28, width: 28, resizeMode: "cover" }}
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  marginLeft: 4,
                  color: "black",
                }}
              >
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  const squareCard = (place) => {
    place = place.item;
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(place._id);
          navigation.navigate("PlaceDetails", { data: place._id });
        }}
      >
        <View
          style={{
            height: 250,
            width: cardWidth,
            marginHorizontal: 10,
            marginBottom: 10,
            marginTop: 10,
            borderRadius: 25,
            elevation: 13,
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          <View style={{ flex: 1 }}>
            <Image
              source={{ uri: place.placePhotos[0] }}
              style={{ flex: 1, borderRadius: 20 }}
              resizeMode="cover"
            />
          </View>
          <View style={{ padding: 10 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}
              numberOfLines={2}
            >
              {place.placeName}
            </Text>
            <Text
              style={{ fontSize: 14, color: "grey", marginBottom: 4 }}
              numberOfLines={1}
            >
              {place.zone}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text style={{ fontSize: 16, marginRight: 4 }}>Rating:</Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {place.rating}
              </Text>
              {/* Replace the star icon image with the FontAwesome star icon */}
              <FontAwesome
                name="star"
                size={20}
                color="gold"
                style={{ marginLeft: 4 }}
              />
            </View>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#938129" }}
            >
              {place.hourPrice}LE
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 28, marginTop: 15 }}>Hello,</Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  marginLeft: 5,
                  marginTop: 18,
                }}
              >
                {userName}
              </Text>
            </View>
            <Text style={{ marginTop: 5, fontSize: 18, color: "grey" }}>
              What do you want today
            </Text>
          </View>
          <Image
            source={require("../assets/Profile.png")}
            style={{ height: 65, width: 60, borderRadius: 50 }}
          />
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            paddingHorizontal: 6,
          }}
        >
          <View style={styles.inputContainer}>
            <Icon name="search" size={28} color={"gray"} />
            <TextInput
              style={{ flex: 1, fontSize: 16 }}
              placeholder="Where Do You Want To Work ?"
              onChangeText={(text) => setSearch(text)}
            />
          </View>
          <View style={styles.searchbto}>
            <Icon
              name="search"
              size={28}
              color={"white"}
              onPress={handleSearch}
            />
          </View>
        </View>
        {/* catg list  */}
        <View>
          <ListCategories />
        </View>

        {/* card list  */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("PayVoucher");
          }}
        >
          <Image
            source={require("../assets/poster.png")}
            style={{
              height: 250,
              width: "90%",
              marginTop: 20,
              alignSelf: "center",
              borderRadius: 20,
            }}
          />
        </TouchableOpacity>
        <View>
          {/* Top Rated */}
          {/* Square Card  */}
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Top Rated
            </Text>
            <TouchableHighlight underlayColor={"white"} activeOpacity={0.9}>
              <Text style={{ marginTop: 10, fontSize: 15, fontWeight: "bold" }}>
                See All
              </Text>
            </TouchableHighlight>
          </View>
          <View style={{ flexDirection: "row" }}>
            {/* <SquareCard /> */}
            <FlatList
              data={places.slice(0, 3)}
              keyExtractor={(item, index) => index.toString()}
              renderItem={squareCard}
              contentContainerStyle={{ paddingBottom: 20 }} // Adjust as needed
              horizontal={true}
            />
          </View>
          {/* Most Visited */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 40,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
  },
  searchContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    width: 200,
    height: 150,
    marginBottom: 10,
  },
  searchInput: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  searchButton: {
    backgroundColor: "#87cefa",
    width: 200,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  categoriesContainer: {
    marginTop: 20,
    justifyContent: "space-between",
  },
  categoryCard: {
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  categoryImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recommendedCard: {
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#87cefa",
  },
  recommendedImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  recommendedText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    flexDirection: "row",
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchbto: {
    width: 50,
    height: 50,
    marginLeft: 8,
    backgroundColor: "rgba(99,172,229,0.8)",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesListContainer: {
    paddingVertical: 20,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  categoryBtn: {
    height: 45,
    width: 135,
    marginRight: 7,
    borderRadius: 25,
    alignItems: "center",
    paddingHorizontal: 5,
    flexDirection: "row",
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: 220,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: "white",
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: "#F9813A",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
