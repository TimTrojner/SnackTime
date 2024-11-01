import React from "react";
import RestaurantItem from "./RestaurantItem";
import { fetchRestaurants } from "../../api/dataFetching/dataFetch";
import { ActivityIndicator, Text } from "react-native";

const RestaurantItems = ({ userAddress, setCity, navigation, filter }: any) => {
  const [restaurants, setRestaurants] = React.useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const response = await fetchRestaurants(userAddress, filter.distance);
      setRestaurants(response);
    })();
    setLoading(false);
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
      {loading ? (
        <>
          <Text>Loading</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </>
      ) : restaurants ? (
        filter.search ? (
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
          <Text>There are no restaurants near you to display!</Text>
        </>
      )}
    </>
  );
};
export default RestaurantItems;
