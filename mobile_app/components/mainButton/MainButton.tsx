import { Text, TouchableOpacity } from "react-native";
import { styles } from "./MainButtonStyles";

type MainButtonProps = {
  disabled?: boolean;
  text: string;
  onPress: () => void;
};
export const MainButton = ({
  disabled = true,
  text,
  onPress,
}: MainButtonProps) => (
  <TouchableOpacity
    style={styles.button}
    activeOpacity={0.7}
    onPress={() => onPress()}
  >
    <Text
      style={{
        color: "white",
        fontSize: 16,
      }}
    >
      {text}
    </Text>
  </TouchableOpacity>
);
