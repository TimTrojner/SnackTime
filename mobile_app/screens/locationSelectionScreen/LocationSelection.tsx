import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import SafeViewAndroid from "../../components/SafeAreaViewAndroid";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Divider } from "react-native-elements";
import {
  addUserAddress,
  deleteUserAddress,
  fetchUserAddress,
} from "../../api/dataFetching/dataFetch";
import React from "react";
import { getUser } from "../../api/userSignUp/parseSignUp";
import Parse from "parse/react-native";
import { styles } from "./LocationSelectionScreenStyles";
import TopNavigation from "../../components/topNavigation/TopNavigation";
import AutoCompleteSearchField from "../../components/searchField/AutoCompleteSearchField";
import {LocationItem} from "../../components/locationItem/LocationItem";

const LocationSelection = ({ route, navigation }: any) => {
  const [userAddress, setUserAddress] = React.useState([]);
  const [googlePlaceInfo, setGooglePlaceInfo] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const createAddress = async ({
    full_address,
    location,
  }: {
    full_address: string;
    location: { lat: number; lng: number };
  }) => {
    let MyObject = Parse.Object.extend("Address");
    let myObject = new MyObject();
    myObject.set("address", full_address);
    myObject.set("location", new Parse.GeoPoint(location.lat, location.lng));

    const res = await myObject.save(null);
    if (res) {
      if (!userAddress) {
        // @ts-ignore
        setUserAddress([res]);
      } else {
        //@ts-ignore
        setUserAddress((prev: any) => [...prev, res]);
      }
    }
    const user = await getUser();
    const address: any = await addUserAddress(user, { full_address, location });
  };

  const removeAddress = async (address: any) => {
    const addressToRemove = userAddress.filter(
      (item: any) => item.get("address") !== address.get("address")
    );
    setUserAddress(addressToRemove);
    const user = await getUser();
    await deleteUserAddress(user, address);
  };

  React.useEffect(() => {
    (async () => {
      const user = await getUser();
      const address_list = await fetchUserAddress(user);
      setUserAddress(address_list);
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaView
      style={[
        SafeViewAndroid.AndroidSafeArea,
        { backgroundColor: "#fff", flex: 1 },
      ]}
    >
      <TopNavigation showLeftButton leftAction={navigation.goBack} />
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.header}>Find restaurants near your location</Text>
          <Text style={styles.description}>
            We will use your location to find restaurants near you
          </Text>
          <Text style={[styles.description, {color: "rgba(234,13,13,0.38)"}]}>
            Long-press on location to remove it
          </Text>
          <AutoCompleteSearchField
            setPlace={setGooglePlaceInfo}
            createAddress={createAddress}
            placeholder="Search"
            RightButtonIcon={
              <Ionicons
                name="search-outline"
                size={16}
                style={{ marginRight: 10, color: "rgba(0,74,222,0.6)" }}
              />
            }
          />
        </View>
        <View>
          <Divider width={1} orientation="vertical" style={{ marginTop: 20 }} />
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 50,
              }}
            >
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <LocationItems
              addressItems={userAddress}
              navigation={navigation}
              removeAddress={removeAddress}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LocationSelection;

const LocationItems = ({ addressItems, navigation, removeAddress }: any) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.locationContainer}
    >
      {addressItems ? (
        addressItems.map((item: any, index: number) => (
          <LocationItem
            key={index}
            addressItem={item}
            navigation={navigation}
            removeAddress={removeAddress}
          />
        ))
      ) : (
        <Text style={{}}>No saved locations to display</Text>
      )}
    </ScrollView>
  );
};
