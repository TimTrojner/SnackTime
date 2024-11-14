import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

type TopNavigationProps = {
  showRightButton?: boolean;
  showLeftButton?: boolean;
  heading?: string;
  textRight?: string;
  rightAction?: () => void;
  leftAction?: () => void;
  textLeft?: string;
};
const TopNavigation = ({
  showRightButton = false,
  showLeftButton = false,
  heading,
  textRight = "Skip",
  leftAction,
  rightAction,
  textLeft = "Back",
}: TopNavigationProps) => {
  return (
    <View style={styles.container}>
      {showLeftButton ? (
        <TouchableOpacity onPress={() => leftAction!()}>
          <View
            style={{
              flexDirection: "row",
              marginLeft: -10,
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginRight: -16,
              }}
            >
              <AntDesign name="left" size={22} color="black" />
              <Text
                style={{
                  fontWeight: "400",
                }}
              >
                {textLeft}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
      {heading && (
        <View>
          <Text>{heading}</Text>
        </View>
      )}

      {showRightButton ? (
        <TouchableOpacity style={(textRight == "Login" || textRight == "Sign In") && {borderStyle: "solid", borderWidth: 1, borderRadius: 5, borderColor: "rgba(0,74,222,0.9)"
        }} onPress={() => rightAction!()}>
          <Text
            style={{
              color: "rgba(0,74,222,0.9)",
              fontWeight: "500",
              padding: 10,
            }}
          >
            {textRight}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 5 }}></View>
      )}
    </View>
  );
};

export default TopNavigation;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
    height: 50,
  },
});
