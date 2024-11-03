import React from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Checkbox, { CheckboxEvent } from "expo-checkbox";

const MenuItem = ({ food, restaurantName }: any) => {
  // const [checked, setChecked] = React.useState(false);
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(false);
  React.useEffect(() => {}, [checked]);

  const cartItems: Map<string, object> = useSelector(
    (state: any) => state.cartReducer
  );

  const selectItem = (item: any, checked: boolean) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { item, restaurantName, checked },
    });
  };

  const dishInCart = (objId: string, cartItems: any) => {
    if (cartItems.has(restaurantName)) {
      const dishes: any = cartItems.get(restaurantName);
      if (dishes) {
        let dish = dishes.find((dish: any) => dish.id === objId);
        if (dish) {
          return true;
        }
      }
    } else {
      return false;
    }
  };

  return (
    <View>
      <View style={[styles.container]}>
        {/*<BouncyCheckbox*/}
        {/*  iconStyle={{ borderColor: "lightgray", borderRadius: 0 }}*/}
        {/*  fillColor={"green"}*/}
        {/*  // fillColor={"rgba(0,74,222,0.75)"}*/}
        {/*  useNativeDriver={true}*/}
        {/*  isChecked={dishInCart(food.id, cartItems)}*/}
        {/*  disableBuiltInState={false}*/}
        {/*  onPress={(checkboxValue) => {*/}
        {/*    selectItem(food, checkboxValue), setChecked(checkboxValue);*/}
        {/*  }}*/}
        {/*/>*/}
        <Checkbox
          style={{
            borderColor: "lightgray",
            marginRight: 10,
            marginLeft: 5,
            alignSelf: "center",
          }}
          value={dishInCart(food.id, cartItems)}
          onValueChange={(checkboxValue) => {
            selectItem(food, checkboxValue), setChecked(checkboxValue);
          }}
          color={"rgba(0,74,222,0.65)"}
        />
        <FoodInfo
          price={food.get("price")}
          desc={food.get("description")}
          name={food.get("name")}
        />
        <FoodImage photo={food.get("photo")} />
      </View>
      <Divider
        width={0.5}
        orientation="vertical"
        style={{ marginHorizontal: 20 }}
      />
    </View>
  );
};

export default MenuItem;

const FoodInfo = ({ name, desc, price }: any) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
      }}
    >
      <Text style={styles.title}>{name}</Text>
      <Text
        style={{
          fontSize: 14,
          color: "gray",
          fontWeight: "500",
        }}
      >
        {desc}
      </Text>
      <Text
        style={{
          fontWeight: "bold",
        }}
      >
        {price}
      </Text>
    </View>
  );
};

const FoodImage = ({ photo }: { photo: string }) => {
  return (
    <View>
      <Image
        source={
          photo.startsWith("https")
            ? { uri: photo }
            : require("../../assets/images/no_dish_img.jpg")
        }
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 15,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
