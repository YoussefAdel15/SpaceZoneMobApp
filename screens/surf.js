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
import { useRoute } from "@react-navigation/native";
import PlacesCard from "../components/placesCards";

const SurfScreen = () => {
  const route = useRoute();
  const { data } = route.params;
  const [data2, setData2] = useState(data);

  useEffect(() => {
    shownData();
  }, [data]);

  const shownData = async () => {
    if (!data) {
      await axios
        .get(`https://spacezone-backend.cyclic.app/api/places/getAllPlaces`)
        .then((response) => {
          console.log(response.data);
          setData2(response.data);
        });
    } else {
      setData2(data);
    }
    console.log(data2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerS}>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
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
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerL}>
        <Image
          style={{ height: 100, width: 100 }}
          source={data.places[0].placePhotos[0]}
        />
        <Text>{data.places[0].placeName}</Text>
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
    // paddingLeft: 5,
  },
  searchButton: {
    backgroundColor: "red",
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
};

export default SurfScreen;
