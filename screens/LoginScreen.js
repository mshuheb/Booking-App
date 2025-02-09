import {
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigation = useNavigation();

  const login = async () => {
    setIsLoggingIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      await AsyncStorage.setItem("tokenUser", token);
      await AsyncStorage.setItem("userEmail", user.email);
      const phoneNumber = user.phoneNumber || "";
      await AsyncStorage.setItem("userPhoneNumber", phoneNumber);

      console.log("Login successful!");
      navigation.replace("Main");
    } catch (error) {
      console.error("Login failed:", error.message);
      alert("Login failed. Please check your email and password.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 10,
        alignItems: "center",
      }}
    >
      <KeyboardAvoidingView>
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 100 }}>
          <Text style={{ color: "#003580", fontSize: 17, fontWeight: "700" }}>
            Sign In
          </Text>
          <Text style={{ marginTop: 15, fontSize: 18, fontWeight: "500" }}>
            Sign In to Your Account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Email
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email id"
              placeholderTextColor={"black"}
              style={{
                fontSize: 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>
              Password
            </Text>

            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor={"black"}
              style={{
                fontSize: 18,
                borderBottomColor: "gray",
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
            />
          </View>
        </View>

        {isLoggingIn ? (
          <ActivityIndicator size="large" color="#003580" style={{ marginTop: 50 }} testID="ActivityIndicator" />
        ) : (
          <Pressable
            onPress={login}
            style={{
              width: 200,
              backgroundColor: "#003580",
              padding: 15,
              borderRadius: 7,
              marginTop: 50,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 17, fontWeight: "bold" }}>
              Login
            </Text>
          </Pressable>
        )}

        <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 20 }}>
          <Text style={{ textAlign: "center", color: "gray", fontSize: 17 }}>
            Don't have an account? Sign up
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
