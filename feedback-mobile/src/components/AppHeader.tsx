import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

export default function AppHeader({ title, onBack, onEdit, onDelete }: AppHeaderProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    Alert.alert(
      "Confirmação",
      "Deseja realmente deletar este feedback?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              await onDelete();
            } catch (err: any) {
              Alert.alert("Erro", err?.message || "Erro ao deletar");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.button}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      ) : (
        <View style={styles.button} />
      )}

      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>

      {onDelete ? (
        <TouchableOpacity onPress={handleDelete} style={styles.button} disabled={deleting}>
          <Ionicons name="trash-outline" size={24} color={deleting ? "#aaa" : "#000"} />
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
