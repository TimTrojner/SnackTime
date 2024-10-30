import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    // justifyContent: "center",
    opacity: 1,
  },
  heading: {
    color: "white",
    fontSize: 42,
    lineHeight: 85,
    fontWeight: "bold",
    textAlign: "left",
    paddingHorizontal: 25,
    backgroundColor: "rgba(0,0,0,0.25)",
    position: "relative",
    top: 130,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    height: 190,
    borderTopWidth: 3,
    borderTopColor: "rgba(0,0,0,0.2)",
  },
  bottomNavigation: {
    flex: 1,
    padding: 25,
  },
  text: {
    color: "black",
    fontSize: 20,
    lineHeight: 35,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
});
