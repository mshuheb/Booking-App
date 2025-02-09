import { View, SafeAreaView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import SearchResults from "../components/SearchResults";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const SearchScreen = () => {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const colRef = collection(db, "places");
        const docsSnap = await getDocs(colRef);

        const places = docsSnap.docs.map((doc) => doc.data());
        setItems(places); 
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchPlaces();
  }, []); 

  return (
    <SafeAreaView>
      <View
        style={{
          padding: 10,
          margin: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderColor: "#FFC72C",
          borderWidth: 4,
          borderRadius: 10,
          marginTop: 50,
        }}
      >
        <TextInput
          value={input}
          onChangeText={(text) => setInput(text)}
          placeholder="Enter Your Destination"
          style={{ flex: 1, fontSize: 16 }}
        />
        <Feather name="search" size={22} color="black" />
      </View>

      <SearchResults data={items} input={input} setInput={setInput} />
    </SafeAreaView>
  );
};

export default SearchScreen;


