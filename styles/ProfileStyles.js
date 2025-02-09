import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 20,
      marginTop: 200,
    },
    profileContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    profilePicture: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 10,
      marginLeft: -220,
    },
    addIcon: {
      position: "absolute",
      bottom: -5,
      right: 240,
      backgroundColor: "#fff", 
      borderRadius: 50,
      padding: 5,
      elevation: 3, 
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    cardContainer: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 20,
      marginLeft: 20,
      width: "90%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#333",
    },
    infoContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      color: "#888",
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 10,
      color: "#333",
    },
    logoutButton: {
      backgroundColor: "#003B95",
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 25,
      alignItems: "center",
    },
    logoutText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 8,
      width: 300,
      alignItems: "center",
    },
    modalOption: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    modalOptionText: {
      fontSize: 18,
      color: "#007BFF",
    },
    modalOptionTextRemove:{
      fontSize: 18,
      color: "#FF0000"
    },
    loginContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    loginMessage: {
      fontSize: 18,
      textAlign: "center",
      marginBottom: 20,
      color: "white"
    },
    loginButton: {
      backgroundColor: "white",
      padding: 15,
      borderRadius: 8,
    },
    loginButtonText: {
      color: "#003580",
      fontSize: 16,
      fontWeight: "bold",
    },
    cardImage: {
      width: 400,
      height: 300,
      alignSelf: 'center',
      marginTop: 300,
      overflow: 'hidden',
      paddingBottom: 20,
      paddingTop: 20
    },
    loginImage: {
      width: 100,
      height: 100,
      marginBottom: 16,
      borderRadius: 50, 
    },
    loggedCardImage: {
      width: 400,
      height: 500,
      alignSelf: 'center',
      marginTop: 50,
      overflow: 'hidden',
      paddingBottom: 20,
      paddingTop: 20
    },
  });

    export default styles;