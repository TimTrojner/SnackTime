import {
  Animated,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../components/screen_dimensions";
import React, { useRef } from "react";
import { FilterOptions, MenuItems, TopNavigation } from "../../components";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {
  fetchRestaurantDishes,
  fetchRestaurantMenus,
} from "../../api/dataFetching/dataFetch";
import { LatLng } from "react-native-google-places-api";

const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.9;
const BOTTOM_SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.4;
const MAX_UPWARD_TRANSLATE_Y =
  BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT;
const MAX_DOWNWARD_TRANSLATE_Y = 0;
const DRAG_THRESHOLD = 50;

const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const RestaurantDetailScreen = ({ route, navigation }: any) => {
  const [data, setData] = React.useState<Map<string, Array<any>>>();
  const [menus, setMenus] = React.useState<any>();
  const [selectedMenu, setSelectedMenu] = React.useState<any>();
  const mapRef = useRef<MapView>(null);

  const userPosition = {
    latitude: route.params.userAddress.get("location").latitude,
    longitude: route.params.userAddress.get("location").longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const restaurantPosition = route.params.restaurant;

  React.useEffect(() => {
    (async () => {
      const response = await fetchRestaurantMenus(route.params.restaurant);
      // setMenus(new Set(response.keys()));
      // setData(response);
      setMenus(response);
      setSelectedMenu(response[0]);
    })();
    // traceRoute();
  }, []);

  React.useEffect(() => {
    (async () => {
      const response = await fetchRestaurantDishes(selectedMenu);
      setData(response);
    })();
  }, [selectedMenu]);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        animatedValue.setValue(gesture.dy);
      },
      onPanResponderRelease: (event, gesture) => {
        animatedValue.flattenOffset();
        // lastGestureDy.current += gesture.dy;
        // if (lastGestureDy.current < MAX_UPWARD_TRANSLATE_Y) {
        //   lastGestureDy.current = MAX_UPWARD_TRANSLATE_Y;
        // } else if (lastGestureDy.current > MAX_DOWNWARD_TRANSLATE_Y) {
        //   lastGestureDy.current = MAX_DOWNWARD_TRANSLATE_Y;
        // }
        if (gesture.dy > 0) {
          if (gesture.dy <= DRAG_THRESHOLD) {
            springAnimation("up");
          } else {
            springAnimation("down");
          }
        } else {
          if (gesture.dy >= -DRAG_THRESHOLD) {
            springAnimation("down");
          } else {
            springAnimation("up");
          }
        }
      },
      onPanResponderGrant: (event, gesture) => {
        animatedValue.setOffset(lastGestureDy.current);
        animatedValue.setValue(0);
      },
    })
  ).current;

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const springAnimation = (direction: "up" | "down") => {
    lastGestureDy.current =
      direction === "down" ? MAX_DOWNWARD_TRANSLATE_Y : MAX_UPWARD_TRANSLATE_Y;
    Animated.spring(animatedValue, {
      toValue: lastGestureDy.current,
      useNativeDriver: true,
    }).start();
  };

  const bottomSheetAnimation = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          outputRange: [MAX_UPWARD_TRANSLATE_Y, MAX_DOWNWARD_TRANSLATE_Y],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const traceRoute = () => {
    let destination = {
      latitude: restaurantPosition.get("address").get("location").latitude,
      longitude: restaurantPosition.get("address").get("location").longitude,
    };
    let origin = {
      latitude: userPosition.latitude,
      longitude: userPosition.longitude,
    };

    mapRef.current?.fitToCoordinates([origin, destination], {
      edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View>
        <View
          style={{
            height: 600,
            backgroundColor: "blue",
          }}
        >
          <MapView style={{ flex: 1 }} initialRegion={userPosition}>
            <Marker coordinate={userPosition}></Marker>
            <Marker
              coordinate={{
                latitude: restaurantPosition.get("address").get("location")
                  .latitude,
                longitude: restaurantPosition.get("address").get("location")
                  .longitude,
              }}
            ></Marker>
            <MapViewDirections
              apikey="AIzaSyCsJdBbYxpyS5U198_DyNtCaujs21IsQ_o"
              origin={userPosition}
              destination={{
                latitude: restaurantPosition.get("address").get("location")
                  .latitude,
                longitude: restaurantPosition.get("address").get("location")
                  .longitude,
              }}
              strokeWidth={6}
              strokeColor="blue"
              onReady={traceRoute}
              // args.distance, duration
            />
          </MapView>
        </View>
      </Animated.View>
      <Animated.View style={[styles.bottomSheet, bottomSheetAnimation]}>
        <View style={styles.draggableArea} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <TopNavigation
            heading={route.params.restaurant.get("name")}
            showLeftButton
            showRightButton
            textRight={"Cart"}
            rightAction={() =>
              navigation.navigate("OrdersScreen", {
                completedOrders: false,
                userAddress: route.params.userAddress,
                restaurant: route.params.restaurant,
              })
            }
            leftAction={() => navigation.goBack()}
          />
          <View
            style={{
              marginBottom: 20,
            }}
          >
            <FilterOptions
              menu={true}
              menu_items={menus}
              selected_menu={selectedMenu}
              set_selected_menu={setSelectedMenu}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              marginHorizontal: 20,
            }}
          >
            <MenuItems
              dishes={data}
              restaurantName={route.params.restaurant.get("name")}
            />
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
  },
  bottomSheet: {
    position: "absolute",
    width: "100%",
    height: BOTTOM_SHEET_MAX_HEIGHT,
    bottom: BOTTOM_SHEET_MIN_HEIGHT - BOTTOM_SHEET_MAX_HEIGHT,
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#a8bed2",
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 6,
      },
    }),
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragHandle: {
    width: 100,
    height: 6,
    backgroundColor: "#d3d3d3",
    borderRadius: 10,
  },
  draggableArea: {
    height: 32,
    width: 132,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
});

export default RestaurantDetailScreen;
