import { Text, TextInput, View } from "react-native";
import { styles } from "../../screens/signUpScreen/SignUpScreenStyles";
import React from "react";

type InputProps = {
  label: string;
  placeholder: string;
  state: string;
  handleInput: (name: string, value: string) => void;
};
export const Input = ({
  label,
  placeholder,
  state,
  handleInput,
}: InputProps) => {
  let name = label.toLowerCase();
  if (name === "confirm password") {
    name = "passwordconfirm";
  }

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input]}
        placeholder={placeholder}
        // autoFocus={true}
        value={state}
        onChange={(e) => handleInput(name, e.nativeEvent.text)}
        // onChangeText={(text) => handleInput(label.toLowerCase(), text)}
        enablesReturnKeyAutomatically={true}
        autoCapitalize={"none"}
        secureTextEntry={label === "Password" || label === "Confirm password"}
      />
    </View>
  );
};
