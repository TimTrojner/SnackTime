import Parse from "parse/react-native";

export const doUserRegistration = async (
  username: string,
  password: string,
  email?: string
) => {
  // @ts-ignore
  return Parse.User.signUp(username, password);
};

export const doUserLogIn = async (username: string, password: string) => {
  return Parse.User.logIn(username, password);
};

export const isLoggedIn = async () => {
  return Parse.User.current() != null;
};

export const getUser = async () => {
  return Parse.User.current();
};

export const logOut = async () => {
  return Parse.User.logOut();
};
