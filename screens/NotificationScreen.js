import { StyleSheet, Text, SafeAreaView } from "react-native";
import React from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BackgroundWrapper from "../BackgroundWrapper";
import { Video } from "expo-av";
import styles from "../styles/NotificationStyles";

const Notification = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Your Notifications",
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
      },
      headerStyle: {
        backgroundColor: "#003580",
        height: 110,
        borderBottomColor: "transparent",
        shadowColor: "transparent",
      },
      headerTintColor: "white",
    });
  }, []);

  return (
    <BackgroundWrapper>
      <SafeAreaView style={styles.messageContainer}>
        <Video
          source={require("../assets/bell.mp4")}
          style={styles.video}
          resizeMode="cover"
          isLooping
          shouldPlay
        />
        <Text style={styles.headerText}>You don't have any notifications</Text>
        <Text style={styles.messageText}>
          Notifications let you quickly take action on upcoming or current
          bookings.
        </Text>
      </SafeAreaView>
    </BackgroundWrapper>
  );
};

export default Notification;

