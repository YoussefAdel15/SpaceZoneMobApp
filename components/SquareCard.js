import react, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/core";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
const ProductCard = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  const screenWidth = Math.round(Dimensions.get("window").width);
  const cardWidth = screenWidth - 40;
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return null; // Render nothing until the font is loaded
  }
  return (
    <View
      style={{
        width: cardWidth / 2 - 5,
        marginBottom: 15,
        marginRight: 20,
        marginLeft: 3,
        borderRadius: 10 * 2,
        overflow: "hidden",
      }}
    >
      <BlurView
        tint="light"
        intensity={900}
        style={{
          padding: 10,
        }}
      >
        <TouchableOpacity
          style={{
            height: 150,
            width: "100%",
          }}
        >
          <Image
            source={require("../assets/images.jpg")}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10 * 2,
            }}
          />
          <View
            style={{
              position: "absolute",
              right: 0,
              borderBottomStartRadius: 10 * 3,
              borderTopEndRadius: 10 * 2,
              overflow: "hidden",
            }}
          >
            <BlurView
              tint="dark"
              intensity={70}
              style={{
                flexDirection: "row",
                padding: 10 - 2,
              }}
            >
              <Ionicons
                style={{
                  marginLeft: 10 / 2,
                }}
                name="star"
                color={"#FBBE21"}
                size={10 * 1.7}
              />
              <Text
                style={{
                  color: "white",
                  marginLeft: 10 / 2,
                  fontSize: 11,
                }}
              >
                4
              </Text>
            </BlurView>
          </View>
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={{
            color: "#2F2D2C",
            fontWeight: "600",
            fontSize: 10 * 1.7,
            marginTop: 10,
            marginBottom: 10 / 2,
          }}
        >
          Dokii Zone
        </Text>
        <Text
          numberOfLines={1}
          style={{ color: "#9B9B9B", fontSize: 10 * 1.2 }}
        >
          Shared Area
        </Text>
        <View
          style={{
            marginVertical: 10 / 2,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "#D17842",
                marginRight: 10 / 2,
                fontSize: 10 * 1.6,
              }}
            >
              $
            </Text>
            <Text style={{ color: "#2F4B4E", fontSize: 10 * 1.6 }}>5</Text>
          </View>
        </View>
      </BlurView>
    </View>
    // </TouchableOpacity>
  );
};

export default ProductCard;