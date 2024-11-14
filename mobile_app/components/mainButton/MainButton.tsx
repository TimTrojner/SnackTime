import {ActivityIndicator, Text, TouchableOpacity} from "react-native";
import { styles } from "./MainButtonStyles";

type MainButtonProps = {
  disabled?: boolean;
  text: string;
    loading?: boolean;
  onPress: () => void;
};
export const MainButton = ({ disabled = false, loading=false, text, onPress }: MainButtonProps) => (
  <TouchableOpacity
    disabled={disabled}
    style={[styles.button, disabled && {backgroundColor: "rgba(0,74,222,0.3)"}]}
    activeOpacity={0.6}
    onPress={() => onPress()}
  >
    {loading && (
      <ActivityIndicator size="small" color="#0000ff" />
    )}
    <Text
        style={{
          color: "white",
          fontSize: 16,
        }}
    >
        {loading ? "Loading" : text}
    </Text>
  </TouchableOpacity>
);
