import { ScrollView, Text} from "react-native";
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
        <Text>Dishes are fetching!</Text>
      )}
    </>
  );
};

export default MenuItems;
