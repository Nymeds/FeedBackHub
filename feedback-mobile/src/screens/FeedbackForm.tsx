import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import { RootStackParamList } from "../navigation/AppStack";
import { useFeedbacks } from "../hooks/useFeedbacks";
import { getFeedbackById, type Feedback } from "../api/feedbacks";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import AppHeader from "../components/AppHeader";
import { CATEGORIAS, STATUS, Categoria, Status } from "../utils/enums";
import { useToast } from "../context/ToastProvider";


const feedbackSchema = yup.object({
  titulo: yup
    .string()
    .required("Título obrigatório")
    .trim()
    .test("not-blank", (val) => !!val?.trim())
    .max(100)
    .min(3, "Mínimo 3 caracteres"),
  descricao: yup
    .string()
    .required("Descrição obrigatória")
    .trim()
    .max(1000)
    .test("not-blank", (val) => !!val?.trim())
    .min(10, "Mínimo 10 caracteres"),
  categoria: yup
    .string()
    .required("Categoria obrigatória")
    .oneOf(CATEGORIAS as unknown as string[], "Categoria inválida"),
  status: yup
    .string()
    .required("Status obrigatório")
    .oneOf(STATUS as unknown as string[], "Status inválido"),
});

type FeedbackFormData = {
  titulo: string;
  descricao: string;
  categoria: Categoria;
  status: Status;
};

export default function FeedbackForm() {
  const route = useRoute<RouteProp<RootStackParamList, "FeedbackForm">>();
  const navigation = useNavigation<any>();
  const { idfeedback } = route.params || {};
  const isEdit = !!idfeedback;
  const { showToast } = useToast();

  const { addFeedback, editFeedback, removeFeedback } = useFeedbacks();

  const [loading, setLoading] = useState(isEdit);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    //@ts-ignore
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria: "UI",
      status: "suggestion",
    },
  });

  // Carregar feedback para edição
  useEffect(() => {
    if (!isEdit) return;

    const loadFeedback = async () => {
      setLoading(true);
      try {
        const feedbackData = await getFeedbackById(idfeedback!);
        setFeedback(feedbackData);
        //@ts-ignore
        reset({
          titulo: feedbackData.titulo,
          descricao: feedbackData.descricao,
          categoria: feedbackData.categoria,
          status: feedbackData.status,
        });
      } catch (err) {
        console.error("Erro ao carregar feedback:", err);
        showToast("Não foi possível carregar o feedback.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [idfeedback, isEdit, reset, showToast, navigation]);

  // Submit (criar/editar)
  const onSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    const trimmedData = {
      titulo: data.titulo.trim(),
      descricao: data.descricao.trim(),
      categoria: data.categoria,
      status: data.status,
    };

    try {
      if (isEdit && idfeedback) {
        await editFeedback(idfeedback, trimmedData);
        showToast("Feedback atualizado!", 3000, "success");
      } else {
        await addFeedback(trimmedData);
        showToast("Feedback criado!", 3000, "success");
      }
      navigation.navigate("FeedbackList");
    } catch (err: any) {
      showToast(err?.message || "Erro desconhecido");
    }
  };

  // Deletar feedback
  const handleDelete = async () => {
    if (!idfeedback) return;
    try {
      await removeFeedback(idfeedback);
      showToast("Feedback deletado!", 3000, "success");
      navigation.reset({ index: 0, routes: [{ name: "FeedbackList" }] });
    } catch (err: any) {
      showToast(err?.message || "Erro ao deletar feedback");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 12, color: "#666" }}>Carregando feedback...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <AppHeader
        title={isEdit ? feedback?.titulo || "Editar Feedback" : "Criar Feedback"}
        onBack={() => navigation.goBack()}
        onDelete={isEdit ? handleDelete : undefined}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <AppInput
        label="Título"
        placeholder="Digite o título"
        control={control}
        name="titulo"
        error={errors.titulo?.message}
        maxLength={100} 
      />

      <AppInput
        label="Descrição"
        placeholder="Digite a descrição"
        control={control}
        name="descricao"
        multiline
        numberOfLines={6}
        error={errors.descricao?.message}
        style={{ minHeight: 100, textAlignVertical: "top" }}
        maxLength={1000} 
      />


        <Controller
          control={control}
          name="categoria"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Categoria</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={value} onValueChange={onChange}>
                  {CATEGORIAS.map((c) => (
                    <Picker.Item key={c} label={c} value={c} />
                  ))}
                </Picker>
              </View>
              {errors.categoria && <Text style={styles.errorText}>{errors.categoria.message}</Text>}
            </View>
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={value} onValueChange={onChange}>
                  {STATUS.map((s) => (
                    <Picker.Item key={s} label={s} value={s} />
                  ))}
                </Picker>
              </View>
              {errors.status && <Text style={styles.errorText}>{errors.status.message}</Text>}
            </View>
          )}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomButtons}>
        <AppButton
          variant="secondary"
          title="Cancelar"
          onPress={() => navigation.goBack()}
          style={{ flex: 1, marginRight: 8 }}
        />
        {isSubmitting ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : (
          <AppButton
            variant="primary"
            title={isEdit ? "Atualizar" : "Criar"}
            onPress={
              //@ts-ignore
              handleSubmit(onSubmit)}
            style={{ flex: 1, marginLeft: 8 }}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 0,
    backgroundColor: "#f0f4f8",
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 14,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    backgroundColor: "#ffffff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  errorText: {
    color: "#dc2626",
    marginTop: 6,
    fontSize: 12,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
