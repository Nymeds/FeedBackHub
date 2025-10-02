import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface FeedbackCardProps {
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
  autor: string;
  commentsCount: number;
  createdAt: string;
  onPress?: () => void;
}


const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export default function FeedbackCard({
  titulo,
  descricao,
  categoria,
  status,
  autor,
  commentsCount,
  createdAt,
  onPress,
}: FeedbackCardProps) {
  // Formatar data
  const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Topo: Categoria e Status */}
      <View style={styles.top}>
        <Text style={styles.category}>
          {truncateText(categoria, 15)}
        </Text>
        <Text style={styles.status}>
          {truncateText(status.replace("_", " "), 12)}
        </Text>
      </View>

      {/* Meio: Autor, Título e Descrição */}
      <View style={styles.middle}>
        <Text style={styles.author}>
          {truncateText(autor, 18)}
        </Text>
        <Text style={styles.title}>
          {truncateText(titulo, 30)}
        </Text>
        <Text style={styles.description}>
          {truncateText(descricao, 80)}
        </Text>
      </View>

      {/* Rodapé: Comentários e Data */}
      <View style={styles.bottom}>
        <View style={styles.comments}>
          <MaterialIcons name="comment" size={16} color="#555" />
          <Text style={styles.commentsText}>{commentsCount}</Text>
        </View>

        {/* Agrupando ícone + data */}
        <View style={styles.dateWrapper}>
          <MaterialIcons name="calendar-today" size={16} color="#555" />
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  category: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#007BFF",
    maxWidth: "70%",
  },
  status: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#28a745",
    textTransform: "capitalize",
    maxWidth: "30%",
    textAlign: "right",
  },
  middle: {
    marginBottom: 6,
  },
  author: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: "#333",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  comments: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentsText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#555",
  },
  dateWrapper: {
  flexDirection: "row",
  alignItems: "center",
},
date: {
  fontSize: 12,
  color: "#555",
  marginLeft: 4,
},

});
