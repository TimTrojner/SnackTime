import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import SafeViewAndroid from "../../components/SafeAreaViewAndroid";
import {
  AutoCompleteSearchField,
  LocationItem,
  TopNavigation,
} from "../../components";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Divider } from "react-native-elements";
import { styles } from "./LocationSelectionScreenStyles";
import React from "react";

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
  // todo parse api
  };

  const removeAddress = async (address: any) => {
  };

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
          <AutoCompleteSearchField
            setPlace={setGooglePlaceInfo}
            createAddress={createAddress}
            placeholder="Search"
            RightButtonIcon={
              <Ionicons
                name="md-search-outline"
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
