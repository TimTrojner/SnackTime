import { Platform } from "react-native";
import RootNavigation from "./navigation";
import {PARSE_KEY, PARSE_TOKEN, PARSE_SERVER_URL} from "@env";

export default function App({ navigation, route }: any) {

  return (
    <>
      <RootNavigation />
    </>
  );
}
