import { View, Text, SafeAreaView } from "react-native";
import SafeViewAndroid from "../../components/SafeAreaViewAndroid";
import { ActiveOrders, CompletedOrders, TopNavigation } from "../../components";
import React from "react";

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
