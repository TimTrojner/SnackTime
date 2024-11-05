import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Divider } from "react-native-elements";
import React, { useRef } from "react";
import { styles } from "./LocationItemStyles";

export const LocationItem = ({
  addressItem,
  navigation,
  removeAddress,
}: any) => {
  const [street, city, country] = addressItem.get("address").split(",");
  const slideAnim = useRef(new Animated.Value(70)).current;

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: -20,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity
          style={styles.locationItem}
          onPress={() =>
            navigation.navigate("RestaurantOptions", { address: addressItem })
          }
          onLongPress={slideIn}
        >
          <View style={styles.locationItemLeft}>
            <Ionicons
              name="navigate-outline"
              size={20}
              style={{
                color: "rgba(0,74,222,0.6)",
              }}
            />
          </View>
          <View style={styles.locationItemRight}>
            <Text style={styles.locationItemHeader}>{street}</Text>
            <Text style={styles.locationItemDescription}>
              {city}, {country}
            </Text>
          </View>
        </TouchableOpacity>
        <Animated.View
          style={[
            animatedStyles.container,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <TouchableOpacity onPress={() => removeAddress(addressItem)}>
            <Ionicons name={"trash-outline"} size={25} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Divider width={1} orientation="vertical" style={{ marginVertical: 5 }} />
    </>
  );
};

const animatedStyles = StyleSheet.create({
  container: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    // height: "100%",
    backgroundColor: "rgba(250,28,28,0.10)",
    borderRadius: 10,
    marginVertical: 5,
  },
});
