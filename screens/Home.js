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
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import SquareCard from "../components/SquareCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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

  const fetchSurfData = async () => {
    try {
      const response = await axios.get(
        "https://spacezone-backend.cyclic.app/api/places/getAllPlaces"
      );
      setPlaces(response.data.data.places);
    } catch (error) {
      console.log("Error fetching surf data:", error);
    }
  };

  const handleSearch = async () => {
    let data = await axios
      .get(
        `https://spacezone-backend.cyclic.app/api/places/getAllPlaces?zone=${search}`
      )
      .then((response) => {
        console.log(response.data.data);
        navigation.navigate("Surf", { data: response.data.data });
        alert(`Search Successful`);
      });
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
                backgroundColor: "#87cefa",
                ...styles.categoryBtn,
              }}
            >
              <View style={styles.categoryBtnImgCon}>
                <Image
                  source={category.image}
                  style={{ height: 30, width: 30, resizeMode: "cover" }}
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 28 }}>Hello,</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                marginLeft: 5,
                marginTop: 8,
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
          source={{
            uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg",
          }}
          style={{ height: 50, width: 40, borderRadius: 25 }}
        />
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: "row",
          paddingHorizontal: 6,
        }}
      >
        <View style={styles.inputContainer}>
          <Icon name="search" size={28} />
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
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Image
          source={require("../assets/images.jpg")}
          style={{
            width: 90,
            height: 100,
            borderRadius: 10,
            margin: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: 10,
            marginRight: 20,
            marginTop: 20,
          }}
        >
          <View>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: "#444c55" }}
            >
              Makkan Dokii Zone
            </Text>
            <Text style={{ fontSize: 14, color: "grey", marginTop: 4 }}>
              Hourly Price : 5
            </Text>
            <Text style={{ fontSize: 14, color: "grey", marginTop: 4 }}>
              Zone : Dokii
            </Text>
          </View>
        </View>
      </View>
      <View>
        {/* Square Card  */}
        <View style={{marginLeft:10 , marginRight:10, flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              marginTop: 10,
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Most Rated
          </Text>
          <Text style={{ marginTop: 10, fontSize: 15, fontWeight: "bold" }}>
            See All
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <TouchableHighlight underlayColor={"white"} activeOpacity={0.9}>
            <View
              style={{
                height: 250,
                width: cardWidth,
                marginHorizontal: 10,
                marginBottom: 20,
                marginTop: 10,
                borderRadius: 15,
                elevation: 13,
                backgroundColor: "white",
              }}
            >
              <View
                style={{ alignItems: "center", top: -5, marginVertical: 20 }}
              >
                <Image
                  source={require("../assets/images.jpg")}
                  style={{ height: 120, width: 120 }}
                />
              </View>
              <View style={{ marginHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Dokii</Text>
                <Text style={{ fontSize: 14, color: "grey", marginTop: 2 }}>
                  Zone
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  marginHorizontal: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>$5</Text>
              </View>
            </View>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={"white"} activeOpacity={0.9}>
            <View
              style={{
                height: 250,
                width: cardWidth,
                marginHorizontal: 10,
                marginBottom: 20,
                marginTop: 10,
                borderRadius: 15,
                elevation: 13,
                backgroundColor: "white",
              }}
            >
              <View
                style={{ alignItems: "center", top: -5, marginVertical: 20 }}
              >
                <Image
                  source={require("../assets/images.jpg")}
                  style={{ height: 120, width: 120 }}
                />
              </View>
              <View style={{ marginHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>Dokii</Text>
                <Text style={{ fontSize: 14, color: "grey", marginTop: 2 }}>
                  Zone
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  marginHorizontal: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>$5</Text>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      </View>
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
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchbto: {
    width: 50,
    height: 50,
    marginLeft: 8,
    backgroundColor: "#87cefa",
    borderRadius: 10,
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
    borderRadius: 12,
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
