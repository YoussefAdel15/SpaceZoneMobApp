import react, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";

const PlacesCard = ({ PlaceName, price, image, details, type, id }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity>
      <View
        style={{
          height: 170,
          width: 170,
          marginRight: 40,
          justifyContent: "center",
        }}
      >
        <Image
          style={{ width: 130, height: 100, alignContent: "center" }}
          source={image}
        />
        <Text>
          {PlaceName}
          {"\n"}price : {price} EGP
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PlacesCard;
