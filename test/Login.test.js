import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import LoginScreen from "../screens/LoginScreen";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";


jest.mock("firebase/auth", () => {
  return {
    signInWithEmailAndPassword: jest.fn(),
    initializeAuth: jest.fn(),
    getReactNativePersistence: jest.fn(), 
  };
});

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

describe("<LoginScreen />", () => {
  let navigationMock;

  beforeEach(() => {
    navigationMock = { replace: jest.fn(), navigate: jest.fn() };
    useNavigation.mockReturnValue(navigationMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly with initial UI elements", () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    expect(getByText("Sign In")).toBeTruthy();
    expect(getByText("Sign In to Your Account")).toBeTruthy();
    expect(getByPlaceholderText("Enter your email id")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
  });

  test("matches snapshot", () => {
    const { toJSON } = render(<LoginScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  test("allows user to input email and password", () => {
    const { getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("Enter your email id");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    expect(emailInput.props.value).toBe("test@example.com");
    expect(passwordInput.props.value).toBe("password123");
  });

  test("shows activity indicator during login", async () => {
    signInWithEmailAndPassword.mockImplementation(() => new Promise(() => {})); 

    const { getByText, getByPlaceholderText, getByTestId } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("Enter your email id");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByTestId("ActivityIndicator")).toBeTruthy();
    });
  });

  test("redirects to register screen on 'Sign up' press", () => {
    const { getByText } = render(<LoginScreen />);
    const signUpText = getByText("Don't have an account? Sign up");

    fireEvent.press(signUpText);

    expect(navigationMock.navigate).toHaveBeenCalledWith("Register");
  });
});
