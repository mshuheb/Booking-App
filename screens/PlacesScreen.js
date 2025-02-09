import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Octicons, Ionicons, FontAwesome5, FontAwesome, Entypo } from "@expo/vector-icons";
import PropertyCard from "../components/PropertyCard";
import { BottomModal, ModalFooter, SlideAnimation, ModalTitle, ModalContent } from "react-native-modals";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const PlacesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [modalVisibile, setModalVisibile] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  const filters = [
    { id: "0", filter: "cost:Low to High" },
    { id: "1", filter: "cost:High to Low" },
  ];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Popular Places",
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
    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "places");
        const docsSnap = await getDocs(colRef);

        const places = docsSnap.docs.map((doc) => doc.data());
        setItems(places);
        setSortedData(places); 
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const applyFilter = (filter) => {
    setModalVisibile(false);
    let sortedPlaces = [...sortedData];

    switch (filter) {
      case "cost:High to Low":
        sortedPlaces = sortedPlaces.map((place) => ({
          ...place,
          properties: [...place.properties].sort((a, b) => b.newPrice - a.newPrice),
        }));
        break;

      case "cost:Low to High":
        sortedPlaces = sortedPlaces.map((place) => ({
          ...place,
          properties: [...place.properties].sort((a, b) => a.newPrice - b.newPrice),
        }));
        break;

      default:
        break;
    }

    setSortedData(sortedPlaces);
  };

  const filteredPlaces = sortedData.filter((place) => place.place === route.params.place);

  return (
    <ScrollView>
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          padding: 12,
          backgroundColor: "white",
        }}
      >
        <Pressable
          onPress={() => setModalVisibile(!modalVisibile)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Octicons name="arrow-switch" size={22} color="gray" />
          <Text style={{ fontSize: 15, fontWeight: "500", marginLeft: 8 }}>Sort</Text>
        </Pressable>

        <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="filter" size={22} color="gray" />
          <Text style={{ fontSize: 15, fontWeight: "500", marginLeft: 8 }}>Filter</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Map", { searchResults: filteredPlaces })}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <FontAwesome5 name="map-marker-alt" size={22} color="gray" />
          <Text style={{ fontSize: 15, fontWeight: "500", marginLeft: 8 }}>Map</Text>
        </Pressable>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="large" color="#003580" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={{ backgroundColor: "#F5F5F5" }}>
          {filteredPlaces.map((place) =>
            place.properties.map((property, index) => (
              <PropertyCard
                key={index}
                rooms={route.params.rooms}
                children={route.params.children}
                adults={route.params.adults}
                selectedDates={route.params.selectedDates}
                property={property}
                availableRooms={property.rooms}
              />
            ))
          )}
        </ScrollView>
      )}

      <BottomModal
        onBackdropPress={() => setModalVisibile(!modalVisibile)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        footer={
          <ModalFooter>
            <Pressable
              onPress={() => applyFilter(selectedFilter)}
              style={{
                paddingRight: 10,
                marginLeft: "auto",
                marginRight: "auto",
                marginVertical: 10,
                marginBottom: 30,
              }}
            >
              <Text>Apply</Text>
            </Pressable>
          </ModalFooter>
        }
        modalTitle={<ModalTitle title="Sort and Filter" />}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        visible={modalVisibile}
      >
        <ModalContent style={{ width: "100%", height: 280 }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                marginVertical: 10,
                flex: 2,
                height: 280,
                borderRightWidth: 1,
                borderColor: "#E0E0E0",
              }}
            >
              <Text style={{ textAlign: "center" }}>Sort</Text>
            </View>

            <View style={{ flex: 3, margin: 10 }}>
              {filters.map((item, index) => (
                <Pressable
                  onPress={() => setSelectedFilter(item.filter)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                  key={index}
                >
                  {selectedFilter === item.filter ? (
                    <FontAwesome name="circle" size={18} color="green" />
                  ) : (
                    <Entypo name="circle" size={18} color="black" />
                  )}
                  <Text style={{ fontSize: 16, fontWeight: "500", marginLeft: 6 }}>{item.filter}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </ScrollView>
  );
};

export default PlacesScreen;


