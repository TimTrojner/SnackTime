import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import MenuItem from "./MenuItem";
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
          <View  style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 }}>
        <ActivityIndicator size="large" color="#0000ff" />
          </View>
      )}
    </>
  );
};

export default MenuItems;
