import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "./redux/store";
import OrdersScreen from "./screens/orderScreen/OrdersScreen";
import FirstScreen from "./screens/firstScreen/FirstScreen";
import SignUpScreen from "./screens/signUpScreen/SignUpScreen";
import LocationSelection from "./screens/locationSelectionScreen/LocationSelection";
import RestaurantOptions from "./screens/restaurantOptionScreen/RestaurantOptions";
import RestaurantDetailScreen from "./screens/restaurantDetailScreen/RestaurantDetailScreen";

const store = configureStore();

export default function RootNavigation() {
  const Stack = createStackNavigator();

  const screenOptions = {
    headerShown: false,
  };

  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
          <Stack.Screen name="Home" component={FirstScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen
            name="LocationSelectionScreen"
            component={LocationSelection}
          />
          <Stack.Screen
            name="RestaurantOptions"
            component={RestaurantOptions}
          />
          <Stack.Screen
            name="RestaurantDetailScreen"
            component={RestaurantDetailScreen}
          />
          <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ReduxProvider>
  );
}
