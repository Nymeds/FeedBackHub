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
import { getFeedbackById, createFeedback, updateFeedback, deleteFeedback, type Feedback } from "../api/feedbacks";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { CATEGORIAS, STATUS, Categoria, Status } from "../utils/enums";
import { useToast } from "../context/ToastProvider";
import AppHeader from "../components/AppHeader";

const feedbackSchema = yup.object({
  titulo: yup.string().min(3, "Mínimo 3 caracteres").required("Título obrigatório"),
  descricao: yup.string().min(10, "Mínimo 10 caracteres").required("Descrição obrigatória"),
  categoria: yup.string().oneOf(CATEGORIAS as unknown as string[], "Categoria inválida").required(),
  status: yup.string().oneOf(STATUS as unknown as string[], "Status inválido").required(),
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
  const [loading, setLoading] = useState(isEdit);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormData>({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria: "UI",
      status: "suggestion",
    },
  });

  // Carrega feedback existente
  useEffect(() => {
    if (!isEdit) return;

    const loadFeedback = async () => {
      setLoading(true);
      try {
        const fb = await getFeedbackById(idfeedback!);
        setFeedback(fb);
        reset(fb);
      } catch {
        showToast("Não foi possível carregar o feedback.");
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, [idfeedback, isEdit, reset, showToast]);

  const onSubmit: SubmitHandler<FeedbackFormData> = async (data) => {
    try {
      if (isEdit) {
        await updateFeedback(idfeedback!, data);
        showToast("Feedback atualizado!");
      } else {
        await createFeedback(data);
        showToast("Feedback criado!");
      }
      navigation.navigate("FeedbackList");
    } catch (err: any) {
      if (err.details?.length > 0) {
        showToast(err.details.map((d: any) => `${d.field}: ${d.message}`).join("\n"));
      } else {
        showToast(err.message || "Erro desconhecido");
      }
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header customizado */}
      <AppHeader
        title={isEdit ? feedback?.titulo || "Editar Feedback" : "Criar Feedback"}
        onBack={() => navigation.goBack()}
        onDelete={
          isEdit
            ? async () => {
                try {
                  await deleteFeedback(idfeedback!);
                  showToast("Feedback deletado!");
                  navigation.goBack();
                } catch (err: any) {
                  showToast(err?.message || "Erro ao deletar feedback");
                }
              }
            : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AppInput
          label="Título"
          placeholder="Digite o título"
          control={control}
          name="titulo"
          error={errors.titulo?.message}
        />

        <AppInput
          label="Descrição"
          placeholder="Digite a descrição"
          control={control}
          name="descricao"
          multiline
          error={errors.descricao?.message}
          style={{ minHeight: 100, textAlignVertical: "top" }}
        />

        {/* Categoria Picker */}
        <Controller
          control={control}
          name="categoria"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ marginBottom: 4 }}>Categoria</Text>
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

        {/* Status Picker */}
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <View style={{ marginBottom: 16 }}>
              <Text style={{ marginBottom: 4 }}>Status</Text>
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

      {/* Botões fixos na parte inferior */}
      <View style={styles.bottomButtons}>
        <AppButton
          variant="secondary"
          title="Voltar"
          onPress={() => navigation.goBack()}
          style={{ flex: 1, marginRight: 8 }}
        />
        {isSubmitting ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : (
          <AppButton
            variant="primary"
            title={isEdit ? "Atualizar Feedback" : "Criar Feedback"}
            onPress={handleSubmit(onSubmit)}
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
  },
});
