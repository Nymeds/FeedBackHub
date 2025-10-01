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
  const { comments, loading: loadingComments, addComment, editComment, removeComment } = useComments(idfeedback);
  const [commentText, setCommentText] = useState("");
  const [autor, setAutor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Atualiza header com título provisório
  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <AppHeader
          title="Carregando..."
          onBack={() => navigation.goBack()}
          onEdit={() => navigation.navigate("FeedbackForm", { idfeedback })}
        />
      ),
    });
  }, []);

  // Carrega feedback
  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const res = await getFeedbackById(idfeedback);
        setFeedback(res.data);

        // Atualiza header com título real (no header, não no corpo)
        navigation.setOptions({
          header: () => (
            <AppHeader
              title={res.data.titulo}
              onBack={() => navigation.goBack()}
              onEdit={() => navigation.navigate("FeedbackForm", { idfeedback })}
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
    if (!commentText.trim() || !autor.trim()) return;
    setSubmitting(true);
    try {
      await addComment(commentText, autor);
      setCommentText("");
      setAutor("");
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Erro ao publicar comentário");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;
  if (!feedback) return <Text style={styles.message}>Feedback não encontrado.</Text>;

  const createdAt = new Date(feedback.createdAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const updatedAt = new Date(feedback.updatedAt).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        {/* Grid de info — dois quadradinhos por linha */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Categoria</Text>
            <Text style={styles.infoValue}>{feedback.categoria}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>{feedback.status}</Text>
          </View>
        </View>

        {/* Descrição em card separado com rodapé de datas */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descLabel}>Descrição</Text>
          <Text style={styles.descText}>{feedback.descricao}</Text>

          <View style={styles.descFooter}>
            <Text style={styles.footerText}>Criado em: {createdAt}</Text>
            <View style={styles.dot} />
            <Text style={styles.footerText}>Atualizado em: {updatedAt}</Text>
          </View>
        </View>

        {/* Comentários */}
        <Text style={styles.sectionTitle}>Comentários ({comments.length})</Text>
        {loadingComments ? (
          <ActivityIndicator style={{ marginTop: 10 }} size="small" />
        ) : (
          <FlatList
            data={comments}
            extraData={comments}
            keyExtractor={(item) => item.idcomment}
            renderItem={({ item }) => (
              <CommentCard
                comment={item}
                idfeedback={idfeedback}
                onEdit={editComment}
                onDelete={removeComment}
              />
            )}
            contentContainerStyle={{ paddingBottom: 220 }}
          />
        )}

        {/* Adicionar comentário */}
        <View style={styles.commentBox}>
          <TextInput
            style={styles.input}
            placeholder="Autor"
            value={autor}
            onChangeText={setAutor}
            multiline
          />
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6f7fb",
    paddingBottom: 140,
  },
  message: { textAlign: "center", marginTop: 20, fontSize: 16 },

  /* Grid de cards */
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoCard: {
    width: "48%", // dois cards por linha
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(18,35,58,0.04)",
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    color: "#12233a",
    fontWeight: "700",
  },

  /* Descrição */
  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(18,35,58,0.04)",
  },
  descLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
    fontWeight: "600",
  },
  descText: {
    color: "#333",
    lineHeight: 20,
    marginBottom: 12,
  },
  descFooter: {
  flexDirection: "row",
  flexWrap: "wrap", 
  alignItems: "center",
  borderTopWidth: 1,
  borderTopColor: "#eef2f6",
  paddingTop: 8,
  gap: 8, 
},
footerText: {
  color: "#6b7280",
  fontSize: 12,
},
dot: {
  width: 6,
  height: 6,
  borderRadius: 6,
  backgroundColor: "#e2e8f0",
  marginHorizontal: 4,
},


  sectionTitle: { fontSize: 18, fontWeight: "700", marginVertical: 8, color: "#12233a" },

  commentBox: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    padding: 12,
  },
  input: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#e6e9ef",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },
  publishButton: {
    backgroundColor: "#0b74ff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  publishText: { color: "#fff", fontWeight: "700" },
});
