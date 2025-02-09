import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import { Ionicons } from "@expo/vector-icons";
import BackgroundWrapper from "../BackgroundWrapper";
import styles from "../styles/ProfileStyles";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from '@env';

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [isProcessing, setIsProcessing] = useState(false); 
  const navigation = useNavigation();
  const defaultProfilePicture = require("../assets/default.png");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        setEmail(storedEmail || "Not available");

        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setPhoneNumber(userData.phone || "Not available");
            await AsyncStorage.setItem("userPhoneNumber", userData.phone || "Not available");

            if (userData.profilePictureUrl) {
              setProfilePicture(userData.profilePictureUrl);
            }
          } else {
            setPhoneNumber("Not available");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log("Picked Image URI:", uri);
      uploadToS3(uri);
    }
  };

  const uploadToS3 = async (uri) => {
    setIsProcessing(true); 
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const file = {
        uri,
        name: `profile-pic-${auth.currentUser.uid}.jpg`,
        type: "image/jpeg",
      };

      const s3 = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: "us-east-1",
      });

      const params = {
        Bucket: "profilepicturebookingapp",
        Key: file.name,
        Body: blob,
        ContentType: file.type,
      };

      const uploadResult = await s3.upload(params).promise();
      const imageUrl = uploadResult.Location;

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { profilePictureUrl: imageUrl });
        await AsyncStorage.setItem("profilePictureUrl", imageUrl);
        setProfilePicture(imageUrl);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsProcessing(false); 
    }
  };

  const removeProfilePicture = async () => {
    setIsProcessing(true); 
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const fileKey = `profile-pic-${currentUser.uid}.jpg`;

        const s3 = new AWS.S3({
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
          region: "us-east-1",
        });

        const params = { Bucket: "profilepicturebookingapp", Key: fileKey };
        await s3.deleteObject(params).promise();

        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { profilePictureUrl: null });
        await AsyncStorage.removeItem("profilePictureUrl");
        setProfilePicture(null);
      }
    } catch (error) {
      console.error("Failed to remove profile picture:", error);
    } finally {
      setIsProcessing(false); 
    }
  };

  const handleLogout = async () => {
    try {
    
      await auth.signOut();
  
    
      await AsyncStorage.clear();
  
      
      navigation.replace("Main");
    } catch (error) {
      console.error("Failed to logout:", error);
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
      <ImageBackground
        source={require('../assets/BlueBack.png')} 
        style={styles.cardImage}
        imageStyle={{ borderRadius: 12 }}
      >
      <View style={styles.loginContainer}>
      <View style={styles.loginContainer}>
  <Image
    source={require('../assets/default.png')} 
    style={styles.loginImage}
  />
  </View>
        <Text style={styles.loginMessage}>Sign in to see deals and Genius discounts, manage your trips, and more</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
    <View style={styles.container}>
    <ImageBackground
        source={require('../assets/BlueBack.png')} 
        style={styles.loggedCardImage}
        imageStyle={{ borderRadius: 12 }}
      >
      <View style={styles.profileContainer}>
        <Image
          source={profilePicture ? { uri: profilePicture } : defaultProfilePicture}
          style={styles.profilePicture}
        />
        <TouchableOpacity
          style={styles.addIcon}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add-circle" size={30} color="blue" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Text style={styles.header}>Profile Information</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{phoneNumber}</Text>
        </View>

        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setIsModalVisible(false);
                    pickImage();
                  }}
                >
                  <Text style={styles.modalOptionText}>Pick a New Profile Picture</Text>
                </TouchableOpacity>
                {profilePicture && (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      setIsModalVisible(false);
                      removeProfilePicture();
                    }}
                  >
                    <Text style={styles.modalOptionTextRemove}>Remove Profile Picture</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {isProcessing ? (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
      </ImageBackground>
    </View>
    </BackgroundWrapper>
  );
};

export default ProfileScreen;
