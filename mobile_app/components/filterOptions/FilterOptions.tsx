import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import React from "react";

export const FilterOptions = ({
  menu = true,
  items: items,
  selected: selected,
  set_selected: set_selected,
}: any) => {
  if (menu) {
    return (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          width: "100%",
          padding: 5,
        }}
      >
        <TouchableOpacity
          style={{
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 60,
              padding: 7,
              backgroundColor: "#F2F6FD",
            }}
          >
            <Entypo
              name="sound-mix"
              size={16}
              style={{
                marginHorizontal: 10,
                color: "rgba(0,74,222,0.6)",
                transform: [{ rotate: "90deg" }],
              }}
            />
          </View>
        </TouchableOpacity>
        {items && selected ? (
          items.map((item: any, index: number) => {
            return (
              <TouchableOpacity
                key={index}
                style={{
                  marginHorizontal: 10,
                }}
                onPress={() => set_selected(item)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    paddingVertical: 7,
                    paddingHorizontal: 15,
                    backgroundColor:
                      item.get("name") == selected.get("name")
                        ? "rgba(0,74,222,0.75)"
                        : "#F2F6FD",
                  }}
                >
                  <Text
                    style={{
                      color:
                        item.get("name") === selected.get("name")
                          ? "#fff"
                          : "black",
                    }}
                  >
                    {item.get("name")}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <>
            <Text>Menus are loading</Text>
          </>
        )}
      </ScrollView>
    );
  } else {
    return (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <TouchableOpacity
          style={{
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 60,
              padding: 10,
              backgroundColor: "#F2F6FD",
            }}
          >
            <Entypo
              name="sound-mix"
              size={16}
              style={{
                marginHorizontal: 10,
                color: "rgba(0,74,222,0.6)",
                transform: [{ rotate: "90deg" }],
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
              padding: 10,
              backgroundColor: "#F2F6FD",
            }}
          >
            <Text
              style={{
                color: "#000",
                fontSize: 12,
                marginRight: 10,
              }}
            >
              Sort
            </Text>
            <Entypo
              name="chevron-thin-down"
              size={14}
              style={{
                color: "rgba(0,74,222,0.6)",
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
};
