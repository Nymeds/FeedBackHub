import React from "react";
import { View, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchInputProps extends TextInputProps {
  iconSize?: number;
  iconColor?: string;
}

export default function SearchInput({ iconSize = 20, iconColor = "#888", style, ...props }: SearchInputProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={iconSize} color={iconColor} style={styles.icon} />
      <TextInput
        style={{ flex: 1 }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
});
