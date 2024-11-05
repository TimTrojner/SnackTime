import { View, SafeAreaView } from "react-native";
import SafeViewAndroid from "../../components/SafeAreaViewAndroid";
import React from "react";
import TopNavigation from "../../components/topNavigation/TopNavigation";
import CompletedOrders from "../../components/completedOrders/CompletedOrders";
import ActiveOrders from "../../components/activeOrders/ActiveOrders";

const OrdersScreen = ({ route, navigation }: any) => {
  return (
    <SafeAreaView
      style={[
        SafeViewAndroid.AndroidSafeArea,
        { backgroundColor: "#fff", flex: 1 },
      ]}
    >
      <TopNavigation
        showLeftButton
        leftAction={navigation.goBack}
        showRightButton
        textRight="Completed orders"
        rightAction={() =>
          navigation.navigate("OrdersScreen", { completedOrders: true })
        }
      />
      <View style={{ flex: 1 }}>
        {route.params.completedOrders ? (
          <View style={{ flex: 1 }}>
            <CompletedOrders />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <ActiveOrders
              navigation={navigation}
              userAddress={route.params.userAddress}
              restaurant={route.params.restaurant}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;
