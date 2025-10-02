/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AppHeader from "../components/buildedComponents/Header";
import AppInput from "../components/buildedComponents/Appinput";
import { Button } from "../components/baseComponents/button";
import { useToast } from "../context/ToastProvider";
import { getFeedbackById, createFeedback, deleteFeedback } from "../api/feedback";

const CATEGORIAS = ["UI", "UX", "Bug", "Funcionalidade"];
const STATUS = ["suggestion", "planned", "in-progress", "live"];

const feedbackSchema = yup.object({
  titulo: yup.string().min(3, "Mínimo 3 caracteres").required("Título obrigatório"),
  descricao: yup.string().min(10, "Mínimo 10 caracteres").required("Descrição obrigatória"),
  categoria: yup.string().oneOf(CATEGORIAS, "Categoria inválida").required(),
  status: yup.string().oneOf(STATUS, "Status inválido").required(),
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
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria: "UI",
      status: "suggestion",
    },
  });

  // Carregar feedback se estiver em edição
  useEffect(() => {
    if (isEdit) {
      getFeedbackById(idfeedback!)
        .then(res => reset(res.data))
        .catch(() => showToast("Não foi possível carregar o feedback"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [idfeedback, isEdit, reset, showToast]);

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      if (isEdit) {
        showToast("Feedback atualizado com sucesso!");
        navigate("/");
      } else {
        await createFeedback(data);
        showToast("Feedback criado com sucesso!");
      navigate("/");

      }

    } catch (err: any) {
      showToast(err?.message || "Erro desconhecido");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Carregando...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AppHeader
        title={isEdit ? "Editar Feedback" : "Novo Feedback"}
        onBack={() => navigate(-1)}
        onDelete={isEdit ? async () => {
          try {
            await deleteFeedback(idfeedback!);
            showToast("Feedback deletado com sucesso!");
            navigate("/");
          } catch (err: any) {
            showToast(err?.message || "Erro ao deletar feedback");
          }
        } : undefined}
        
      />

      <div className="flex-1 p-6 max-w-3xl mx-auto bg-white rounded-xl shadow flex flex-col gap-4">
        <AppInput
          control={control}
          name="titulo"
          placeholder="Título"
          error={errors.titulo?.message}
        />
        <AppInput
          control={control}
          name="descricao"
          placeholder="Descrição"
          error={errors.descricao?.message}
        />

        {/* Categoria e Status */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            <label className="text-gray-600 mb-1">Categoria</label>
            <select
              {...control.register("categoria")}
              className="border rounded p-2"
            >
              {CATEGORIAS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.categoria && <span className="text-red-600 text-sm">{errors.categoria.message}</span>}
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-gray-600 mb-1">Status</label>
            <select
              {...control.register("status")}
              className="border rounded p-2"
            >
              {STATUS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.status && <span className="text-red-600 text-sm">{errors.status.message}</span>}
          </div>
        </div>

        {/* Botão submit */}
        <Button
          size="lg"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          
        >
          {isEdit ? "Atualizar Feedback" : "Criar Feedback"}
        </Button>
      </div>
    </div>
  );
}
