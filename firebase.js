import { getApp, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRqeTVnFdloEn3bpB9fKk_btNd0tPKWok",
  authDomain: "booking-project-afa36.firebaseapp.com",
  projectId: "booking-project-afa36",
  storageBucket: "booking-project-afa36.appspot.com",
  messagingSenderId: "1096229966164",
  appId: "1:1096229966164:web:c1238ddd012239251e38c1",
};

let app;
try {
  app = getApp();
} catch {
  app = initializeApp(firebaseConfig);
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore();

export { auth, db };
