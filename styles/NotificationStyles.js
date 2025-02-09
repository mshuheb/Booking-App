import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    video: {
      width: 200,
      height: 200,
      marginBottom: 20,
      borderRadius: 50,
      overflow: "hidden",
      marginLeft: -10,
    },
    headerText: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
      padding: 10,
    },
    messageText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#003580",
      textAlign: "center",
    },
    messageContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      marginTop: -140,
    }
  });

  export default styles;