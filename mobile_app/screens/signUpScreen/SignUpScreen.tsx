import { SafeAreaView, ScrollView, View } from "react-native";
import SafeViewAndroid from "../../components/SafeAreaViewAndroid";
import React from "react";
import { styles } from "./SignUpScreenStyles";
import {
  doUserLogIn,
  doUserRegistration,
} from "../../api/userSignUp/parseSignUp";
import {Input} from "../../components/inputField/Input";
import {MainButton} from "../../components/mainButton/MainButton";
import TopNavigation from "../../components/topNavigation/TopNavigation";

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

  const handleInput = (name: string, value: string) => {
    setUserInput({ ...userInput, [name]: value });
  };

  const handleSignUp = async () => {
    console.log(userInput);
    try {
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
      console.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}
      >
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
        disabled
        text="Continue"
        onPress={() => {
          handleSignUp().then((r) => console.log(r));
        }}
      />
    </View>
  );
};

export const LoginScreen = ({ navigation }: any) => {
  const [userInput, setUserInput] = React.useState({
    password: "",
    username: "",
  });

  const handleInput = (name: string, value: string) => {
    setUserInput({ ...userInput, [name]: value });
  };

  const handleLogin = async () => {
    try {
      let user = await doUserLogIn(userInput.username, userInput.password);
      navigation.navigate("LocationSelectionScreen", {
        user: user,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}
      >
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
      <MainButton disabled text="Login" onPress={() => handleLogin()} />
    </View>
  );
};
