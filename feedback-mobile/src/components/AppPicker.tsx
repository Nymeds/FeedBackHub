// AppPicker.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Controller, Control } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";

interface AppPickerProps {
  control: Control<any>;
  name: string;
  label?: string;
  enumValues: string[];
}

export default function AppPicker({ control, name, label, enumValues }: AppPickerProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={{ marginBottom: 16 }}>
          {label && <Text style={styles.label}>{label}</Text>}
          <View style={styles.pickerContainer}>
            <Picker selectedValue={value} onValueChange={onChange}>
              {enumValues.map((v) => (
                <Picker.Item key={v} label={v} value={v} />
              ))}
            </Picker>
          </View>
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
});
