import { Image, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { fetchRestaurantCategories } from "../../api/dataFetching/dataFetch";

const RestaurantItem = ({
  navigation,
  restaurant,
  distanceInKilometers,
  userAddress,
}: any) => {
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const response = await fetchRestaurantCategories(restaurant);
      setCategories(response);
    })();
  }, []);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ marginBottom: 30 }}
      onPress={() =>
        // todo detail screen
      }
    >
      <View>
        <RestaurantImage image={restaurant.get("image")} />
        <RestaurantInfo
          name={restaurant.get("name")}
          distanceInKilometers={distanceInKilometers}
          info={categories
            .map((category: any) => category.get("name"))
            .join(" • ")}
        />
      </View>
    </TouchableOpacity>
  );
};
export default RestaurantItem;

const RestaurantImage = ({ image }: any) => {
  return (
    <>
      <Image
        source={{
          uri: image,
        }}
        style={{
          width: "100%",
          height: 120,
          resizeMode: "cover",
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}
      />
    </>
  );
};

const RestaurantInfo = ({ name, distanceInKilometers, info }: any) => {
  const [distance, setDistance] = React.useState(null);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
        // marginTop: 10,
        // marginHorizontal: 10,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "gray",
          }}
        >
          {info}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#e9effc",
          height: 42,
          width: 58,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: "bold" }}>
          {distanceInKilometers.toFixed(2)}km
        </Text>
      </View>
    </View>
  );
};
