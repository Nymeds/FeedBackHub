import React, { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet, Dimensions } from "react-native";

interface ErrorToastProps {
  message: string;
  onHide: () => void;
  duration?: number;
  type?: "success" | "error";
}

export default function ErrorToast({
  message,
  onHide,
  duration = 3000,
  type = "error",
}: ErrorToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Timer para fade out
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onHide());
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onHide, opacity]);

  const { width } = Dimensions.get("window");

  const backgroundColor = type === "success" ? "#4CAF50" : "#ff4d4d"; 

  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity, backgroundColor, width: width - 40 },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 50,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 9999,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
