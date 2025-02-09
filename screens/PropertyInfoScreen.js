import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  Button
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Amenities from "../components/Amenities";
import DatePicker from "react-native-date-ranges";
import { BottomModal } from "react-native-modals";
import { ModalFooter } from "react-native-modals";
import { ModalButton } from "react-native-modals";
import { ModalTitle } from "react-native-modals";
import { SlideAnimation } from "react-native-modals";
import { ModalContent } from "react-native-modals";
import { Feather } from "@expo/vector-icons";

const PropertyInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedDates, setSelectedDates] = useState({
    startDate: route.params.selectedDates?.startDate 
      ? new Date(route.params.selectedDates.startDate) 
      : new Date(), 
    endDate: route.params.selectedDates?.endDate 
      ? new Date(route.params.selectedDates.endDate) 
      : new Date(new Date().setDate(new Date().getDate() + 1)), 
  });
  
  const [rooms, setRooms] = useState(route.params.rooms || 1);
  const [adults, setAdults] = useState(route.params.adults);
  const [children, setChildren] = useState(route.params.children);
  const [modalVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: `${route.params.name}`,
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

  const customButton = (onConfirm) => {
      return (
        <Button
          onPress={onConfirm}
          style={{
            container: { width: "80%", marginHorizontal: "3%" },
            text: { fontSize: 20 },
          }}
          primary
          title="Submit"
        />
      );
    };

  const handleDateSelection = (range) => {
    const { startDate, endDate } = range;

    const parsedStartDate = new Date(startDate.replace(/\//g, "-")); 
    const parsedEndDate = new Date(endDate.replace(/\//g, "-"));

    if (!isNaN(parsedStartDate.getTime()) && !isNaN(parsedEndDate.getTime())) {
      setSelectedDates({
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      });
    } else {
      console.error("Invalid dates received:", { startDate, endDate });
    }
  };

  const difference = route.params.oldPrice - route.params.newPrice;
  const offerPrice = (Math.abs(difference) / route.params.oldPrice) * 100;

  return (
    <>
      <ScrollView>
        <SafeAreaView>
          <ScrollView>
            <Pressable
              style={{ flexDirection: "row", flexWrap: "wrap", margin: 10 }}
            >
              {route.params.photos.slice(0, 5).map((photo, index) => (
                <View key={index} style={{ margin: 6 }}>
                  <Image
                    style={{
                      width: 120,
                      height: 80,
                      borderRadius: 4,
                    }}
                    source={{ uri: photo.image }}
                  />
                </View>
              ))}

              <Pressable
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ textAlign: "center", marginLeft: 20 }}>
                  Show More
                </Text>
              </Pressable>
            </Pressable>

            <View
              style={{
                marginHorizontal: 12,
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                  {route.params.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 7,
                  }}
                >
                  <MaterialIcons name="stars" size={24} color="green" />
                  <Text>{route.params.rating}</Text>
                  <View
                    style={{
                      backgroundColor: "#003580",
                      paddingVertical: 3,
                      borderRadius: 5,
                      width: 100,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 15,
                      }}
                    >
                      Genius Level
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: "#17B169",
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  borderRadius: 6,
                  marginTop: 60,
                  marginLeft: -120,
                }}
              >
                <Text style={{ color: "white", fontSize: 13 }}>
                  Travel sustainable
                </Text>
              </View>
            </View>

            <Text
              style={{
                borderColor: "#E0E0E0",
                borderWidth: 3,
                height: 1,
                marginTop: 15,
              }}
            />
            <Text
              style={{
                marginTop: 10,
                fontSize: 17,
                fontWeight: "500",
                marginHorizontal: 12,
              }}
            >
              Price for 1 Night and {adults} adults
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 12,
                marginTop: 4,
                gap: 8,
              }}
            >
              <Text
                style={{
                  color: "red",
                  fontSize: 20,
                  textDecorationLine: "line-through",
                }}
              >
                {route.params.oldPrice * adults}
              </Text>
              <Text style={{ fontSize: 20 }}>
                Rs {route.params.newPrice * adults}
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: 12,
                marginTop: 7,
                backgroundColor: "green",
                paddingHorizontal: 4,
                paddingVertical: 5,
                width: 78,
                borderRadius: 4,
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                {offerPrice.toFixed(0)} % OFF
              </Text>
            </View>

            <Text
              style={{
                borderColor: "#E0E0E0",
                borderWidth: 3,
                height: 1,
                marginTop: 15,
              }}
            />
            
            <View style={{ margin: 3 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: -9, paddingLeft:13 }}>
                Travel Dates
              </Text>
            <View
      style={{
        margin: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 75, 
    borderColor: "#FFC72C", 
    borderWidth: 2, 
    paddingHorizontal: 10,
    paddingVertical: 10,
      }}
    >
      <View>
        
        <View style={{ position: "relative" }}>
          {/* Calendar Icon */}
          <Feather name="calendar" size={24} color="black" />

          {/* Hidden DatePicker */}
          <DatePicker
            style={{
              position: "absolute",
              top: -15,
              left: -10,
              width: 330,
              height: 64,
              opacity: 0, 
              zIndex: 1,
            }}
            customStyles={{
              placeholderText: {
                fontSize: 15,
                flexDirection: "row",
                alignItems: "center",
                marginRight: "auto",
              },
              headerStyle: {
                backgroundColor: "#003580",
              },
              contentText: {
                fontSize: 15,
                flexDirection: "row",
                alignItems: "center",
                marginRight: "auto",
              },
            }}
            customButton={(onConfirm) => customButton(onConfirm)}
            selectedBgColor="#0047AB"
            allowFontScaling={false}
            mode={"range"}
            onConfirm={(range) => {
              handleDateSelection(range);
            }}
            markText="Select Dates" 
  markTextStyle={{ color: "black", fontSize: 15 }} 
          />
        </View>
      </View>

      {/* Check In and Check Out Sections */}
      <View>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 3 }}>
          Check-In
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: selectedDates.startDate ? "#007FFF" : "#000",
          }}
        >
          {selectedDates.startDate
            ? selectedDates.startDate.toLocaleDateString()
            : "Not selected"}
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 3 }}>
          Check-Out
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: selectedDates.endDate ? "#007FFF" : "#000",
          }}
        >
          {selectedDates.endDate
            ? selectedDates.endDate.toLocaleDateString()
            : "Not selected"}
        </Text>
      </View>
    </View>
    </View>

            <View style={{ margin: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 3 }}>
                Rooms and Guests
              </Text>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingHorizontal: 10,
                  borderColor: "#FFC72C",
                  borderWidth: 2,
                  paddingVertical: 20,
                }}
              >
                <MaterialIcons name="person-outline" size={24} color="black" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#007FFF",
                  }}
                >
                  {rooms} room • {adults} adults • {children} children
                </Text>
              </Pressable>
            </View>

            <Text
              style={{
                borderColor: "#E0E0E0",
                borderWidth: 3,
                height: 1,
                marginTop: 15,
              }}
            />
            <Amenities />

            <Text
              style={{
                borderColor: "#E0E0E0",
                borderWidth: 3,
                height: 1,
                marginTop: 15,
              }}
            />
          </ScrollView>
        </SafeAreaView>

        <Pressable
          onPress={() =>
            navigation.navigate("Rooms", {
              rooms: route.params.availableRooms,
              oldPrice: route.params.oldPrice,
              newPrice: route.params.newPrice,
              name: route.params.name,
              children: route.params.children,
              adults: route.params.adults,
              rating: route.params.rating,
              startDate: selectedDates.startDate.toISOString(), 
    endDate: selectedDates.endDate.toISOString(), 
            })
          }
          style={{
            backgroundColor: "#6CB4EE",
            position: "absolute",
            bottom: 20,
            padding: 15,
            width: "95%",
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 17,
            }}
          >
            Select Availability
          </Text>
        </Pressable>
      </ScrollView>

      <BottomModal
        swipeThreshold={200}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        footer={
          <ModalFooter>
            <ModalButton
              text="Apply"
              style={{
                marginBottom: 20,
                color: "white",
                backgroundColor: "#003580",
              }}
              onPress={() => setModalVisible(false)}
            />
          </ModalFooter>
        }
        modalTitle={<ModalTitle title="Select rooms and guests" />}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(false)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(false)}
      >
        <ModalContent style={{ width: "100%", height: 310 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Rooms</Text>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Pressable
                onPress={() => setRooms(Math.max(1, rooms - 1))}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  -
                </Text>
              </Pressable>

              <Pressable>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "500",
                    paddingHorizontal: 6,
                  }}
                >
                  {rooms}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setRooms((c) => c + 1)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  +
                </Text>
              </Pressable>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Adults</Text>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Pressable
                onPress={() => setAdults(Math.max(1, adults - 1))}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  -
                </Text>
              </Pressable>

              <Pressable>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "500",
                    paddingHorizontal: 6,
                  }}
                >
                  {adults}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setAdults((c) => c + 1)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  +
                </Text>
              </Pressable>
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>Children</Text>
            <Pressable
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Pressable
                onPress={() => setChildren(Math.max(0, children - 1))}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  -
                </Text>
              </Pressable>

              <Pressable>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "500",
                    paddingHorizontal: 6,
                  }}
                >
                  {children}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setChildren((c) => c + 1)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  borderColor: "#BEBEBE",
                  backgroundColor: "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: "600",
                    paddingHorizontal: 6,
                  }}
                >
                  +
                </Text>
              </Pressable>
            </Pressable>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default PropertyInfoScreen;
