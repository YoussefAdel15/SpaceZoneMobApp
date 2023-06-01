import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userID, setUserID] = useState("");
  const getUserData = async () => {
    const userName = await retrieveData("userName");
    const userEmail = await retrieveData("userEmail");
    const userID = await retrieveData("userID");
    setUserName(userName);
    setUserEmail(userEmail);
    setUserID(userID);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleSearch = async () => {
    let data = await axios
      .get(
        `https://spacezone-backend.cyclic.app/api/places/getAllPlaces?zone=${search}`
      )
      .then((response) => {
        console.log(response.data.data);
        setData(response.data.data);
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
  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require("../assets/Background.png")}
      // blurRadius={1}
    >
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "flex-start" }}>
          <Text style={styles.greetingText}>Hello, {userName}</Text>
          <View style={styles.content}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Where Do You Want To Work?"
                onChangeText={(text) => setSearch(text)}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => {
                  console.log(search);
                  handleSearch();
                }}
              >
                <Text style={styles.searchButtonText}>Find Your Workspace</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <View style={styles.navbar}>
        <View style={styles.navButtonsContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => {
              navigation.navigate("surf");
            }}
          >
            <Text style={styles.navButtonText}>Surf</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>About Us</Text>
          </TouchableOpacity>
          <View style={styles.circleButton}>
            <Image
              style={styles.image}
              source={require("../assets/SpaceZone.png")}
            />
          </View>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View> */}
      </View>
    </ImageBackground>
  );
};

const styles = {
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 25,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    // alignItems: "center",
  },
  greetingText: {
    fontSize: 18,
    // fontWeight: "bold",
    // marginBottom: 20,
    marginTop: 40,
  },
  searchContainer: {
    alignItems: "center",
  },
  searchInput: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    // paddingLeft: 5,
  },
  searchButton: {
    backgroundColor: "#87cefa",
    width: 180,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  navbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    backgroundColor: "#87cefa",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  navButtonsContainer: {
    flexDirection: "row",
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
    height: 100,
    borderRadius: 25,
    // marginRight: 10,
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
};

export default HomeScreen;
