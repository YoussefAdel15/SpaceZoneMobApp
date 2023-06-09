import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";
import {
  StyleSheet,
  currentUser,
  SafeAreaView,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function App({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [bookings, setBookings] = useState();
  const [reviews, setReviews] = useState();
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchData();
  }, [bookings, user.wallet]);

  useEffect(() => {
    fetchData2();
  }, [reviews]);

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
      // console.log(currentUser);
      setUser(currentUser);
      setUserName(currentUser.userName);
      setEmail(currentUser.email);
      setPhone(currentUser.number);
      setRole(currentUser.role);
      setBookings(currentUser.booking.length);
      // setReviews(currentUser.feedbacks.length);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchData2 = async () => {
    const token = await retrieveData("token");
    try {
      const response = await axios.get(
        "https://spacezone-backend.cyclic.app/api/user/getMyFeedbacks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const currentUser = response.data;
      console.log(currentUser);
      if (currentUser.feedbacks.length)
        setReviews(currentUser.feedbacks.length);
      else setReviews(0);
      // setReviews(currentUser.feedbacks.length);
    } catch (error) {
      console.log(error);
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
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container}>
        <View style={styles.userInfoSection}>
          <View style={{ marginTop: 36 }}>
            <Avatar.Image
              source={require("../assets/Profile.png")}
              size={130}
              style={{
                width: 130,
                height: 130,
                // marginBottom: 10,
                alignSelf: "center",
                // position: "absolute",
                marginTop: 40,
              }}
            />

            <View style={{ marginLeft: 5 }}>
              <Title
                style={[
                  styles.title,
                  {
                    marginTop: 10,
                    marginBottom: 5,
                    alignSelf: "center",
                    color: "black",
                    fontSize: 25,
                  },
                ]}
              >
                {userName}
              </Title>
              <Title
                style={[
                  {
                    color: "black",
                    marginTop: -15,
                    fontSize: 12,
                    fontWeight: 600,
                    alignSelf: "center",
                  },
                ]}
              >
                {role}
              </Title>
            </View>
          </View>
        </View>

        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="phone" color="#4b86b4" size={18} />
            <Text style={{ color: "#000000", marginLeft: 10, marginTop: 3 }}>
              {phone}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" color="#4b86b4" size={18} />
            <Text style={{ color: "#000000", marginLeft: 10, marginTop: 3 }}>
              {email}
            </Text>
          </View>
        </View>

        <View style={styles.infoBoxWrapper}>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: "#dddddd",
                borderRightWidth: 1,
              },
            ]}
          >
            <Title
              onPress={() => navigation.navigate("BookingHistory")}
              style={{ color: "#000000", fontSize: 25, fontWeight: "bold" }}
            >
              {bookings}
            </Title>
            <Caption
              onPress={() => navigation.navigate("BookingHistory")}
              style={{ color: "#000000", fontSize: 15 }}
            >
              Bookings
            </Caption>
          </View>
          <View
            style={[
              styles.infoBox,
              {
                borderRightColor: "#dddddd",
                borderRightWidth: 1,
              },
            ]}
          >
            <Title
              style={{ color: "#000000", fontSize: 25, fontWeight: "bold" }}
            >
              {reviews}
            </Title>
            <Caption
              onPress={() => {}}
              style={{ color: "#000000", fontSize: 15 }}
            >
              Reviews
            </Caption>
          </View>

          <View style={styles.infoBox}>
            <Title
              style={{
                color: "#000000",
                fontSize: 25,
                flexWrap: "wrap",
                fontWeight: "bold",
              }}
            >
              {user.wallet} EGP
            </Title>
            <Caption
              onPress={() => {}}
              style={{ color: "#000000", fontSize: 15 }}
            >
              Wallet
            </Caption>
          </View>
        </View>

        <View style={styles.menuWrapper}>
          <TouchableRipple onPress={() => navigation.navigate("PayVoucher")}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons
                name="credit-card"
                color="#4b86b4"
                size={25}
              />
              <Text style={styles.menuItemText}>Pay Voucher Code</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => navigation.navigate("Voucher")}>
            <View style={styles.menuItem}>
              <MaterialCommunityIcons
                name="account-cash"
                color="#4b86b4"
                size={25}
              />
              <Text style={styles.menuItemText}>Add Voucher Code</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => navigation.navigate("ProfileEdit")}>
            <View style={styles.menuItem}>
              <Ionicons name="settings-outline" color="#4b86b4" size={25} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => handleLogout()}>
            <View style={styles.menuItem}>
              <Ionicons name="log-out-outline" color="#4b86b4" size={25} />
              <Text style={styles.menuItemText}>Sign out</Text>
            </View>
          </TouchableRipple>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    //backgroundColor: "#fff",
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    backgroundColor: "#e7eff6",
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 80,
  },
  infoBox: {
    width: "33.333333%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#777777",
    marginTop: 3,
    marginLeft: 10,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
