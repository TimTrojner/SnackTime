import { Platform } from "react-native";
import RootNavigation from "./navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Parse from "parse/react-native";
import { useCallback } from "react";
import {PARSE_APP_ID, JAVASCRIPT_KEY, PARSE_SERVER_URL} from "@env";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';

Parse.setAsyncStorage(AsyncStorage);

Parse.initialize(
  PARSE_APP_ID,
  JAVASCRIPT_KEY
);
Parse.serverURL = PARSE_SERVER_URL;

const queryClient = new QueryClient();

export default function App({ navigation, route }: any) {
  useCallback(() => {
    (async () => {
      // @ts-ignore
      const Installation = Parse.Object.extend(Parse.Installation);
      const installation = new Installation();

      installation.set("deviceType", Platform.OS);
      await installation.save();
    })();
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
      <Toast />
    </>
  );
}
