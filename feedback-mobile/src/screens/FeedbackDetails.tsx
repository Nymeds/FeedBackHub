import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppStack";
import { getFeedbackById } from "../api/feedbacks";
import { useComments } from "../hooks/useComments";
import AppHeader from "../components/AppHeader";
import CommentCard from "../components/CommentCard";

export default function FeedbackDetail() {
  const route = useRoute<RouteProp<RootStackParamList, "FeedbackDetail">>();
  const navigation = useNavigation<any>();
  const { idfeedback } = route.params;

  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { comments, loading: loadingComments, addComment } = useComments(idfeedback);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Atualiza o header com título provisório
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <AppHeader
          title="Carregando..."
          onBack={() => navigation.goBack()}
          onEdit={() =>
            navigation.navigate("FeedbackForm", { idfeedback })
          }
        />
      ),
    });
  }, []);

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const res = await getFeedbackById(idfeedback);
        setFeedback(res.data);

        // Atualiza o header com o título real do feedback
        navigation.setOptions({
          header: () => (
            <AppHeader
              title={res.data.titulo}
              onBack={() => navigation.goBack()}
              onEdit={() =>
                navigation.navigate("FeedbackForm", { idfeedback })
              }
            />
          ),
        });
      } catch {
        Alert.alert("Erro", "Não foi possível carregar o feedback.");
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [idfeedback]);

  const handlePublishComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await addComment(commentText, "Usuário");
      setCommentText("");
    } catch {
      Alert.alert("Erro", "Não foi possível publicar o comentário.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;
  if (!feedback) return <Text style={styles.message}>Feedback não encontrado.</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Info do feedback */}
        <View style={styles.card}>
          <Text style={styles.label}>
            Categoria: <Text style={styles.value}>{feedback.categoria}</Text>
          </Text>
          <Text style={styles.label}>
            Status: <Text style={styles.value}>{feedback.status}</Text>
          </Text>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{feedback.descricao}</Text>
          <Text style={styles.dates}>
            Criado em: {new Date(feedback.createdAt).toLocaleDateString()} | Atualizado em:{" "}
            {new Date(feedback.updatedAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Comentários */}
        <Text style={styles.sectionTitle}>Comentários ({comments.length})</Text>

        {loadingComments ? (
          <ActivityIndicator style={{ marginTop: 10 }} size="small" />
        ) : (
            <FlatList
            data={comments}
            keyExtractor={(item) => item.idcomment}
            renderItem={({ item }) => (
                <CommentCard
                comment={item}
                onEdit={(c) => console.log("Editar", c)}
                onDelete={(c) => console.log("Apagar", c)}
                />
            )}
            />
        )}

        {/* Adicionar comentário */}
        <View style={styles.commentBox}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu comentário..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[styles.publishButton, submitting && { opacity: 0.6 }]}
            onPress={handlePublishComment}
            disabled={submitting}
          >
            <Text style={styles.publishText}>
              {submitting ? "Publicando..." : "Publicar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  message: { textAlign: "center", marginTop: 20, fontSize: 16 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  label: { fontWeight: "bold", marginBottom: 4 },
  value: { fontWeight: "normal", color: "#333" },
  dates: { marginTop: 8, fontSize: 12, color: "#666" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  commentCard: {
    backgroundColor: "#f1f1f1",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  commentAuthor: { fontWeight: "bold", marginBottom: 4 },
  commentText: { fontSize: 14, marginBottom: 4 },
  commentDate: { fontSize: 12, color: "#666" },
  commentBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    padding: 8,
  },
  input: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  publishButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  publishText: { color: "#fff", fontWeight: "bold" },
});
