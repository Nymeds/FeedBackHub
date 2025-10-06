import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, StyleSheet } from "react-native";
import { Control, Controller } from "react-hook-form";

interface AppInputProps extends TextInputProps {
  control: Control<any>;
  name: string;
  label?: string;
  error?: string;
  showCount?: boolean; 
}

export default function AppInput({
  control,
  name,
  label,
  error,
  showCount = false,
  maxLength,
  ...props
}: AppInputProps) {
  const [count, setCount] = useState(0);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur } }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}

          <TextInput
            value={value}
            onChangeText={(text) => {
              onChange(text);
              setCount(text.length); 
            }}
            onBlur={onBlur}
            maxLength={maxLength} 
            {...props}
            style={[styles.input, props.style]}
          />

          {showCount && maxLength && (
            <Text style={styles.counter}>
              {count}/{maxLength}
            </Text>
          )}

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
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
  counter: {
    textAlign: "right",
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
