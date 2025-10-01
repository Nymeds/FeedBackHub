import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AppHeader({ title, onBack, onEdit, onDelete }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.button}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.button} />
      )}

      {/* Título centralizado */}
      <Text 
        style={styles.title} 
        numberOfLines={1} 
        ellipsizeMode="tail"
      >
        {title}
      </Text>


      {/* Botão de ação à direita: prioriza apagar > editar */}
      {onDelete ? (
        <TouchableOpacity onPress={onDelete} style={styles.button}>
          <Ionicons name="trash-outline" size={24} color="#000" />
        </TouchableOpacity>
      ) : onEdit ? (
        <TouchableOpacity onPress={onEdit} style={styles.button}>
          <Ionicons name="create-outline" size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.button} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  button: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
