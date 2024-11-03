import React from "react";
import { fetchUserOrders } from "../../api/dataFetching/dataFetch";
import { ScrollView, Text, View } from "react-native";
import { Divider } from "react-native-elements";
import { RestaurantDetails } from "../activeOrders/ActiveOrders";

const CompletedOrders = () => {
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const response = await fetchUserOrders();
      setOrders(response);
      console.log(response);
    })();
  }, []);

  return (
    <>
      {orders ? (
        <ScrollView style={{ flex: 1 }}>
          {orders.map((item: any, index: number) => {
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
                    address={item
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
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 20,
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: 10,
                  }}
                >
                  <Text>Order date</Text>
                  <Text>{dateStr}</Text>
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
        <Text>No orders</Text>
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
              ? "orange"
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
