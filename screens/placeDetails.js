import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
// import Carousel from "react-native-snap-carousel";
import Colors from "../constants/colors";
import { Dimensions } from "react-native";
import { FontAwesome } from "react-native-vector-icons";
import { SliderBox } from "react-native-image-slider-box";
// import { ImageSlider } from "react-native-image-slider-box";

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
            color={Colors.primary}
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
    <ImageBackground
      style={styles.backgroundImage}
      source={require("../assets/Background.png")}
    >
      <View style={styles.container}>
        <Text style={styles.title}>{placeData.placeName}</Text>
        {/* <View style={styles.carouselContainer}>
            <Carousel
              data={placeData.placePhotos}
              renderItem={renderImageItem}
              sliderWidth={screenWidth}
              itemWidth={screenWidth}
              layout={"default"}
              inactiveSlideOpacity={0.7}
              inactiveSlideScale={0.9}
            />
          </View> */}
        <View style={styles.carouselContainer}>
          {placeData.placePhotos && placeData.placePhotos.length > 0 ? (
            <SliderBox
              images={placeData.placePhotos}
              sliderBoxHeight={screenHeight * 0.4}
              dotColor={Colors.primary}
              inactiveDotColor={Colors.inactiveDot}
            />
          ) : null}
        </View>
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
            <Text style={styles.sectionTitle}>Shared Area</Text>
            <View style={styles.sharedAreaCard}>
              <Text style={styles.roomDescription}>
                Number Of Seats: {placeData.numberOfSeats}
              </Text>
              {/* Add more shared area details as needed */}
            </View>
            {placeData.numberOfSilentSeats > 0 && placeData.silentSeats && (
              <View>
                <Text style={styles.sectionTitle}>Silent Room</Text>
                <View style={styles.sharedAreaCard}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={{ uri: placeData.silentRoomPhotos[0] }}
                      style={{
                        width: 150,
                        height: 120,
                        resizeMode: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        marginLeft: 10,
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Text style={styles.roomTitle}>
                        A silent Place where you can study
                      </Text>

                      <Text style={styles.roomDescription}>
                        Number Of Seats: {placeData.numberOfSilentSeats}
                      </Text>
                      <Text style={styles.roomDescription}>
                        Hour Price: {placeData.silentSeatPrice} EGP/Hour
                      </Text>
                    </View>
                  </View>
                  {/* Add more shared area details as needed */}
                </View>
              </View>
            )}
            {placeData.rooms && placeData.rooms.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Rooms</Text>
                <View style={styles.roomCardsContainer}>
                  {placeData.rooms.map((room, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        navigation.navigate("RoomDetails", {
                          placeId: placeData._id,
                          roomId: room._id,
                          roomDetails: room,
                        });
                      }}
                      style={[
                        styles.roomCard,
                        index % 2 === 1 && styles.roomCardEven, // Apply additional style for even index
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
                          Number Of Seats: {room.seats}
                        </Text>
                        {/* Add more room details as needed */}
                      </View>
                    </TouchableOpacity>
                  ))}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  carouselContainer: {
    height: screenHeight * 0.4,
    marginBottom: 16,
  },
  carouselImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    paddingTop: 16,
    color: Colors.primary,
    textAlign: "center",
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
    padding: 16,
    marginBottom: 16,
    width: "100%",
    height: 150,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: Colors.primary,
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
    marginBottom: 16,
    justifyContent: "space-between",
  },
  roomCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: screenWidth * 0.4,
    overflow: "hidden",
    marginLeft: 8,
    marginRight: 8,
  },
  roomImage: {
    width: "100%",
    height: 150,
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
    marginLeft: 10, // Additional margin for even index cards to create spacing
  },
});

export default PlaceDetailsPage;
