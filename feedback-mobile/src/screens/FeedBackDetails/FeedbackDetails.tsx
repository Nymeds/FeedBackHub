import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppStack";
import { getFeedbackById, type Feedback } from "../../api/feedbacks";
import { useComments } from "../../hooks/useComments";
import AppHeader from "../../components/AppHeader";
import CommentCard from "../../components/CommentCard";
import AppInput from "../../components/AppInput";
import { useToast } from "../../context/ToastProvider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./Schema";

type FormData = { autor: string; conteudo: string };

export default function FeedbackDetail() {
  const route = useRoute<RouteProp<RootStackParamList, "FeedbackDetail">>();
  const navigation = useNavigation<any>();
  const { idfeedback } = route.params;
  const { showToast } = useToast();

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { comments, addComment, editComment, removeComment, fetchComments } = useComments(idfeedback);

  const { control, handleSubmit, reset, setError } = useForm<FormData>({
    defaultValues: { autor: "", conteudo: "" },
    resolver: yupResolver(schema),
  });

  const onError = (formErrors: any) => {
    Object.values(formErrors).forEach((err: any) => {
      if (err?.message) showToast(err.message);
    });
  };

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const feedbackData = await getFeedbackById(idfeedback);
        setFeedback(feedbackData);
      } catch (err: any) {
        console.error("Erro ao carregar feedback:", err);
        showToast("Feedback não encontrado");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, [idfeedback]);

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!feedback)
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Feedback não encontrado.</Text>
      </View>
    );

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
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await addComment(data.conteudo, data.autor);
      reset();
      fetchComments();
    } catch (err: any) {
      if (err?.details) {
        err.details.forEach((d: any) => {
          showToast(`${d.field}: ${d.message}`);
          setError(d.field as "autor" | "conteudo", {
            type: "manual",
            message: d.message,
          });
        });
      } else if (err?.message) {
        showToast(err.message);
      } else {
        showToast("Erro ao publicar comentário");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <AppHeader
        title={feedback.titulo || "Detalhes do Feedback"}
        onBack={() => navigation.goBack()}
        onEdit={() => feedback && navigation.navigate("FeedbackForm", { idfeedback })}
      />

      <View style={styles.contentWrapper}>
        {/* Conteúdo rolável */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
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

          <View style={styles.descriptionCard}>
            <Text style={styles.descLabel}>Descrição</Text>
            <Text style={styles.descText}>{feedback.descricao}</Text>
            <View style={styles.descFooter}>
              <Text style={styles.footerText}>Criado em: {createdAt}</Text>
              <View style={styles.dot} />
              <Text style={styles.footerText}>Atualizado em: {updatedAt}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Comentários ({comments.length})</Text>

          {comments.map((comment) => (
            <CommentCard
              key={comment.idcomment}
              comment={comment}
              idfeedback={idfeedback}
              onEdit={editComment}
              onDelete={removeComment}
            />
          ))}
        </ScrollView>

        {/* Footer fixo */}
        <View style={styles.commentFooter}>
          <AppInput control={control} name="autor" placeholder="Autor" style={styles.input} />
          <AppInput
            control={control}
            name="conteudo"
            placeholder="Digite seu comentário..."
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            style={[styles.publishButton, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit, onError)}
            disabled={submitting}
          >
            <Text style={styles.publishText}>{submitting ? "Publicando..." : "Publicar"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { flex: 1 },
  scrollContent: { padding: 12, paddingBottom: 150 }, // garante espaço para o footer
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { fontSize: 16, color: "#333" },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  infoCard: { padding: 8, backgroundColor: "#fff", borderRadius: 6, flex: 1, marginHorizontal: 4 },
  infoLabel: { fontSize: 12, color: "#666" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#222" },
  descriptionCard: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginVertical: 8 },
  descLabel: { fontSize: 12, color: "#666", marginBottom: 4 },
  descText: { fontSize: 14, color: "#222" },
  descFooter: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  footerText: { fontSize: 12, color: "#888" },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#888", marginHorizontal: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  commentFooter: {
    padding: 8,
    backgroundColor: "#f6f7fb",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: { marginVertical: 4 },
  publishButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 6, alignItems: "center", marginTop: 8 },
  publishText: { color: "#fff", fontWeight: "600" },
});
