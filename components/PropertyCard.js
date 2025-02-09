import {
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase"; // Import Firebase
import { doc, updateDoc, arrayUnion, setDoc, getDoc, arrayRemove } from "firebase/firestore";

const PropertyCard = ({
  rooms,
  children,
  property,
  adults,
  selectedDates,
  availableRooms,
}) => {
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const [liked, setLiked] = useState(false); // Manage like state

  useEffect(() => {
    // Check if the property is already saved in Firebase
    const fetchSavedProperties = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "savedProperties", user.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const savedProperties = userDoc.data().properties || [];
          const isLiked = savedProperties.some(
            (savedProperty) => savedProperty.id === property.id
          );
          setLiked(isLiked); // Set the initial liked state
        }
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      }
    };

    fetchSavedProperties();
  }, [property.id]); // Run whenever the property changes

  // Handle liking or disliking the property
  const toggleLikeProperty = async () => {
    const user = auth.currentUser; // Get current user
    if (!user) {
      Alert.alert("Not Logged In", "Please log in to save properties.");
      return;
    }
  
    const userDocRef = doc(db, "savedProperties", user.uid); // User's saved properties document
  
    try {
      if (!liked) {
        // If not liked, save property
        const userDoc = await getDoc(userDocRef);
  
        if (!userDoc.exists()) {
          // If the user document doesn't exist, create it
          await setDoc(userDocRef, {
            properties: [
              {
                id: property.id, // Ensure each property has a unique ID
                name: property.name,
                image: property.image,
                rating: property.rating,
                address: property.address,
                oldPrice: property.oldPrice,
                newPrice: property.newPrice,
                photos: property.photos, // Save the photos array
                rooms: property.rooms, // Save the rooms array
              },
            ],
          });
        } else {
          // Update the existing document by adding the property
          await updateDoc(userDocRef, {
            properties: arrayUnion({
              id: property.id,
              name: property.name,
              image: property.image,
              rating: property.rating,
              address: property.address,
              oldPrice: property.oldPrice,
              newPrice: property.newPrice,
              photos: property.photos, // Save the photos array
              rooms: property.rooms, // Save the rooms array
            }),
          });
        }
        Alert.alert("Success", "Property saved to your list!");
      } else {
        // If already liked, remove property
        await updateDoc(userDocRef, {
          properties: arrayRemove({
            id: property.id,
            name: property.name,
            image: property.image,
            rating: property.rating,
            address: property.address,
            oldPrice: property.oldPrice,
            newPrice: property.newPrice,
            photos: property.photos, // Remove the photos array as well
            rooms: property.rooms, // Remove the rooms array as well
          }),
        });
        Alert.alert("Removed", "Property removed from your list!");
      }
  
      setLiked(!liked); // Toggle like state
    } catch (error) {
      console.error("Error updating saved properties:", error);
      Alert.alert("Error", "Could not update your list. Please try again.");
    }
  };
  
  

  return (
    <View>
      <Pressable
        onPress={() =>
          navigation.navigate("Info", {
            name: property.name,
            rating: property.rating,
            oldPrice: property.oldPrice,
            newPrice: property.newPrice,
            photos: property.photos,
            availableRooms: property.rooms,
            adults: adults,
            children: children,
            rooms: rooms,
            selectedDates: {
      startDate: selectedDates.startDate.toISOString(), // Serialize startDate
      endDate: selectedDates.endDate.toISOString(), // Serialize endDate
    },
          })
        }
        style={{ margin: 15, flexDirection: "row", backgroundColor: "white" }}
      >
        <View>
          <Image
            style={{ height: height / 4, width: width - 280 }}
            source={{ uri: property.image }}
          />
        </View>

        <View style={{ padding: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ width: 200 }}>{property.name}</Text>
            <AntDesign
              name={liked ? "heart" : "hearto"} // Change icon based on liked state
              size={24}
              color={liked ? "red" : "black"} // Change color based on liked state
              onPress={toggleLikeProperty} // Save or remove property on heart icon press
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: 7,
            }}
          >
            <MaterialIcons name="stars" size={24} color="green" />
            <Text>{property.rating}</Text>
            <View
              style={{
                backgroundColor: "#6CB4EE",
                paddingVertical: 3,
                borderRadius: 5,
                width: 100,
              }}
            >
              <Text
                style={{ textAlign: "center", color: "white", fontSize: 15 }}
              >
                Genius Level
              </Text>
            </View>
          </View>

          <Text
            style={{
              width: 210,
              marginTop: 6,
              color: "gray",
              fontWeight: "bold",
            }}
          >
            {property.address.length > 50
              ? property.address.substr(0, 50) + "..."
              : property.address}
          </Text>

          <Text style={{ marginTop: 4, fontSize: 15, fontWeight: "500" }}>
            Price for 1 Night and {adults} adults
          </Text>
          <View
            style={{
              marginTop: 5,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text
              style={{
                color: "red",
                fontSize: 18,
                textDecorationLine: "line-through",
              }}
            >
              Rs {property.oldPrice * adults}
            </Text>
            <Text style={{ fontSize: 18 }}>
              Rs {property.newPrice * adults}
            </Text>
          </View>

          <View style={{ marginTop: 6 }}>
            <Text style={{ fontSize: 16, color: "gray" }}>Deluxe Room</Text>
            <Text style={{ fontSize: 16, color: "gray" }}>
              Hotel Room : 1 bed
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#6082B6",
              paddingVertical: 2,
              marginTop: 2,
              borderRadius: 5,
              width: 150,
              paddingHorizontal: 3,
            }}
          >
            <Text style={{ textAlign: "center", color: "white" }}>
              Limited Time deal
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default PropertyCard;


