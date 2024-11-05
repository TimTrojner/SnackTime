import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Ionicons from "react-native-vector-icons/Ionicons";
import {GOOGLE_PLACES_AUTOCOMPLETE} from '@env';


const AutoCompleteSearchField = ({
  placeholder,
  leftButton = true,
  RightButtonIcon,
  setPlace,
  setRefresh,
  createAddress,
}: any) => {
  return (
    <View
      style={{
        flexDirection: "row",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(0,74,222,0.5)",
        marginVertical: 10,
        paddingVertical: 3,
      }}
    >
      <GooglePlacesAutocomplete
        fetchDetails
        placeholder={placeholder}
        query={{ key: GOOGLE_PLACES_AUTOCOMPLETE,
        }}
        onPress={(data, details = null) => {
          const full_address = data.description;
          const location = details?.geometry.location;
          // setPlace({ full_address, location });
          // setRefresh(true);
          createAddress({ full_address, location });
        }}
        styles={{
          textInput: {
            height: "100%",
            fontWeight: "400",
          },
          textInputContainer: {
            // flexDirection: "row",
            // alignItems: "center",
          },
        }}
        renderLeftButton={() => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 5,
            }}
          >
            {leftButton && (
              <Ionicons
                name="location-outline"
                size={20}
                style={{
                  color: "rgba(0,74,222,0.6)",
                }}
              />
            )}
          </View>
        )}
        renderRightButton={() => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 3,
            }}
          >
            {RightButtonIcon}
          </View>
        )}
      />
    </View>
  );
};

export default AutoCompleteSearchField;
