import React, { useEffect } from "react";
import { Animated, Text, StyleSheet, Dimensions } from "react-native";

interface ErrorToastProps {
  message: string;
  onHide: () => void;
  duration?: number;
}

export default function ErrorToast({ message, onHide, duration = 3000 }: ErrorToastProps) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => onHide());
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const { width } = Dimensions.get("window");

  return (
    <Animated.View style={[styles.toast, { opacity, width: width - 40 }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 50,
    left: 20,
    backgroundColor: "#ff4d4d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 9999,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  text: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
