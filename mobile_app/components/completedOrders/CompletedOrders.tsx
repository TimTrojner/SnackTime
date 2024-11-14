import React, { useEffect, useRef } from "react";
import {
  fetchOrderDishes,
  fetchUserOrders,
} from "../../api/dataFetching/dataFetch";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-elements";
import { DishItem, RestaurantDetails } from "../activeOrders/ActiveOrders";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useQuery } from "@tanstack/react-query";

const CompletedOrders = () => {
  // [{"createdAt": "2023-01-14T15:39:06.952Z", "dishes": [Object], "objectId": "ANzCQiZwFR", "restaurant": [Object], "status": "pending", "total": 23.5, "updatedA
  //   t": "2023-01-14T15:39:06.952Z", "user": [Object]}, {"createdAt": "2023-01-16T13:55:28.449Z", "dishes": [Object], "objectId": "et35OfSwAO", "restaurant": [Object], "status": "pending", "total": 6.5, "updatedAt": "2023-01-16T13:55:28.449Z", "user": [Object]}]

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["orders"],
  //   queryFn: fetchUserOrders,
  // });

  const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    useEffect(() => {
        (async () => {
            const orders = await fetchUserOrders();
            setData(orders);
            setIsLoading(false);
        })();
    }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    data.length > 0 ? (
        <ScrollView style={{ flex: 1 }}>
            {data.map((item: any, index: number) => {
                const date = new Date(item.createdAt);
                const dateStr = `${date.getDate()}/${(date.getMonth() + 1)
                    .toString()
                    .padStart(
                        2,
                        "0"
                    )}/${date.getFullYear()}:${date.getHours()}:${date.getMinutes()}`;
                return (
                    <View style={{}} key={index}>
                        {index >= 1 && (
                            <Divider
                                width={2}
                                orientation="vertical"
                                style={{ marginVertical: 15 }}
                            />
                        )}
                        <View>
                            <RestaurantDetails
                                name={item.get("restaurant").get("name")}
                                address={item.get("restaurant").get("address").get("address")}
                            />
                            <Divider
                                width={1}
                                orientation="vertical"
                                style={{ backgroundColor: "lightgray" }}
                            />
                        </View>
                        {/*<OrderActions items={item[1]} refresh={setRefresh} />*/}
                        <View
                            style={{
                                flexDirection: "row",
                                marginHorizontal: 30,
                                alignItems: "center",
                                justifyContent: "space-between",
                                margin: 10,
                            }}
                        >
                            <Text>Order placed</Text>
                            <Text>{dateStr}</Text>
                        </View>
                        <Divider
                            width={1}
                            orientation="vertical"
                            style={{ backgroundColor: "lightgray" }}
                        />
                        <View>
                            <ShowDishesContainer order={item} />
                        </View>
                        <Divider
                            width={1}
                            orientation="vertical"
                            style={{ backgroundColor: "lightgray" }}
                        />
                        <OrderStatus
                            status={item.get("status")}
                            total={item.get("total")}
                        />
                    </View>
                );
            })}
        </ScrollView>
    ) : (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            <Text style={{
                fontSize: 18,
                fontWeight: "bold",
            }}>
                No completed orders
            </Text>
        </View>
    )
    );
};

const ShowDishesContainer = ({ order }: any) => {
  const [showDishes, setShowDishes] = React.useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 150,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setShowDishes(!showDishes);
          slideIn();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          margin: 10,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Dishes</Text>
        <FontAwesome5 name={showDishes ? "angle-up" : "angle-down"} size={14} />
      </TouchableOpacity>
      {showDishes && (
        <Animated.View style={{ height: slideAnim }}>
          <OrderDisplay order={order} />
        </Animated.View>
      )}
    </View>
  );
};

const OrderDisplay = ({ order }: any) => {
  const [dishes, setDishes] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      const dishes = await fetchOrderDishes(order);
      setDishes(dishes);
        setIsLoading(false);
    })();
  }, []);

    if (isLoading) {
        return (
        <View
            style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            }}
        >
            <ActivityIndicator size="large" color="#0000ff" />
        </View >
        );
    }
  return (
    <>
      {dishes ? (
        <ScrollView style={{ flex: 1, marginHorizontal: 15 }}>
          {dishes.map((item: any, index: number) => {
            return <DishItem dish={item} key={index} />;
          })}
        </ScrollView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </>
  );
};

const OrderStatus = ({ status, total }: any) => {
  const statusColor = {
    pending: "orange",
    completed: "#BDDB63",
    cancelled: "red",
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor:
            status === "pending"
              ? "rgba(255,199,101,0.69)"
              : status === "completed"
              ? "#BDDB63"
              : "red",
          borderRadius: 8,
          marginLeft: 40,
          padding: 10,
        }}
      >
        <Text
          style={{
            color: "",
          }}
        >
          {status}
        </Text>
      </View>
    </View>
  );
};

export default CompletedOrders;
