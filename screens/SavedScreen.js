import {
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import BackgroundWrapper from "../BackgroundWrapper";
import { Video } from "expo-av";
import styles from "../styles/SavedStyles";

const SavedScreen = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

const handleButtonPress = () => {
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    navigation.replace("Main");
  }); 
};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Saved Properties",
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
  }, []);

  useEffect(() => {
    const user = auth.currentUser; 
    if (!user) {
      setIsLoading(false); 
      return;
    }

    const userDocRef = doc(db, "savedProperties", user.uid); 

    const unsubscribe = onSnapshot(
      userDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSavedProperties(snapshot.data().properties || []);
        } else {
          setSavedProperties([]);
        }
        setIsLoading(false); 
      },
      (error) => {
        console.error("Error listening to saved properties:", error);
        setIsLoading(false); 
      }
    );
    return () => unsubscribe();
  }, []);

  const toggleSaveProperty = async (propertyId) => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "savedProperties", user.uid); 
    const isSaved = savedProperties.some((property) => property.id === propertyId);

    const updatedProperties = isSaved
      ? savedProperties.filter((property) => property.id !== propertyId)
      : savedProperties;

    try {
      await updateDoc(userDocRef, { properties: updatedProperties });
    } catch (error) {
      console.error("Error updating saved properties:", error);
    }
  };

  const renderProperty = ({ item }) => {
    const isSaved = savedProperties.some((property) => property.id === item.id);

    return (
      <BackgroundWrapper>
      <Pressable
        onPress={() =>
          navigation.navigate("Info", {
            name: item.name,
            rating: item.rating,
            oldPrice: item.oldPrice,
            newPrice: item.newPrice,
            photos: item.photos || [],
            availableRooms: item.rooms || [],
            adults: 2,
            children: 0,
            rooms: 1,
            selectedDates: ["2024-01-01", "2024-01-02"],
          })
        }
        style={{
          margin: 15,
          backgroundColor: "white",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Image
          style={{ height: 150, width: "100%", borderRadius: 5 }}
          source={{ uri: item.image || "https://via.placeholder.com/150" }}
        />
        <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 5 }}>
          {item.name || "Unknown Property"}
        </Text>
        <Text style={{ color: "gray" }}>{item.address || "No address"}</Text>
        <Text style={{ color: "green", fontWeight: "bold" }}>
          Rating: {item.rating || "N/A"}
        </Text>
        <Text style={{ color: "red", textDecorationLine: "line-through" }}>
          Rs {item.oldPrice || 0}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Rs {item.newPrice || 0}
        </Text>

        <Pressable onPress={() => toggleSaveProperty(item.id)}>
          <MaterialIcons
            name={isSaved ? "favorite" : "favorite-border"}
            size={30}
            color={isSaved ? "red" : "gray"}
            style={{
              position: "absolute",
              top: -30,
              right: 10,
              opacity: isSaved ? 1 : 0.5,
            }}
          />
        </Pressable>
      </Pressable>
      </BackgroundWrapper>
    );
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
            source={require('../assets/saved.mp4')} 
            style={styles.video}
            resizeMode="cover"
            isLooping
            shouldPlay
          />
          <Text style={styles.headerText}>Save what you like for later</Text>
          <Text style={styles.messageText}>
            Create lists of your favorite properties to help you share, compare, and book
          </Text>
    
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleButtonPress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Start your search</Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
    <View style={{ flex: 1 }}>
      {savedProperties.length > 0 ? (
        <FlatList
          data={savedProperties}
          renderItem={renderProperty}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No saved properties.
        </Text>
      )}
    </View>
    </BackgroundWrapper>
  );
};

export default SavedScreen;
