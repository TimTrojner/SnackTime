import { SafeAreaView, ScrollView, View, Text } from "react-native";
import SafeViewAndroid from "../../components/SafeAreaViewAndroid";
import React from "react";
import { styles } from "./SignUpScreenStyles";
import {
  doUserLogIn,
  doUserRegistration,
} from "../../api/userSignUp/parseSignUp";
import { Input } from "../../components/inputField/Input";
import { MainButton } from "../../components/mainButton/MainButton";
import TopNavigation from "../../components/topNavigation/TopNavigation";
import Toast from "react-native-toast-message";

const SignUpScreen = ({ navigation }: any) => {
  const [loginScreen, setLoginScreen] = React.useState(false);

  return (
    <SafeAreaView
      style={[
        SafeViewAndroid.AndroidSafeArea,
        { backgroundColor: "#fff", flex: 1 },
      ]}
    >
      <TopNavigation
        showRightButton
        textRight={loginScreen ? "Sign In" : "Login"}
        rightAction={() => {
          setLoginScreen(!loginScreen);
        }}
      />
      {loginScreen ? (
        <LoginScreen navigation={navigation} />
      ) : (
        <SignInScreen navigation={navigation} />
      )}
    </SafeAreaView>
  );
};

export default SignUpScreen;

export const SignInScreen = ({ navigation }: any) => {
  const [userInput, setUserInput] = React.useState({
    email: "",
    password: "",
    passwordconfirm: "",
    username: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleInput = (name: string, value: string) => {
    setUserInput({ ...userInput, [name]: value });
  };

  const handleSignUp = async () => {
    if (userInput.password !== userInput.passwordconfirm) {
        Toast.show({
            type: "error",
            text1: "Error",
            text2: "Passwords do not match",
            position: "top",
            visibilityTime: 3000,
        });
        return;
    }

    let emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(userInput.email)) {
        Toast.show({
            type: "error",
            text1: "Error",
            text2: "Invalid email address",
            position: "top",
            visibilityTime: 3000,
        });
        return;
    }

    try {
      setLoading(true);
      let user = await doUserRegistration(
        userInput.username,
        userInput.password
      );
      // @ts-ignore
      user.setEmail(userInput.email).save();
      navigation.navigate("LocationSelectionScreen", {
        user: user,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            textAlign: "center",
            marginBottom: 4,
            fontWeight: "bold",
          }}
        >
          Register
        </Text>
        <ScrollView>
          <Input
            label="Username"
            placeholder="Username"
            state={userInput.username}
            handleInput={handleInput}
          />
          <Input
            label="Email"
            placeholder="Email"
            state={userInput.email}
            handleInput={handleInput}
          />
          <Input
            label="Password"
            placeholder="Password"
            state={userInput.password}
            handleInput={handleInput}
          />
          <Input
            label="Confirm password"
            placeholder="Confirm password"
            state={userInput.passwordconfirm}
            handleInput={handleInput}
          />
          <View style={{ flex: 1 }}></View>
        </ScrollView>
      </View>
      <MainButton
        disabled={
          loading || ( userInput.username === "" || userInput.password === "" || userInput.email === "" || userInput.passwordconfirm === "")
        }
        loading={loading}
        text="Register"
        onPress={() => {
          handleSignUp().then((r) => console.log(r));
        }}
      />
    </View>
  );
};

const LoginScreen = ({ navigation }: any) => {
  const [userInput, setUserInput] = React.useState({
    password: "",
    username: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleInput = (name: string, value: string) => {
    setUserInput({ ...userInput, [name]: value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      let user = await doUserLogIn(userInput.username, userInput.password);
      navigation.navigate("LocationSelectionScreen", {
        user: user,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "top",
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            textAlign: "center",
            marginBottom: 4,
            fontWeight: "bold",
          }}
        >
          Login
        </Text>
        <ScrollView>
          <Input
            label="Username"
            placeholder="Username"
            state={userInput.username}
            handleInput={handleInput}
          />
          <Input
            label="Password"
            placeholder="Password"
            state={userInput.password}
            handleInput={handleInput}
          />
          <View style={{ flex: 1 }}></View>
        </ScrollView>
      </View>
      <MainButton
        disabled={
          loading || (userInput.username === "" && userInput.password === "")
        }
        loading={loading}
        text="Login"
        onPress={() => handleLogin()}
      />
    </View>
  );
};

