import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity, ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Divider } from "react-native-elements";
import { makeOrder } from "../../api/dataFetching/dataFetch";

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
                                <DatesContainer />
                                <Divider
                                    width={1}
                                    orientation="vertical"
                                    style={{
                                        backgroundColor: "lightgray",
                                        // marginTop: 15,
                                        marginHorizontal: 20,
                                    }}
                                />
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

const DatesContainer = () => {
    const [activeIndex, setActiveIndex] = React.useState<null | number>(null);
    const [dates, setDates] = React.useState<any>([]);
    useEffect(() => {
        (() => {
            let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            const dates = []; // today
            const curr = new Date();
            const day = curr.getDay();
            const remDaysCount = 7 - curr.getDay();
            for (let i = 1; i <= remDaysCount; i++) {
                const nextDate = new Date(curr.setDate(curr.getDate() + 1))
                    .toISOString()
                    .slice(0, 10);
                const index = i == remDaysCount ? days.length - 1 : curr.getDay() - 1;
                dates.push(days[index] + "-" + nextDate);
            }
            setDates(dates);
        })();
    }, []);
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginHorizontal: 15,
                marginVertical: 20,
            }}
        >
            {dates ? (
                dates.map((date: any, index: number) => {
                    const [dayName, year, month, day] = date.split("-");
                    return (
                        <TouchableOpacity
                            activeOpacity={0.5}
                            onPress={() => setActiveIndex(index)}
                            key={index}
                            style={{
                                backgroundColor:
                                    index == activeIndex ? "rgba(0,74,222,0.8)" : "#F2F6FD",
                                borderRadius: 10,
                                padding: 7,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: index == activeIndex ? "white" : "black",
                                }}
                            >
                                {dayName}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: index == activeIndex ? "white" : "black",
                                }}
                            >
                                {day}/{month}
                            </Text>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <View></View>
            )}
        </View>
    );
};

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
    const [placingOrder, setPlacingOrder] = React.useState(false);

    const total = items.reduce(
        (acc: any, item: any) =>
            acc +
            parseFloat(item.get("price").split("€")[1].trim().replace(",", ".")),
        0
    );
    // [{"createdAt": "2023-01-14T15:39:06.952Z", "dishes": [Object], "objectId": "ANzCQiZwFR", "restaurant": [Object], "status": "pending", "total": 23.5, "updatedA
    //   t": "2023-01-14T15:39:06.952Z", "user": [Object]}, {"createdAt": "2023-01-16T13:55:28.449Z", "dishes": [Object], "objectId": "et35OfSwAO", "restaurant": [Object], "status": "pending", "total": 6.5, "updatedAt": "2023-01-16T13:55:28.449Z", "user": [Object]}]

    const finishOrder = async () => {
        setPlacingOrder(true);
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
        setPlacingOrder(false);
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
                {placingOrder ? (
                    <View style={{}}>
                    <ActivityIndicator size="small" color="white" />
                        <Text style={{}}>Placing order...</Text>
                    </View>
                ) : (

                <Text
                >
                    Place order
                </Text>)}
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
