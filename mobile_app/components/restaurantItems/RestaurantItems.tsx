import React from "react";
import RestaurantItem from "./RestaurantItem";
import { fetchRestaurants } from "../../api/dataFetching/dataFetch";
import {ActivityIndicator, Text, View} from "react-native";
import {useQuery} from "@tanstack/react-query";

const RestaurantItems = ({ userAddress, setCity, navigation, filter }: any) => {
  const [restaurants, setRestaurants] = React.useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = React.useState([]);

  // const { isLoading, error, restaurants } = useQuery({
  //   queryKey: ["restaurants"],
  //   queryFn: async () => {
  //     return await fetchRestaurants(userAddress, filter.distance);
  //   },
  // });

  React.useEffect(() => {
    (async () => {
      const response = await fetchRestaurants(userAddress, filter.distance);
      setRestaurants(response);
    })();
  }, []);

  React.useEffect(() => {
    if (filter.search) {
      (() => {
        const response = restaurants.filter((restaurant: any) =>
          restaurant
            .get("name")
            .toLowerCase()
            .includes(filter.search.toLowerCase())
        );
        setFilteredRestaurants(response);
      })();
    } else {
      setFilteredRestaurants([]);
    }
  }, [filter.search]);

  return (
    <>
      {restaurants.length > 0 ? (
        filter.search? (
            filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant: any, index: number) => (
            <RestaurantItem
              key={index}
              restaurant={restaurant}
              distanceInKilometers={restaurant.get("distance")}
              userAddress={userAddress}
              navigation={navigation}
            />
          ))
            ) : (
                <Text>No restaurants found</Text>
            )
        ) : (
          restaurants.map((restaurant: any, index: number) => {
            return (
              <RestaurantItem
                key={index}
                restaurant={restaurant}
                distanceInKilometers={restaurant.get("distance")}
                userAddress={userAddress}
                navigation={navigation}
              />
            );
          })
        )
      ) : (
        <>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#0000ff" />
            </View>
        </>
      )}
    </>
  );
};
export default RestaurantItems;
