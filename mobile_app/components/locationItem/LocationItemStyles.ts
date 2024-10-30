import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    flex: 1,
    // marginVertical: 5,
    // marginHorizontal: 20,
  },
  locationItemLeft: {
    marginRight: 10,
  },
  locationItemRight: {
    flexDirection: "column",
  },
  locationItemHeader: {
    fontSize: 16,
  },
  locationItemDescription: {
    fontSize: 14,
  },
});
