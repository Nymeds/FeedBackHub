import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Comment } from "../api/comments";
import { Ionicons } from "@expo/vector-icons";

interface CommentCardProps {
  comment: Comment;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}

export default function CommentCard({ comment, onEdit, onDelete }: CommentCardProps) {
  const formattedDate = new Date(comment.createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.author}>{comment.autor || "Anônimo"} - {formattedDate}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(comment)} style={styles.iconButton}>
            <Ionicons name="create-outline" size={20} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(comment)} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
          </TouchableOpacity>
        </View>
      </View>
    
      <Text style={styles.text}>{comment.conteudo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  author: {
    fontWeight: "bold",
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 8,
  },
  text: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },
});
