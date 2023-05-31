import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Sizes from "../constants/Sizes";
import Colors from "../constants/colors";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function App({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = await retrieveData("token");
    try {
      const response = await axios.get(
        "https://spacezone-backend.cyclic.app/api/user/me2",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const currentUser = response.data.currentUser;
      setUserName(currentUser.userName);
      setEmail(currentUser.email);
      setPhone(currentUser.number);
      setRole(currentUser.role);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
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

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userName");
      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("userID");

      navigation.reset({
        index: 0,
        routes: [{ name: "Welcome" }],
      });
    } catch (error) {
      console.log("Error removing token from AsyncStorage:", error);
    }
  };

  return (
    <>
      <ImageBackground
        style={styles.backgroundImage}
        source={require("../assets/Background.png")}
        // blurRadius={1}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingTop: 30,
            paddingRight: 10,
          }}
        >
          <View style={styles.icons}>
            <TouchableOpacity style={styles.setting}>
              <AntDesign name="setting" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.container}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg",
                  }}
                />
                <Text style={styles.name}>{userName}</Text>
                <Text style={styles.bio}>{role}</Text>
                <View style={styles.infoContainer}>
                  <AntDesign name="googleplus" size={24} />
                  <Text style={styles.infoText}>{email}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Entypo name="phone" size={24} />
                  <Text style={styles.infoText}>{phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  infoText: {
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
