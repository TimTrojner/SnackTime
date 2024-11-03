import { Image, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { Divider } from "react-native-elements";
import { MenuItem } from "../index";
import { useSelector } from "react-redux";
const MenuItems = ({ dishes, restaurantName }: any) => {
  return (
    <>
      {dishes ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {dishes.map((dish: any, i: number) => (
            <MenuItem food={dish} key={i} restaurantName={restaurantName} />
          ))}
        </ScrollView>
      ) : (
        <Text>Dishes are fetching!</Text>
      )}
    </>
  );
};

export default MenuItems;
