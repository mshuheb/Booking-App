import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0f4f7",
    },
    messageContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    messageText: {
      fontSize: 18,
      color: "#003580",
      fontWeight: "bold",
    },
    video: {
    width: 320,
    height: 200,
    marginBottom: 20,
    borderRadius: 100,
    overflow: 'hidden',
    marginLeft: -10,
  },
  loginButton: {
      backgroundColor: "#003B95",
      padding: 15,
      borderRadius: 8,
      marginTop: 20,
      marginLeft: 10,
    },
    loginButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    headerText:{
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 10,
      }  
  
  });
  
  export default styles;