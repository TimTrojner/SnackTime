import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  FirstScreen,
  SignUpScreen,
} from "./screens";


export default function RootNavigation() {
  const Stack = createStackNavigator();

  const screenOptions = {
    headerShown: false,
  };

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
          <Stack.Screen name="Home" component={FirstScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
