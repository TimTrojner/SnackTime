import React from "react";
import { SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import SafeViewAndroid from "../../components/SafeAreaViewAndroid";
import Ionicons from "react-native-vector-icons/Ionicons";
import TopNavigation from "../../components/topNavigation/TopNavigation";
import RestaurantItems from "../../components/restaurantItems/RestaurantItems";
import BottomNavigation from "../../components/bottomNavigation/BottomNavigation";

const RestaurantOptions = ({ route, navigation }: any) => {
  const [address, city, country] = route.params.address
    .get("address")
    .split(",");
  const [distance, setDistance] = React.useState(5);
  const [search, setSearch] = React.useState("");


  return (
    <SafeAreaView
      style={[
        SafeViewAndroid.AndroidSafeArea,
        { backgroundColor: "#fff", flex: 1 },
      ]}
    >
      <TopNavigation showLeftButton leftAction={navigation.goBack} />
      <View
        style={{
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            marginBottom: 15,
          }}
        >
          <Ionicons
            name="navigate-outline"
            size={20}
            style={{
              color: "rgba(0,74,222,0.6)",
            }}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "rgba(0,74,222,0.6)",
              marginLeft: 10,
            }}
          >
            {address}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            borderColor: "rgba(0,74,222,0.60)",
            borderRadius: 5,
            borderWidth: 1,
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <TextInput
            style={{
              height: 50,
              padding: 10,
              flex: 1,
            }}
            placeholder="Search for a restaurant"
            placeholderTextColor="#000"
            onChangeText={(text) => setSearch(text)}
          />
          <Ionicons
            name="search-outline"
            size={16}
            style={{ marginRight: 10, color: "rgba(0,74,222,0.6)" }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontWeight: "400",
            }}
          >
            Restaurants
          </Text>
          <View>
            <Text
              style={{
                fontWeight: "400",
              }}
            >
              near you
            </Text>
          </View>
        </View>
      </View>
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
                marginHorizontal: 20,
            }}
        >
            <RestaurantItems
                filter={{ distance, search}}
                userAddress={route.params.address}
                navigation={navigation}
            />
        </ScrollView>


      <BottomNavigation
        navigation={navigation}
        userAddress={route.params.address}
      />
    </SafeAreaView>
  );
};

export default RestaurantOptions;
