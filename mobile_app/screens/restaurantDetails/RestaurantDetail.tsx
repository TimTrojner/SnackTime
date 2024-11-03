import {View} from "react-native";
import {Divider} from "react-native-elements";
import {About, MenuItems, ViewCart} from "../../components";

const RestaurantDetail = ({route, navigation, ...props}: any) => {
    return (
        <View>
            <About route={route} />
            <Divider width={1.8} orientation="vertical"
            style={{marginVertical: 20}}/>
            <MenuItems food={props} restaurantName={route.params.name}/>
            <ViewCart navigation={navigation} restaurantName={route.params.name}/>
        </View>
    );
};

export default RestaurantDetail;