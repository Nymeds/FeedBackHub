import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppStack";
import { getFeedbackById, deleteFeedback, type Feedback } from "../../api/feedbacks";
import { useComments } from "../../hooks/useComments";
import AppHeader from "../../components/AppHeader";
import CommentCard from "../../components/CommentCard";
import AppInput from "../../components/AppInput";
import { useToast } from "../../context/ToastProvider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "./Schema";
import { styles } from "./Styles";

type FormData = {
  autor: string;
  conteudo: string;
};

export default function FeedbackDetail() {
  const route = useRoute<RouteProp<RootStackParamList, "FeedbackDetail">>();
  const navigation = useNavigation<any>();
  const { idfeedback } = route.params;
  const { showToast } = useToast();

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { comments, addComment, editComment, removeComment, fetchComments } = useComments(idfeedback);

  const { control, handleSubmit, reset, formState: { errors }, setError } = useForm<FormData>({
    defaultValues: { autor: "", conteudo: "" },
    resolver: yupResolver(schema),
  });

  const onError = (formErrors: any) => {
    Object.values(formErrors).forEach((err: any) => {
      if (err?.message) showToast(err.message);
    });
  };

  // 🔹 Carrega feedback
  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const fb = await getFeedbackById(idfeedback); // já retorna fb.data do API
        setFeedback(fb);
      } catch (err: any) {
        console.error("Erro ao carregar feedback:", err);
        showToast("Feedback não encontrado");
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [idfeedback]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;
  if (!feedback) return <Text style={styles.message}>Feedback não encontrado.</Text>;

  // 🔹 Datas formatadas
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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {/* Header customizado */}
      <AppHeader
        title={feedback.titulo}
        onBack={() => navigation.goBack()}
        onEdit={() => navigation.navigate("FeedbackForm", { idfeedback })}
        onDelete={async () => {
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
                    await deleteFeedback(idfeedback);
                    showToast("Feedback deletado!");
                    navigation.goBack();
                  } catch (err: any) {
                    showToast(err?.message || "Erro ao deletar feedback");
                  }
                },
              },
            ]
          );
        }}
      />

      <View style={{ flex: 1 }}>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.idcomment}
          renderItem={({ item }) => (
            <CommentCard
              comment={item}
              idfeedback={idfeedback}
              onEdit={editComment}
              onDelete={removeComment}
            />
          )}
          ListHeaderComponent={
            <View>
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
            </View>
          }
          contentContainerStyle={{ paddingBottom: 150 }}
          keyboardShouldPersistTaps="handled"
        />

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
