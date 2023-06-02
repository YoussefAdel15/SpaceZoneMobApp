import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const ProfilePage = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [isUpdateInfoVisible, setUpdateInfoVisible] = useState(false);
  const [isDeleteAccountVisible, setDeleteAccountVisible] = useState(false);
  const [isVerifyPhoneVisible, setVerifyPhoneVisible] = useState(false);
  const [isPhoneCallSelected, setPhoneCallSelected] = useState(false);
  const [isSMSSelected, setSMSSelected] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationCodeInputs, setShowVerificationCodeInputs] =
    useState(false);
  const [isHelpVisible, setHelpVisible] = useState(false);
  const [expandedFAQs, setExpandedFAQs] = useState([]);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isContactUsVisible, setContactUsVisible] = useState(false);

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
      setPhoneNumber(currentUser.number);
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

  const handleChangePassword = () => {
    // Perform validation and submit password change request to the server
    if (newPassword !== confirmPassword) {
      console.log("New password and confirm password do not match");
      return;
    }

    console.log("Password change request submitted");
    // Make API request to change the password using the password and newPassword
  };

  const handleUpdatePersonalInfo = () => {
    // Update user's personal information
    // Make API request to update the user's personal information using the name and email
  };

  const handleDeleteAccount = async () => {
    const token = await retrieveData("token");
    const userId = await retrieveData("userID");
    // Perform necessary actions to delete the user's account
    console.log("Account deletion request submitted");
    await axios
      .delete(
        `https://spacezone-backend.cyclic.app/api/user/deleteUser/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.status === "Success") navigation.navigate("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVerifyPhone = async () => {
    const token = await retrieveData("token");
    // Perform verification based on the selected option (phone call or SMS)
    if (isPhoneCallSelected) {
      console.log("Sending verification code via phone call");
      axios.post(
        "https://spacezone-backend.cyclic.app/api/user/phone/send-otp",
        {
          phoneNumber: phoneNumber,
          method: "call",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Make API request to send verification code via phone call
    } else if (isSMSSelected) {
      axios.post(
        "https://spacezone-backend.cyclic.app/api/user/phone/send-otp",
        {
          phoneNumber: phoneNumber,
          method: "sms",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Sending verification code via SMS");
      // Make API request to send verification code via SMS
    }

    // Show the verification code inputs
    setShowVerificationCodeInputs(true);
  };

  // Function to toggle the expanded state of an FAQ
  const toggleFAQ = (index) => {
    if (expandedFAQs.includes(index)) {
      // FAQ is expanded, collapse it
      setExpandedFAQs(expandedFAQs.filter((item) => item !== index));
    } else {
      // FAQ is collapsed, expand it
      setExpandedFAQs([...expandedFAQs, index]);
    }
  };

  const faqs = [
    {
      question: "How do I update my personal information?",
      answer:
        "To update your personal information, go to the Update Personal Information section and enter your name and email. Then, click the 'Update Personal Info' button.",
    },
    {
      question: "How can I change my password?",
      answer:
        "To change your password, go to the Change Password section. Enter your current password, new password, and confirm the new password. Finally, click the 'Change Password' button.",
    },
    {
      question: "How do I verify my phone number?",
      answer:
        "To verify your phone number, go to the Verify Phone Number section. Select whether you want to receive the verification code via phone call or SMS. Then, click the 'Send Verification Code' button. Enter the verification code and click the 'Verify Phone Number' button.",
    },
    {
      question: "How do I sign up for an account?",
      answer:
        "To sign up for an account, open the app and click on the 'Sign Up' button. Fill in the required information such as your name, email, and password. Finally, click 'Sign Up' to create your account.",
    },
    {
      question: "How can I browse available working spaces?",
      answer:
        "To browse available working spaces, navigate to the Surf page in the app. Here, you can view a list of all the working spaces. You can also apply filters to narrow down the search results based on location, amenities, and other criteria.",
    },
    {
      question: "What types of rooms are available in the working spaces?",
      answer:
        "The working spaces offer various types of rooms to cater to different needs. These include shared areas, silent rooms, meeting rooms, and training rooms. Each type of room provides a different environment and facilities.",
    },
    {
      question: "How do I check the availability of a room?",
      answer:
        "To check the availability of a room, select the working space you are interested in. Then, choose the type of room you prefer. After that, specify the desired date and start/end time for your booking. The app will display the availability of the room during that period.",
    },
    {
      question: "How do I make a booking?",
      answer:
        "Once you have checked the availability of a room, you can proceed to make a booking. Select the desired date, start time, and end time for your booking. Provide any additional details required, and confirm your booking. You will receive a confirmation message with the booking details.",
    },
    {
      question: "Can I modify or cancel a booking?",
      answer:
        "Yes, you can modify or cancel a booking. Open the app and navigate to the 'My Bookings' section. Here, you can view your upcoming bookings and make modifications or cancellations if allowed. Please note that there may be certain limitations or penalties depending on the cancellation policy.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "If you need any assistance or have any questions, you can contact our customer support team by sending an email to \nspacezonemailer@gmail.com \nor by calling sending your request through ContactUs. Our support team will be happy to assist you.",
    },
    // Add more FAQs as needed
  ];

  const handleSendContactMessage = () => {
    // Validate the contact form inputs and send the contact message
    if (!contactName || !contactEmail || !contactPhone || !contactMessage) {
      console.log("Please fill in all the contact form fields");
      return;
    }

    console.log("Contact message sent");
    // Make API request to send the contact message using the contact form inputs
  };

  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require("../assets/Background.png")}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setUpdateInfoVisible(!isUpdateInfoVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Update Personal Information</Text>
            <AntDesign name="user" size={24} color="black" />
          </TouchableOpacity>
          {isUpdateInfoVisible && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleUpdatePersonalInfo}
              >
                <Text style={styles.buttonText}>Update Personal Info</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={() => setChangePasswordVisible(!isChangePasswordVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Change Password</Text>
            <Entypo name="lock" size={24} color="black" />
          </TouchableOpacity>
          {isChangePasswordVisible && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={() => setVerifyPhoneVisible(!isVerifyPhoneVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Verify Phone Number</Text>
            <FontAwesome5 name="phone" size={24} color="black" />
          </TouchableOpacity>
          {isVerifyPhoneVisible && (
            <>
              <Text style={styles.confirmationText}>
                We Will Send You A Verification Code To Your Phone Number{" "}
                {phoneNumber} To Verify Your Account And To Be Able To Book A
                Room In Our App Please Select The Way You Want To Receive The
                Code :
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setPhoneCallSelected(true);
                  setSMSSelected(false);
                }}
                style={[
                  styles.optionButton,
                  isPhoneCallSelected && styles.selectedOptionButton,
                ]}
              >
                <Text style={styles.optionButtonText}>Phone Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setPhoneCallSelected(false);
                  setSMSSelected(true);
                }}
                style={[
                  styles.optionButton,
                  isSMSSelected && styles.selectedOptionButton,
                ]}
              >
                <Text style={styles.optionButtonText}>SMS</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleVerifyPhone}
              >
                <Text style={styles.buttonText}>Send Verification Code</Text>
              </TouchableOpacity>

              {showVerificationCodeInputs && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Verification Code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      // Perform verification code validation and submit request to the server
                      console.log("Verification code submitted");
                    }}
                  >
                    <Text style={styles.buttonText}>Verify Phone Number</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
          <TouchableOpacity
            onPress={() => setDeleteAccountVisible(!isDeleteAccountVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Delete My Account</Text>
            <AntDesign name="deleteuser" size={24} color="black" />
          </TouchableOpacity>
          {isDeleteAccountVisible && (
            <>
              <Text style={styles.confirmationText}>
                Are you sure you want to delete your account? This action is
                irreversible.
              </Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "red" }]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
            </>
          )}
          {/* Help and FAQ Section */}
          <TouchableOpacity
            onPress={() => setHelpVisible(!isHelpVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Help and FAQs</Text>
            <AntDesign name="questioncircle" size={24} color="black" />
          </TouchableOpacity>
          {isHelpVisible && (
            <View style={styles.faqContainer}>
              <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
              {faqs.map((faq, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleFAQ(index)}
                  style={styles.faqItem}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  {expandedFAQs.includes(index) && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* Contact Us Section */}
          <TouchableOpacity
            onPress={() => setContactUsVisible(!isContactUsVisible)}
            style={styles.section}
          >
            <Text style={styles.title}>Contact Us</Text>
            <FontAwesome5 name="envelope" size={24} color="black" />
          </TouchableOpacity>
          {isContactUsVisible && (
            <View style={styles.contactUsContainer}>
              <Text style={styles.contactUsTitle}>Contact Us</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={contactName}
                onChangeText={setContactName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={contactEmail}
                onChangeText={setContactEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={contactPhone}
                onChangeText={setContactPhone}
              />
              <TextInput
                style={[styles.input, styles.contactMessageInput]}
                placeholder="Message"
                value={contactMessage}
                onChangeText={setContactMessage}
                multiline
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSendContactMessage}
              >
                <Text style={styles.buttonText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
  },
  confirmationText: {
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "gray",
    marginBottom: 10,
  },
  selectedOptionButton: {
    backgroundColor: "gray",
  },
  optionButtonText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  faqContainer: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  faqAnswer: {
    fontSize: 14,
  },
  contactUsContainer: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  contactUsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactMessageInput: {
    height: 100,
  },
});

export default ProfilePage;
