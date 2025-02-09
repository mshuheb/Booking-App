import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import RegisterScreen from "../screens/RegisterScreen";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";


jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  initializeAuth: jest.fn().mockReturnValue({}),
  getReactNativePersistence: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("<RegisterScreen />", () => {
  let navigationMock;

  beforeEach(() => {
    navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
    useNavigation.mockReturnValue(navigationMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with initial UI elements", () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(<RegisterScreen />);
  
    expect(getByText("Create an Account")).toBeTruthy();
    expect(getByPlaceholderText("Enter your email id")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByPlaceholderText("Enter your Phone No")).toBeTruthy();
    
    expect(getByTestId("registerButton")).toBeTruthy();
  });

  test("matches snapshot", () => {
    const { toJSON } = render(<RegisterScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  test("validates empty form fields and shows an alert", async () => {
    const { getByTestId } = render(<RegisterScreen />);

    const registerButton = getByTestId("registerButton");
  
    fireEvent.press(registerButton);
  
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Invalid Details",
        "Please enter all the credentials",
        [{ text: "OK" }],
        { cancelable: false }
      );
    });
  });

  test("navigates back to the Login screen on 'Already have an account?' press", () => {
    const { getByText } = render(<RegisterScreen />);
    const signInText = getByText("Already have an account? Sign In");

    fireEvent.press(signInText);

    expect(navigationMock.goBack).toHaveBeenCalled();
  });

  test("shows an alert when an invalid email is entered", async () => {
    const { getByTestId, getByPlaceholderText } = render(<RegisterScreen />);
  
    fireEvent.changeText(getByPlaceholderText("Enter your email id"), "invalidemail");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.changeText(getByPlaceholderText("Enter your Phone No"), "1234567890");
  
    fireEvent.press(getByTestId("registerButton"));
  
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Invalid Email",
        "Please enter a valid email address.",
        [{ text: "OK" }]
      );
    });
  });

  test("shows an alert when an invalid phone number is entered", async () => {
    const { getByTestId, getByPlaceholderText } = render(<RegisterScreen />);
  
    fireEvent.changeText(getByPlaceholderText("Enter your email id"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.changeText(getByPlaceholderText("Enter your Phone No"), "12345"); 
  
    fireEvent.press(getByTestId("registerButton"));
  
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Invalid Phone",
        "Please enter a valid 10-digit phone number.",
        [{ text: "OK" }]
      );
    });
  });

  test("shows an error alert when registration fails", async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Network error"));
  
    const { getByTestId, getByPlaceholderText } = render(<RegisterScreen />);
  
    fireEvent.changeText(getByPlaceholderText("Enter your email id"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");
    fireEvent.changeText(getByPlaceholderText("Enter your Phone No"), "1234567890");
  
    fireEvent.press(getByTestId("registerButton"));
  
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Registration Failed",
        "Something went wrong. Please try again.",
        [{ text: "OK" }]
      );
    });
  });
});
