import React from "react";
import { View, Text, TextInput, TextInputProps, StyleSheet } from "react-native";
import { Control, Controller } from "react-hook-form";

interface AppInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  label?: string;
  error?: string;
}

export default function AppInput({ control, name, label, error, ...props }: AppInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur } }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            {...props}
            style={[styles.input, props.style]}
          />
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
  },
  error: {
    color: "red",
    marginTop: 4,
  },
});
