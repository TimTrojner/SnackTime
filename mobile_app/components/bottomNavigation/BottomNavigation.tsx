import { Alert, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Divider } from "react-native-elements";
import { logOut } from "../../api/userSignUp/parseSignUp";
import { useEffect, useState } from "react";
import Parse from "parse/react-native.js";

const BottomNavigation = ({ navigation, userAddress }: any) => {
  const logOutUser = async () => {
    Alert.alert("Logout", "Are you sure you want to logout!", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          await logOut();
          navigation.navigate("Home");
        },
      },
    ]);
  };
  return (
    <>
      <Divider width={1.2} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <Icon icon="location-arrow" text="Location" navigation={navigation} />
        <Icon
          icon="shopping-basket"
          text="Cart"
          navigation={navigation}
          userAddress={userAddress}
        />
        <Icon icon="shopping-cart" text="Orders" navigation={navigation} />
        <Icon icon="sign-out-alt" text="Logout" action={logOutUser} />
      </View>
    </>
  );
};

export default BottomNavigation;

const Icon = ({ icon, text, action, navigation, userAddress }: any) => {
  const [user, setUser] = useState<any>("");

  useEffect(() => {
    (async () => {
      if (text === "Logout") {
        const user = await Parse.User.currentAsync();
        setUser(user?.get("username"));
      }
    })();
  }, [userAddress]);

  const onPress = () => {
    if (action) {
      action();
    } else if (text === "Cart") {
      navigation.navigate("OrdersScreen", {
        completedOrders: false,
      });
    } else if (text === "Orders") {
      navigation.navigate("OrdersScreen", {
        userAddress: userAddress,
        completedOrders: true,
      });
    } else {
      navigation.navigate("LocationSelectionScreen");
    }
  };

  return (
    <TouchableOpacity onPress={() => onPress()}>
      <View style={{}}>
        <FontAwesome5
          name={icon}
          size={16}
          style={{
            marginBottom: 3,
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            fontSize: 12,
          }}
        >
          {text === "Logout" ? (user ? user : "...") : text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
