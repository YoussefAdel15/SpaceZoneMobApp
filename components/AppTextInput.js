import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Font from "expo-font";

const Input = ({
  label,
  iconName,
  error,
  password,
  passwordConfirmation,
  onFocus = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = useState(false); // Use a single state variable for password and confirmation
  const [isFocused, setIsFocused] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Sora-SemiBold": require("../assets/fonts/Sora-SemiBold.ttf"),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null; // Render nothing until the font is loaded
  }

  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={style.label}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error ? "red" : isFocused ? "#7978B5" : "#1F41BB",
            alignItems: "center",
            borderWidth: 1,
          },
        ]}
      >
        <Icon
          name={iconName}
          style={{ color: "#7978B5", fontSize: 22, marginRight: 10 }}
        />
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          {...((password || passwordConfirmation) && {
            secureTextEntry: !hidePassword,
          })}
          style={{ color: "#1C0A00", flex: 1 }}
          {...props}
        />
        {(password || passwordConfirmation) && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? "eye-off-outline" : "eye-outline"}
            style={{
              color: "#7978B5",
              fontSize: 22,
              fontFamily: "Sora-SemiBold",
            }}
          />
        )}
      </View>
      {error && (
        <Text
          style={{
            marginTop: 7,
            color: "red",
            fontSize: 12,
            fontFamily: "Sora-SemiBold",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: "#BABBC3",
  },
  inputContainer: {
    height: 55,
    backgroundColor: "#F3F4FB",
    flexDirection: "row",
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderRadius: 15,
  },
});

export default Input;
