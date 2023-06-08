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
} from "react-native";;
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Sizes from "../constants/Sizes";
import Colors from "../constants/colors";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function App({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [bookings, setBookings] = useState();

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
      console.log(currentUser);
      setUserName(currentUser.userName);
      setEmail(currentUser.email);
      setPhone(currentUser.number);
      setRole(currentUser.role);
      setBookings(currentUser.booking.length);
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
    // <>
    //   <ImageBackground
    //     style={styles.backgroundImage}
    //     source={require("../assets/Background.png")}
    //     // blurRadius={1}
    //   >
    //     <View
    //       style={{
    //         flexDirection: "row",
    //         justifyContent: "flex-end",
    //         paddingTop: 30,
    //         paddingRight: 10,
    //       }}
    //     >
    //       <View style={styles.icons}>
    //         <TouchableOpacity
    //           style={styles.setting}
    //           onPress={() => navigation.navigate("ProfileEdit")}
    //         >
    //           <AntDesign name="setting" size={35} color="white" />
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //     <View style={styles.container}>
    //       <View style={styles.container}>
    //         {loading ? (
    //           <ActivityIndicator size="large" color={Colors.primary} />
    //         ) : (
    //           <>
    //             <Image
    //               style={styles.profileImage}
    //               source={{
    //                 uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg",
    //               }}
    //             />
    //             <View
    //               style={{
    //                 flexDirection: "row",
    //                 justifyContent: "space-between",
    //               }}
    //             >
    //               <TouchableOpacity
    //                 onPress={() => navigation.navigate("BookingHistory")}
    //               >
    //                 <Text>Bookings : {bookings}</Text>
    //               </TouchableOpacity>
    //               <Text> | </Text>
    //               <Text>Reviews : 0</Text>
    //             </View>
    //             <Text style={styles.name}>{userName}</Text>
    //             <Text style={styles.bio}>{role}</Text>
    //             <View style={styles.infoContainer}>
    //               <AntDesign name="googleplus" size={24} />
    //               <Text style={styles.infoText}>{email}</Text>
    //             </View>
    //             <View style={styles.infoContainer}>
    //               <Entypo name="phone" size={24} />
    //               <Text style={styles.infoText}>{phone}</Text>
    //             </View>
    //             <TouchableOpacity
    //               style={styles.logoutButton}
    //               onPress={handleLogout}
    //             >
    //               <Text style={styles.logoutButtonText}>Logout</Text>
    //             </TouchableOpacity>
    //           </>
    //         )}
    //       </View>
    //     </View>
    //   </ImageBackground>
    // </>
    <ScrollView style={styles.scrollView}>
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 36 }}>
          <Avatar.Image  source={{
                   uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?cs=srgb&dl=pexels-pixabay-220453.jpg&fm=jpg",
                  }} size={60} />

          <View style={{ marginLeft: 5 }}>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 20,
                  marginBottom: 5,
                  color: "black",
                  fontSize: 25,
                  fontFamily:"Sora-SemiBold"
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
          <Icon name="phone" color="#777777" size={20} />
          <Text style={{ color: "#000000", marginLeft: 20,  }}>{phone}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20} />
          <Text style={{ color: "#000000", marginLeft: 20 , }}>{email}</Text>
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
          <Title onPress={() => navigation.navigate("BookingHistory")} style={{ color: "#000000",   }}>{bookings}</Title>
          <Caption onPress={() => navigation.navigate("BookingHistory")} style={{ color: "#000000", fontSize: 15,   }}>Bookings</Caption>
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
          <Title style={{color: "#000000",   }}>-</Title>
          <Caption style={{ color: "#000000", fontSize: 15,   }}>
            Reviews
          </Caption>
        </View>

        <View style={styles.infoBox}>
          <Title style={{ color: "#000000",   }}>-</Title>
          <Caption style={{ color: "#000000", fontSize: 15,   }}>
            Balance
          </Caption>
        </View>
      </View>

      <View style={styles.menuWrapper}>
    
        <TouchableRipple onPress={() => navigation.navigate("ProfileEdit")}>
          <View style={styles.menuItem}>
            <Ionicons name="settings-outline" color="#0096FF" size={25} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple>
      </View>

      <TouchableOpacity onPress={()=>handleLogout()}>
        <View style={styles.menuItem}>
          <Ionicons name="log-out-outline" color="#0096FF" size={25} />
          <Text style={styles.menuItemText}>Sign out</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  </ScrollView>

  );
}

// const styles = StyleSheet.create({
//   backgroundImage: {
//     flex: 1,
//     resizeMode: "cover",
//   },
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     marginBottom: 20,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   bio: {
//     fontSize: 16,
//     color: "#888",
//     marginBottom: 20,
//   },
//   infoContainer: {
//     flexDirection: "row",
//     marginBottom: 5,
//     alignItems: "center",
//   },
//   infoText: {
//     marginLeft: 10,
//   },
//   logoutButton: {
//     backgroundColor: Colors.primary,
//     borderRadius: 25,
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginTop: 20,
//   },
//   logoutButtonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   headerContainer: {
//     alignItems: 'center',
//   },
//   coverPhoto: {
//     width: '100%',
//     height: 200,
//   },
//   profileContainer: {
//     alignItems: 'center',
//     marginTop: -50,
//   },
//   profilePhoto: {
//     width: 120,
//     height: 120,
//     borderRadius: 50,
//   },
//   nameText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   bioContainer: {
//     padding: 15,
//   },
//   bioText: {
//     fontSize: 16,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//     marginBottom: 20,

//   },
//   statContainer: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statCount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginLeft:2
//   },
//   statLabel: {
//     fontSize: 16,
//     color: '#999',
//   },
//   button: {
//     backgroundColor: '#C67C4E',
//     borderRadius: 5,
//     marginHorizontal: 20,
//     padding: 21,
//     marginTop:50

    
//   },
//   buttonText: {
//     fontSize: 16,
//     color: '#fff',
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: 18,
//     color: 'black',
//     marginLeft: 4,
//   },
//   btn: {
//     marginLeft: 'auto',
//     width: 40,
//     height: 40,
//   },
//   box: {
//     padding: 5,
//     marginBottom: 2,
//     backgroundColor: '#FFFFFF',
//     flexDirection: 'row',
//     alignItems:'center',
//     borderColor:"black"
//   },
//   item: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },infoContent: {
//     flex: 1,
//     alignItems: 'flex-start',
//     paddingLeft: 5,
//   },
//   iconContent: {
//     flex: 1,
//     alignItems: 'flex-end',
//     paddingRight: 5,
//   },
//   icon: {
//     width: 30,
//     height: 30,
//     marginTop: 20,
//   },
//   info: {
//     fontSize: 18,
//     marginTop: 20,
//     color: 'black',
//   },
//   infoContainer: {
//     marginTop: 10,
//     marginLeft:10,
//   },
//   infoLabel: {
//     fontWeight: 'bold',
    
//   },
//   infoValue: {
//     marginTop: 5,
//   },
//   menuItemTextt: {
//     color: "#fff",
//     marginLeft: 5,
//     fontWeight: "700",
//     fontSize: 16,
//     lineHeight: 26,
   
    
//   },
//   menuItemText: {
//     color: "black",
//     marginLeft: 20,
//     fontWeight: "600",
//     fontSize: 16,
//     lineHeight: 26,
    
//   },
//   menuWrapper: {
//     marginTop: 10,
//     marginLeft:20
//   },
//   menuItem: {
//     flexDirection: "row",
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//   },

// });
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
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontFamily:"Sora-SemiBold"   },
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
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
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
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,  
  },
});

