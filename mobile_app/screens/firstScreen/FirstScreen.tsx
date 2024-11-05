import { ImageBackground, Text, View } from "react-native";
import { styles } from "./FirstScreenStyles";
import React from "react";
import Parse from "parse/react-native";
import {MainButton} from "../../components/mainButton/MainButton";

const FirstScreen = ({ navigation }: any) => {
  React.useEffect(() => {
    (async () => {
      let user = await Parse.User.currentAsync();
      if (user) {
        navigation.navigate("LocationSelectionScreen");
      }
    })();
  }, []);

  return (
    <>
      <IntroductionScreen navigation={navigation} />
    </>
  );
};

export const IntroductionScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <ImageBackground
      blurRadius={1.7}
      fadeDuration={500}
      source={require("../../assets/images/first-page.jpg")}
      resizeMode="cover"
      style={styles.image}
    >
      <Text style={styles.heading}>SnackTime</Text>
    </ImageBackground>
    <View style={styles.bottomSection}>
      <View style={styles.bottomNavigation}>
        <Text style={styles.text}>Effortless reservations!</Text>
        <MainButton
          text="Get Started"
          onPress={() => {
            navigation.navigate("SignUpScreen", {});
          }}
        />
      </View>
    </View>
  </View>
);

export default FirstScreen;
