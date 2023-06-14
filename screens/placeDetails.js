import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Colors from "../constants/colors";
import { Dimensions } from "react-native";
import { FontAwesome } from "react-native-vector-icons";
import { SliderBox } from "react-native-image-slider-box";

const window = Dimensions.get("window");
const screenHeight = window.height;
const screenWidth = window.width;

const PlaceDetailsPage = ({ route, navigation }) => {
  const { data } = route.params;
  const [placeData, setPlaceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchPlaceData();
    fetchPlaceReviews();
  }, []);

  const fetchPlaceData = async () => {
    setLoading(true);
    const decodedData = decodeURIComponent(data);
    try {
      const response = await axios.get(
        `https://spacezone-backend.cyclic.app/api/places/${decodedData}`
      );
      setPlaceData(response.data.data);
      setRating(response.data.data.rating);
    } catch (error) {
      console.log("Error fetching place data:", error);
    }
    setLoading(false);
  };

  const fetchPlaceReviews = async () => {
    const decodedData = decodeURIComponent(data).replace("%7D", "");
    console.log(decodedData);
    console.log(data);
    try {
      const response = await axios.get(
        `https://spacezone-backend.cyclic.app/api/places/getFeedBacks/${decodedData}`
      );
      console.log(response.data.data);
      setReviews(response.data.data);
      console.log(response.data.data[0].userName);
    } catch (error) {
      console.log("Error fetching Reviews data:", error);
    }
  };

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} />
  );

  const renderRatingStars = (rating) => {
    const filledStars = Math.floor(rating);
    const halfFilledStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (halfFilledStar ? 1 : 0);

    return (
      <View style={styles.ratingContainer}>
        {[...Array(filledStars)].map((_, index) => (
          <FontAwesome
            name="star"
            size={20}
            color={Colors.rating}
            key={`filled-star-${index}`}
            style={styles.starIcon}
          />
        ))}
        {halfFilledStar && (
          <FontAwesome
            name="star-half-full"
            size={20}
            color={Colors.primary}
            style={styles.starIcon}
          />
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <FontAwesome
            name="star-o"
            size={20}
            color={Colors.primary}
            key={`empty-star-${index}`}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  const ReviewCard = ({ review }) => {
    return (
      <View style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.reviewAuthor}>{review.userName}</Text>
            <View style={styles.ratingContainer}>
              {renderRatingStars(review.feedbackNumber)}
            </View>
          </View>
        </View>
        <Text style={styles.reviewText}>{review.feedbackText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        {placeData.placePhotos && placeData.placePhotos.length > 0 ? (
          <SliderBox
            images={placeData.placePhotos}
            sliderBoxHeight={screenHeight * 0.3}
            dotColor={Colors.primary}
            inactiveDotColor={Colors.inactiveDot}
          />
        ) : null}
      </View>
      <Text style={styles.title}>{placeData.placeName}</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>{placeData.description}</Text>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>Address: {placeData.address}</Text>
        </View>
        <Text style={styles.contact}>Contact: {placeData.number}</Text>
        {placeData.feedbacks && (
          <View style={styles.ratingContainer}>
            {renderRatingStars(rating)}
          </View>
        )}
        <View style={styles.roomCardsContainer}>
          {placeData.numberOfSeats > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Shared Area</Text>
              <TouchableOpacity 
                onPress={() => {
                  navigation.navigate("SharedArea", {
                    sharedroomId: placeData._id,
                    sharedplaceId: room._id,
                    sharedroomDetails: room,
                  });
                }}>
                <View style={styles.sharedAreaCard}>
                  <View style={{ flexDirection: "row", overflow: "hidden" }}>
                    {placeData.sharedAreaPhotos && (
                      <Image
                        source={{ uri: placeData.sharedAreaPhotos[0] }}
                        style={{
                          width: 150,
                          height: 130,
                          resizeMode: "cover",
                          borderRadius: 8,
                        }}
                      />
                    )}
                    <View style={{ flexDirection: "column", marginLeft: 10 }}>
                      <Text style={[styles.roomTitle, { width: 200 }]}>
                        <Text style={{ flexWrap: "wrap" }}>
                          A Shared Place where you can study with others
                        </Text>
                      </Text>
                      <Text style={styles.roomDescription}>
                        {placeData.numberOfSeats} Seat 
                      </Text>
                      <Text style={styles.roomDescription}>
                        Hour Price: {placeData.hourPrice} EGP/Hour
                      </Text>
                    </View>
                  </View>
                  {/* Add more shared area details as needed */}
                </View>
              </TouchableOpacity>
            </View>
          )}
          {placeData.numberOfSilentSeats > 0 && placeData.silentSeats && (
            <View>
              <Text style={styles.sectionTitle}>Silent Room</Text>
              <TouchableOpacity >
                <View style={styles.sharedAreaCard}>
                  <View style={{ flexDirection: "row", overflow: "hidden" }}>
                    <Image
                      source={{ uri: placeData.silentRoomPhotos[0] }}
                      style={{
                        width: 150,
                        height: 130,
                        resizeMode: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <View style={{ flexDirection: "column", marginLeft: 10 }}>
                      <Text style={[styles.roomTitle, { width: 200 }]}>
                        <Text style={{ flexWrap: "wrap" }}>
                          A silent Place where you can study
                        </Text>
                      </Text>
                      <Text style={styles.roomDescription}>
                        {placeData.numberOfSilentSeats} Seat
                      </Text>
                      <Text style={styles.roomDescription}>
                        Hour Price: {placeData.silentSeatPrice} EGP/Hour
                      </Text>
                    </View>
                  </View>
                  {/* Add more shared area details as needed */}
                </View>
              </TouchableOpacity>
            </View>
          )}
          {placeData.rooms && placeData.rooms.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Rooms</Text>
              <View style={styles.roomCardsContainer}>
                <FlatList
                  scrollEnabled={false}
                  data={placeData.rooms}
                  keyExtractor={(room, index) => index.toString()}
                  numColumns={2}
                  renderItem={({ item: room, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("RoomDetails", {
                          placeId: placeData._id,
                          roomId: room._id,
                          roomDetails: room,
                        });
                      }}
                      style={[
                        styles.roomCard,
                        index % 2 === 0 ? styles.roomCardEven : null,
                      ]}
                    >
                      <Image
                        source={{ uri: room.roomPhotos[0] }}
                        style={styles.roomImage}
                      />
                      <View style={styles.roomCardContent}>
                        <Text style={styles.roomTitle}>
                          {room.roomType} {room.roomNumber}
                        </Text>
                        <Text style={styles.roomDescription}>
                         {room.seats} Seat
                        </Text>
                        {/* Add more room details as needed */}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </>
          )}
        </View>
        {reviews && reviews.length > 0 && (
          <>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 8,
                color: Colors.primary,
                marginTop: 16,
              }}
            >
              Reviews
            </Text>
            {reviews.map((reviews, index) => (
              <ReviewCard review={reviews} key={`reviews-${index}`} />
            ))}
          </>
        )}

        <Spinner
          visible={loading}
          textStyle={{ color: Colors.primary }}
          overlayColor={Colors.overlay}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    height: "70px",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  carouselContainer: {
    height: screenHeight * 0.3,
    marginBottom: 4,
  },
  carouselImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    borderRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    textAlign: "left",
    paddingTop: 14,
    color: Colors.primary,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    color: Colors.text,
  },
  addressContainer: {
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.text,
  },
  contact: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.text,
  },
  roomCardsContainer: {
    marginTop: 16,
    width: "100%",
  },
  sharedAreaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    width: "100%",
    height: 150,
  },
  roomDescription: {
    fontSize: 14,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  roomCardContainer: {
    alignItems: "space-between",
    marginBottom: 20,
    justifyContent: "space-between",
  },

  roomCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: screenWidth * 0.4,
    overflow: "hidden",
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 16,
  },
  roomImage: {
    padding: 10,
    width: "100%",
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: "cover",
  },
  roomCardContent: {
    padding: 12,
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary,
    overflow: "hidden",
  },
  roomDescription: {
    fontSize: 14,
    color: Colors.text,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 4,
  },
  reviewCard: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  reviewText: {
    fontSize: 14,
  },
  roomCardEven: {
    marginLeft: 10,
    // Additional margin for even index cards to create spacing
  },
});

export default PlaceDetailsPage;
