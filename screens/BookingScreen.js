import { StyleSheet, Text, View, SafeAreaView, Pressable, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { db, auth } from "../firebase";
import { collection, query, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import BackgroundWrapper from "../BackgroundWrapper";
import { Video } from "expo-av";
import styles from "../styles/BookingStyles";

const BookingScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Bookings",
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
    });
  }, [navigation]);

  useEffect(() => {
    if (!auth.currentUser) {
      setIsLoading(false); 
      return;
    }

    const uid = auth.currentUser.uid;
    const bookingsRef = collection(db, "users", uid, "bookings");
    const q = query(bookingsRef);

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const bookingsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setBookings(bookingsData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching bookings:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, "users", auth.currentUser.uid, "bookings", bookingId);
      await deleteDoc(bookingRef);

      Alert.alert("Booking Cancelled", "Your booking has been cancelled successfully.");
    } catch (error) {
      Alert.alert("Error", "There was an issue canceling your booking.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!auth.currentUser) {
    return (
      <BackgroundWrapper>
        <SafeAreaView style={styles.messageContainer}>
          <Video
            source={require('../assets/Globe.mp4')} 
            style={styles.video}
            resizeMode="cover"
            isLooping
            shouldPlay
          />
          <Text style={styles.headerText}>No bookings yet</Text>
          <Text style={styles.messageText}>Sign in or create an account to get started</Text>
          <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Sign in</Text>
        </TouchableOpacity>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
    <SafeAreaView>
      {bookings.length > 0 ? (
        bookings.map((item) => (
          <Pressable
            key={item.id}
            style={{
              backgroundColor: "white",
              marginVertical: 10,
              marginHorizontal: 20,
              borderColor: "#E0E0E0",
              borderWidth: 1,
              padding: 14,
              borderRadius: 6,
              position: "relative",
            }}
          >
            <View>
              <Text style={{ fontSize: 24, fontWeight: "bold" }}>{item.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7 }}>
                <MaterialIcons name="stars" size={24} color="green" />
                <Text style={{ marginLeft: 3, fontSize: 15, fontWeight: "400" }}>{item.rating}</Text>
                <Text style={{ marginLeft: 3 }}>•</Text>
                <View
                  style={{
                    padding: 6,
                    borderRadius: 4,
                    width: 100,
                    backgroundColor: "#0039a6",
                    marginLeft: 4,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: "400",
                    }}
                  >
                    Genius Level
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Cancel Booking",
                    "Are you sure you want to cancel this booking?",
                    [
                      { text: "No" },
                      { text: "Yes", onPress: () => cancelBooking(item.id) },
                    ]
                  );
                }}
                style={{
                  position: "absolute",
                  right: 10,
                  top: 35,
                }}
              >
                <MaterialIcons name="cancel" size={24} color="red" />
              </Pressable>
            </View>
          </Pressable>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No bookings found.</Text>
      )}
    </SafeAreaView>
    </BackgroundWrapper>
  );
};

export default BookingScreen;
