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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const userName = await retrieveData("userName");
    setUserName(userName);
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
      image: require("../assets/shared.jpg"),
    },
    {
      id: 2,
      name: "Silent Room",
      image: require("../assets/silent.png"),
    },
    {
      id: 3,
      name: "Training Room",
      image: require("../assets/training.png"),
    },
    {
      id: 4,
      name: "Meeting Room",
      image: require("../assets/meeting.png"),
    },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Image source={item.image} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../assets/Background.png")}
      >
        <Text style={styles.greetingText}>Hello, {userName}</Text>
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <Image
              source={require("../assets/SpaceZone.png")}
              style={styles.logo}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Where Do You Want To Work?"
              onChangeText={(text) => setSearch(text)}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Find Your Workspace</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>
      </ImageBackground>
    </View>
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
    flex: 1,
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
    color: "#fff",
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
});

export default HomeScreen;
