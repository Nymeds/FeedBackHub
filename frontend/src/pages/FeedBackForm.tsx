/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AppHeader from "../components/buildedComponents/Header";
import AppInput from "../components/buildedComponents/AppInput";
import { Button } from "../components/baseComponents/button";
import { useToast } from "../context/ToastProvider";
import { getFeedbackById, createFeedback, updateFeedback, deleteFeedback } from "../api/feedback";
import { CATEGORIAS, STATUS } from "../utils/enums";

const feedbackSchema = yup.object({
  titulo: yup
    .string()
    .trim()
    .required("Título obrigatório")
    .test("", (val) => !!val?.trim())
    .min(3, "Mínimo 3 caracteres")
    .max(100, "Máximo 100 caracteres"),
  descricao: yup
    .string()
    .trim()
    .required("Descrição obrigatória")
    .test("", (val) => !!val?.trim())
    .min(10, "Mínimo 10 caracteres")
    .max(1000, "Máximo 1000 caracteres"),
  categoria: yup
    .string()
    .oneOf(CATEGORIAS, "Categoria inválida")
    .required("Categoria obrigatória"),
  status: yup
    .string()
    .oneOf(STATUS, "Status inválido")
    .required("Status obrigatório"),
});

type FeedbackFormData = {
  titulo: string;
  descricao: string;
  categoria: string;
  status: string;
};

export default function FeedbackFormPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { idfeedback } = useParams<{ idfeedback: string }>();
  const isEdit = !!idfeedback;
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FeedbackFormData>({
    //@ts-ignore
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria: "UI",
      status: "suggestion",
    },
  });

  // Carrega feedback para edição
  useEffect(() => {
    if (isEdit) {
      getFeedbackById(idfeedback!)
        .then(res => reset(res))
        .catch(() => showToast("Não foi possível carregar o feedback"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [idfeedback, isEdit, reset, showToast]);
  useEffect(() => {
  const firstError = Object.values(errors)[0];
  if (firstError?.message) {
    showToast(firstError.message);
  }
}, [errors, showToast]);

  const onSubmit = async (data: FeedbackFormData) => {
    // Trim nos valores antes de enviar
    const trimmedData = {
      titulo: data.titulo.trim(),
      descricao: data.descricao.trim(),
      categoria: data.categoria,
      status: data.status,
    };

    try {
      if (isEdit) {
        await updateFeedback(idfeedback!, trimmedData);
        showToast("Feedback atualizado com sucesso!");
      } else {
        await createFeedback(trimmedData);
        showToast("Feedback criado com sucesso!");
      }
      navigate("/");
    } catch (err: any) {
      showToast(err?.message || "Erro desconhecido");
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    try {
      await deleteFeedback(idfeedback!);
      showToast("Feedback deletado com sucesso!");
      navigate("/");
    } catch (err: any) {
      showToast(err?.message || "Erro ao deletar feedback");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Carregando...</p>;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppHeader
        title={isEdit ? "Editar Feedback" : "Novo Feedback"}
        onBack={() => navigate(-1)}
        onDelete={isEdit ? handleDelete : undefined}
      />

      <div className="flex-1 p-6 max-w-3xl w-full mx-auto bg-white rounded-xl shadow flex flex-col gap-4">
        {/* Inputs controlados */}
        <AppInput
          control={control}
          name="titulo"
          placeholder="Título"
          error={errors.titulo?.message}
          maxLength={100}
          autoFocus
        />
        <AppInput
          control={control}
          name="descricao"
          placeholder="Descrição"
          error={errors.descricao?.message}
          maxLength={1000}
        />

        {/* Categoria e Status usando Controller */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Controller
            control={control}
            name="categoria"
            render={({ field }) => (
              <div className="flex-1 flex flex-col">
                <label className="text-gray-600 mb-1">Categoria</label>
                <select {...field} className="border rounded p-2">
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.categoria && <span className="text-red-600 text-sm">{errors.categoria.message}</span>}
              </div>
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <div className="flex-1 flex flex-col">
                <label className="text-gray-600 mb-1">Status</label>
                <select {...field} className="border rounded p-2">
                  {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.status && <span className="text-red-600 text-sm">{errors.status.message}</span>}
              </div>
            )}
          />
        </div>

        {/* Botão de submit */}
        <Button
          size="lg"
          //@ts-ignore
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isEdit ? "Atualizar Feedback" : "Criar Feedback"}
        </Button>

      </div>
    </div>
  );
}