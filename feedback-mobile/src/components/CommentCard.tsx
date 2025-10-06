import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Comment } from "../api/comments";
import { useToast } from "../context/ToastProvider";

interface CommentCardProps {
  comment: Comment;
  idfeedback: string;
  onEdit: (idcomment: string, texto: string) => Promise<any>;
  onDelete: (idcomment: string) => Promise<any>;
}

export default function CommentCard({ comment, idfeedback, onEdit, onDelete }: CommentCardProps) {
  const formattedDate = new Date(comment.createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [textUpdate, setTextUpdate] = useState(comment.conteudo);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();

  // Salvar edição
  const handleSave = async () => {
    if (!textUpdate.trim()) {
      setErrorMessage("O comentário não pode ser vazio");
      return;
    }
    setErrorMessage(""); 
    setSaving(true);
    try {
      await onEdit(comment.idcomment, textUpdate);
      showToast("Comentário editado com sucesso", 2000, "success");
      setIsEditing(false);
    } catch (err: any) {
      if (err.details?.length > 0) {
        showToast(err.details.map((d: any) => `${d.field}: ${d.message}`).join("\n"));
      } else {
        showToast(err.message || "Erro desconhecido");
      }
    } finally {
      setSaving(false);
    }
  };

  // Cancelar edição
  const handleCancel = () => {
    setTextUpdate(comment.conteudo);
    setErrorMessage("");
    setIsEditing(false);
  };

  // Deletar comentário
  const handleDelete = async () => {
    Alert.alert(
      "Confirmação",
      "Deseja realmente deletar este comentário?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await onDelete(comment.idcomment);
            } catch (err: any) {
              if (err.details?.length > 0) {
                showToast(err.details.map((d: any) => `${d.field}: ${d.message}`).join("\n"));
              } else {
                showToast(err.message || "Erro desconhecido");
              }
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.author}>
          {comment.autor || "Anônimo"} - {formattedDate}
        </Text>
        <View style={styles.actions}>
          {isEditing ? (
            <>
              <TouchableOpacity onPress={handleSave} style={styles.iconButton} disabled={saving}>
                {saving ? <ActivityIndicator size="small" /> : <Ionicons name="checkmark-outline" size={20} color="#28a745" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.iconButton} disabled={saving}>
                <Ionicons name="close-outline" size={20} color="#ff4d4d" />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconButton}>
                <Ionicons name="create-outline" size={20} color="#007bff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.iconButton} disabled={deleting}>
                {deleting ? <ActivityIndicator size="small" /> : <Ionicons name="trash-outline" size={20} color="#ff4d4d" />}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={textUpdate}
            onChangeText={(text) => {
              setTextUpdate(text);
              if (errorMessage) setErrorMessage("");
            }}
            multiline
            editable={!saving}
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        </>
      ) : (
        <Text style={styles.text}>{comment.conteudo}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
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
  input: {
    fontSize: 14,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 6,
    backgroundColor: "#fff",
    color: "#333",
  },
  error: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },
});
