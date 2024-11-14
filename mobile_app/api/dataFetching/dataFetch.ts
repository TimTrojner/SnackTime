import Parse from "parse/react-native";
import { getUser } from "../userSignUp/parseSignUp";

export const fetchUserAddress = async (user: Parse.Object): Promise<any> => {
  try {
    const addressQuery = user.relation("address").query();
    return await addressQuery.find();
  } catch (error) {
    console.log(error);
  }
};

export const fetchRestaurants = async (
  address: Parse.Object,
  distance: number
) => {
  try {
    const userLocation: Parse.GeoPoint = await address.get("location");
    let innerQuery: Parse.Query = new Parse.Query("Address");
    innerQuery.near("location", userLocation);
    // innerQuery.withinKilometers("location", userLocation, distance, true);

    let query: Parse.Query = new Parse.Query("Restaurant");
    query.matchesQuery("address", innerQuery);
    query.include("address");
    // query.limit(10);
    // query.limit(7);

    // return await query.find();
    const results = await query.find();
    const modifiedResults = results.map((result) => {
      const restaurantAddress = result.get("address");
      const restaurantLocation = restaurantAddress.get("location");
      const distance = userLocation.kilometersTo(restaurantLocation);
      result.set("distance", distance);
      return result;
    });
    return modifiedResults;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchRestaurantCategories = async (
  restaurant: Parse.Object
): Promise<any> => {
  try {
    return await restaurant?.get("categories").query().find();
    // return await restaurant.relation("categories").query().find();
  } catch (error) {
    console.log(error);
  }
};

export const fetchRestaurantMenus = async (
  restaurant: Parse.Object
): Promise<any> => {
  try {
    const query = new Parse.Query("Menu");
    query.equalTo("restaurant", restaurant);
    return await query.find();
  } catch (error) {
    console.log(error);
  }
};

export const fetchRestaurantDishes = async (
  menu: Parse.Object
): Promise<any> => {
  try {
    const query: Parse.Query = new Parse.Query("Dish");
    query.equalTo("menu", menu);
    return await query.find();
  } catch (error) {
    console.log(error);
  }
};

export const addUserAddress = async (
  user: any,
  location: { full_address: string; location: { lat: number; lng: number } }
): Promise<any> => {
  try {
    const address = await makeAddressObject(
      location.full_address,
      location.location
    );
    const relation = user.relation("address");
    relation.add(address);
    return await user.save();
  } catch (error) {
    console.log(error);
  }
};

export const makeAddressObject = async (
  address: string,
  location: { lat: number; lng: number }
): Promise<any> => {
  try {
    const Address = new Parse.Object("Address");
    Address.set("address", address);
    Address.set("location", new Parse.GeoPoint(location.lat, location.lng));
    return await Address.save();
  } catch (error) {
    console.log(error);
  }
};

// export const calculateDistance = async (
//   userLocation: any,
//   restaurantLocation: any
// ) => {
//   try {
//     return await userLocation.kilometersTo(restaurantLocation);
//   } catch (error) {
//     console.log(error);
//   }
// };

export const makeOrder = async (
  restaurant: any,
  items: any,
  total: number
): Promise<any> => {
  try {
    let res_striped = restaurant.unset("distance");
    // const Dish = new Parse.Object("Dish");
    const Order = new Parse.Object("Order");
    Order.set("restaurant", res_striped);
    let usr = Parse.User.current();
    Order.set("user", usr);
    const relation = Order.relation("dishes");
    items.forEach((item: any) => {
      relation.add(item);
    });
    Order.set("total", total);
    Order.set("status", "pending");
    return await Order.save();
  } catch (error) {
    console.log(error);
  }
};

export const fetchUserOrders = async (): Promise<any> => {
  try {
    const user = await getUser();
    const query = new Parse.Query("Order");
    query.equalTo("user", user);
    // query.include("dishes");
    query.include("restaurant");

    // return await query.find();
    return await query.find();
  } catch (error) {
    console.log(error);
  }
};

export const fetchOrderDishes = async (order: any): Promise<any> => {
  try {
    return await order?.get("dishes").query().find();
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserAddress = async (user: any, address: any) => {
  try {
    const relation = user.relation("address");
    relation.remove(address);
    return await user.save();
  } catch (error) {
    console.log(error);
  }
};
