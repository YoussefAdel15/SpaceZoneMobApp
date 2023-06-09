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
  ScrollView,
  Modal,
} from "react-native";
import Colors from "../constants/colors";
import { useRoute, useIsFocused } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { Dimensions } from "react-native";

const window = Dimensions.get("window");
const screenHeight = window.height;
const screenWidth = window.width;

const SurfScreen = ({ navigation }) => {
  const route = useRoute();
  const { data } = route.params || {};
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState([]);
  const [selectedZone, setSelectedZone] = useState("");
  const [priceRange, setPriceRange] = useState({ minPrice: "", maxPrice: "" });
  const [selectedType, setSelectedType] = useState("");
  const [rate, setRate] = useState(0);

  const fetchSurfData = async () => {
    setLoading(true);
    let url = "https://spacezone-backend.onrender.com/api/places/getAllPlaces";
    //filters = ["Zone", "price", "rate", "numberOfSeats", "amenities", "Type"];
    if (filters.length > 0) {
      // If there are filters, add a question mark
      url += "?";
    }
    if (filters.includes("Zone")) {
      // Zone filter is selected
      if (filters.length > 1) {
        // If there are other filters, add an ampersand
        url += "&";
      } else {
        // If there are no other filters, add nothing
        url += "";
      }
      url += `zone=${selectedZone}`;
    }
    if (
      filters.includes("price") &&
      priceRange.minPrice !== "" &&
      priceRange.maxPrice !== ""
    ) {
      // Price filter is selected
      console.log("price range", priceRange);
      if (filters.length > 1) {
        url += "&";
      } else {
        url += "";
      }
      url += `hourPrice[gte]=${priceRange.minPrice}&hourPrice[lte]=${priceRange.maxPrice}`;
    }
    if (filters.includes("rate")) {
      // Rate filter is selected
      if (filters.length > 1) {
        url += "&";
      } else {
        url += "";
      }
      url += `rating=${rate}`;
    }
    if (filters.includes("numberOfSeats")) {
      // Number of seats filter is selected
      if (filters.length > 1) {
        url += "&";
      } else {
        url += "";
      }
      if (priceRange.minPrice !== "" && priceRange.maxPrice !== "")
        url += `numberOfSeats[gte]=${priceRange.minPrice}&numberOfSeats[lte]=${priceRange.maxPrice}`;
      else if (priceRange.minPrice !== "")
        url += `numberOfSeats[gte]=${priceRange.minPrice}`;
      else if (priceRange.maxPrice !== "")
        url += `numberOfSeats[lte]=${priceRange.maxPrice}`;
    }
    if (filters.includes("Type")) {
      // Type filter is selected
      if (filters.length > 1) {
        url += "&";
      } else {
        url += "";
      }
      if (selectedType === "Shared Area") {
        url += `numberOfSeats[gte]=1`;
      } else if (selectedType === "Silent Room") {
        url += `numberOfSilentSeats[gte]=1`;
      } else if (selectedType === "Training Room") {
        url += `numberOfTrainingRooms[gte]=1`;
      } else if (selectedType === "Meeting Room"){
        url += `numberOfMeetingRooms[gte]=1`;
      }
    }
    if(selectedType === "Meeting Room"){
      url += `numberOfMeetingSeats[gte]=1`;
    }
    try {
      const response = await axios.get(url);
      setPlaces(response.data.data.places);
    } catch (error) {
      console.log("Error fetching surf data:", error);
    }
    setLoading(false);
  };

  const FilterList = ({ onZoneFilterChange }) => {
    const [showModal, setShowModal] = useState(false);
    const [zones, setZones] = useState([
      "Dokii",
      "Mohandeseen",
      "Cairo",
      "Nasr City",
      "Giza",
      "Sheikh Zayed",
      "Heliopolis",
      "New Cairo",
      "Omranyah",
      "6th October",
      // Add more zones as needed
    ]);
    const [types, setTypes] = useState([
      "Shared Area",
      "Silent Room",
      "Training Room",
      "Meeting Room",
      // Add more zones as needed
    ]);
    const handleFilterSelect = (filter) => {
      if (filters.includes(filter)) {
        setFilters(filters.filter((f) => f !== filter));
        setSelectedZone(""); // Reset selected zone when unchecking the filter
      } else {
        setFilters([...filters, filter]);
      }
    };

    const handlePriceChange = (field, value) => {
      setPriceRange((prevRange) => ({
        ...prevRange,
        [field]: value,
      }));
    };
    const handleRateChange = (rate) => {
      setRate(rate);
    };

    const handleZoneSelect = (zone) => {
      setSelectedZone(zone);
      setShowModal(false);
    };

    const handleTypeSelect = (type) => {
      setSelectedType(type);
      setShowModal(false);
    };

    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filters:</Text>
        <ScrollView
          horizontal
          contentContainerStyle={styles.filterScrollViewContent}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.includes("price") && styles.selectedFilterButton,
            ]}
            onPress={() => handleFilterSelect("price")}
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.includes("price") && styles.selectedFilterButtonText,
              ]}
            >
              Price
            </Text>
          </TouchableOpacity>
          {filters.includes("price") && (
            <View style={styles.priceRangeContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min Price"
                value={priceRange.minPrice}
                onChangeText={(value) => handlePriceChange("minPrice", value)}
                keyboardType="numeric"
              />
              <Text style={styles.priceRangeSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Max Price"
                value={priceRange.maxPrice}
                onChangeText={(value) => handlePriceChange("maxPrice", value)}
                keyboardType="numeric"
              />
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.includes("Zone") && styles.selectedFilterButton,
            ]}
            onPress={() => handleFilterSelect("Zone")}
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.includes("Zone") && styles.selectedFilterButtonText,
              ]}
            >
              Zone
            </Text>
          </TouchableOpacity>
          {filters.includes("Zone") && (
            <View style={styles.zoneContainer}>
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  style={styles.zoneInput}
                  onPress={() => setShowModal(true)}
                >
                  <Text>{selectedZone ? selectedZone : "Select Zone"}</Text>
                </TouchableOpacity>

                {/* Zone Modal */}
                <Modal visible={showModal} animationType="slide" transparent>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Select Zone</Text>
                      <FlatList
                        data={zones}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleZoneSelect(item)}
                          >
                            <Text>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                      <TouchableOpacity
                        style={styles.btnCloseModal}
                        onPress={() => setShowModal(false)}
                      >
                        <Text style={styles.btnCloseModalText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.includes("rate") && styles.selectedFilterButton,
            ]}
            onPress={() => handleFilterSelect("rate")}
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.includes("rate") && styles.selectedFilterButtonText,
              ]}
            >
              Rate
            </Text>
          </TouchableOpacity>
          {filters.includes("rate") && (
            <View style={styles.priceRangeContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Rate"
                value={rate}
                onChangeText={(value) => handleRateChange(value)}
                keyboardType="numeric"
              />
              <Text style={styles.priceRangeSeparator}>-</Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.includes("numberOfSeats") && styles.selectedFilterButton,
            ]}
            onPress={() => handleFilterSelect("numberOfSeats")}
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.includes("numberOfSeats") &&
                  styles.selectedFilterButtonText,
              ]}
            >
              Number Of Seats
            </Text>
          </TouchableOpacity>
          {filters.includes("numberOfSeats") && (
            <View style={styles.priceRangeContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min Seats"
                value={priceRange.minPrice}
                onChangeText={(value) => handlePriceChange("minPrice", value)}
                keyboardType="numeric"
              />
              <Text style={styles.priceRangeSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Max Seats"
                value={priceRange.maxPrice}
                onChangeText={(value) => handlePriceChange("maxPrice", value)}
                keyboardType="numeric"
              />
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.filterButton,
              filters.includes("Type") && styles.selectedFilterButton,
            ]}
            onPress={() => handleFilterSelect("Type")}
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.includes("Type") && styles.selectedFilterButtonText,
              ]}
            >
              Room Type
            </Text>
          </TouchableOpacity>
          {filters.includes("Type") && (
            <View style={styles.zoneContainer}>
              <View style={styles.filterContainer}>
                <TouchableOpacity
                  style={styles.zoneInput}
                  onPress={() => setShowModal(true)}
                >
                  <Text>{selectedType ? selectedType : "Select Type"}</Text>
                </TouchableOpacity>

                {/* Type Modal */}
                <Modal visible={showModal} animationType="slide" transparent>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Select Room Type</Text>
                      <FlatList
                        data={types}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleTypeSelect(item)}
                          >
                            <Text>{item}</Text>
                          </TouchableOpacity>
                        )}
                      />
                      <TouchableOpacity
                        style={styles.btnCloseModal}
                        onPress={() => setShowModal(false)}
                      >
                        <Text style={styles.btnCloseModalText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          )}
          {/* Add more filters as needed */}
        </ScrollView>
      </View>
    );
  };

  const PlaceCard = ({ place }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          console.log(place._id);
          navigation.navigate("PlaceDetails", { data: place._id });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "98%",
            marginLeft: "1%",
            marginTop: "1%",
            backgroundColor: "#fff",
            borderRadius: 10,
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Image
            source={{ uri: place.placePhotos[0] }}
            style={{
              width: 120,
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

              marginRight: 20,
              marginTop: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 17.5,
                  width: 200,
                  fontWeight: "bold",
                  color: "#444c55",
                }}
              >
                {place.placeName}
              </Text>
              <Text style={{ fontSize: 14, color: "grey", marginTop: 4 }}>
                Hourly Price:{place.hourPrice}
              </Text>
              <Text style={{ fontSize: 14, color: "grey", marginTop: 4 }}>
                {place.zone}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    return <PlaceCard place={item} />;
  };

  useEffect(() => {
    fetchSurfData();
  }, [selectedZone, priceRange, filters , selectedType]);

  return (
    <View style={styles.containerL}>
      <View style={styles.containerS}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
            marginTop: "5%",
          }}
        >
          <TextInput
            style={styles.searchInput}
            placeholder="Do You Know The Place Name?"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              console.log(searchQuery);
              handleSearch();
            }}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <FilterList />
      </View>
      <View style={styles.container}>
        <View>
          {places.length > 0 ? (
            <FlatList
              style={{ width: "100%" }}
              data={places}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item._id}
            />
          ) : (
            <Spinner
              visible={loading}
              textStyle={{ color: Colors.primary }}
              overlayColor={Colors.overlay}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = {
  containerS: {
    height: screenHeight * 0.2,
    width: screenWidth,
    backgroundColor: "rgba(173,203,227, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "3%",
  },
  filterList: {
    flexDirection: "row",
  },
  container: {
    height: "79%",
    width: "100%",
  },
  containerL: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  searchInput: {
    width: "70%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 40,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: "rgba(99,172,229,0.8)",
    width: "auto",
    height: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 40,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    alignItems: "center",
    marginTop: 4,
    width: "100%",
  },
  cardContainer: {
    borderRadius: 10,
    width: "100%",
    alignSelf: "center",
    marginBottom: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardImage: {
    height: 100,
    width: 150,
  },
  cardDetails: {
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  priceRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  priceInput: {
    width: 80,
    height: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 5,
    marginLeft: 5,
  },
  filterContainer: {
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    paddingHorizontal: 10,
    // Allow filters to wrap to the next row
  },
  filterTitle: {
    fontWeight: "bold",
    width: 50, // Adjust the width as needed
    marginRight: 5,
  },
  filterScrollViewContent: {
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: "#6fa8dc",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    marginRight: 5,
  },
  selectedFilterButton: {
    backgroundColor: "#1e90ff",
  },
  filterButtonText: {
    color: "#fff",
  },
  selectedFilterButtonText: {
    fontWeight: "bold",
  },
  priceRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    width: 100,
    height: 30,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 5,
    marginRight: 5,
  },
  priceRangeSeparator: {
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  btnCloseModal: {
    marginTop: 20,
    backgroundColor: "#3498db",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnCloseModalText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  priceRangeSlider: {
    flex: 1,
    marginHorizontal: 10,
  },
  // button: {
  //   padding: 10,
  //   backgroundColor: "lightblue",
  //   borderRadius: 5,
  //   marginBottom: 10,
  // },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent2: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
  },
};

export default SurfScreen;
