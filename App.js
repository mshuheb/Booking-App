import { StyleSheet } from "react-native";
import { ModalPortal } from "react-native-modals";
import StackNavigator from "./StackNavigator";

export default function App() {
  return (
    <>
        <StackNavigator />
        <ModalPortal />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
