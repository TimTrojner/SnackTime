import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "react-native-elements";
import { makeOrder } from "../../api/dataFetching/dataFetch";
import { getUser } from "../../api/userSignUp/parseSignUp";

const ActiveOrders = ({ route, navigation, restaurant, userAddress }: any) => {
  const [refresh, setRefresh] = React.useState(false);

  const cartItems: Map<string, object> = useSelector(
    (state: any) => state.cartReducer
  );

  React.useEffect(() => {}, [cartItems]);

  return (
    <>
      {cartItems.size > 0 ? (
        <ScrollView style={{ flex: 1 }}>
          {Array.from(cartItems).map((item: [string, any], index: number) => {
            return (
              <View style={{}} key={index}>
                {index >= 1 && (
                  <Divider
                    width={2}
                    orientation="vertical"
                    style={{ marginVertical: 15 }}
                  />
                )}
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() =>
                    navigation.navigate("RestaurantDetailScreen", {
                      restaurant: restaurant,
                      userAddress: userAddress,
                    })
                  }
                >
                  <RestaurantDetails
                    name={item[0]}
                    address={item[1][0]
                      .get("menu")
                      .get("restaurant")
                      .get("address")
                      .get("address")}
                  />
                  <Divider
                    width={1}
                    orientation="vertical"
                    style={{ backgroundColor: "lightgray" }}
                  />
                  <View>
                    {item[1].map((dish: any, index: number) => {
                      return <DishItem dish={dish} key={index} />;
                    })}
                  </View>
                </TouchableOpacity>
                <OrderActions items={item[1]} refresh={setRefresh} />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      )}
    </>
  );
};

export default ActiveOrders;

export const RestaurantDetails = ({ name, address }: any) => {
  return (
    <View
      style={{
        paddingHorizontal: 30,
        marginBottom: 8,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          color: "gray",
          fontSize: 12,
        }}
      >
        {address.split(",").slice(0, 2).join(",")}
      </Text>
    </View>
  );
};

export const DishItem = ({ dish }: any) => {
  return (
    <>
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            {dish.get("name")}
          </Text>
          <Text
            style={{
              color: "gray",
              fontSize: 11,
            }}
          >
            {dish.get("description")}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            backgroundColor: "#F2F6FD",
            paddingHorizontal: 5,
            paddingVertical: 3,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              // justifyContent: "center",
              // alignItems: "center",
            }}
          >
            {dish.get("price")}
          </Text>
        </View>
      </View>
      <Divider
        width={1}
        orientation="vertical"
        style={{ backgroundColor: "lightgray", marginHorizontal: 15 }}
      />
    </>
  );
};

export const OrderActions = ({ items, refresh }: any) => {
  const dispatch = useDispatch();

  const total = items.reduce(
    (acc: any, item: any) =>
      acc +
      parseFloat(item.get("price").split("€")[1].trim().replace(",", ".")),
    0
  );

  const finishOrder = async () => {
    let res = await makeOrder(
      items[0].get("menu").get("restaurant"),
      items,
      total
    );
    dispatch({
      type: "CLEAR_CART",
      payload: {
        restaurantName: items[0].get("menu").get("restaurant").get("name"),
      },
    });
    if (res) refresh((prevState: any) => !prevState);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        marginHorizontal: 10,
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "rgba(0,74,222,0.8)",
          paddingHorizontal: 8,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          Total:
        </Text>
        <Text
          style={{
            color: "white",
          }}
        >
          € {total.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={finishOrder}
        activeOpacity={0.8}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#BDDB63",
          borderRadius: 8,
          marginLeft: 20,
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "",
          }}
        >
          Confirm
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
