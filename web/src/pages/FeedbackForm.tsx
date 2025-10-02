/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from "../api/feedbacks";
import { CATEGORIAS, STATUS,type Categoria,type Status } from "../utils/enums";
import { useToast } from "../context/ToastContext";

const feedbackSchema = yup.object({
  titulo: yup
    .string()
    .min(3, "Mínimo 3 caracteres")
    .required("Título obrigatório"),
  descricao: yup
    .string()
    .min(10, "Mínimo 10 caracteres")
    .required("Descrição obrigatória"),
  categoria: yup
    .string()
    .oneOf(CATEGORIAS as unknown as string[], "Categoria inválida")
    .required(),
  status: yup
    .string()
    .oneOf(STATUS as unknown as string[], "Status inválido")
    .required(),
});

type FeedbackFormData = {
  titulo: string;
  descricao: string;
  categoria: Categoria;
  status: Status;
};

export default function FeedbackForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id !== "new";
  const { showToast } = useToast();
  const [deleting, setDeleting] = useState(false);

  const {
    register,
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

  useEffect(() => {
    if (isEdit) {
      getFeedbackById(id!)
        .then((res) => reset(res.data))
        .catch(() => showToast("Não foi possível carregar o feedback."));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      if (isEdit) {
        await updateFeedback(id!, data);
        showToast("Feedback atualizado!", "success");
      } else {
        await createFeedback(data);
        showToast("Feedback criado!", "success");
      }
      navigate("/");
    } catch (err: any) {
      if (err.details?.length > 0) {
        showToast(err.details.map((d: any) => `${d.field}: ${d.message}`).join("\n"));
      } else {
        showToast(err.message || "Erro desconhecido");
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Deseja realmente deletar este feedback?")) return;

    setDeleting(true);
    try {
      await deleteFeedback(id!);
      showToast("Feedback deletado!", "success");
      navigate("/");
    } catch (err: any) {
      showToast(err?.message || "Erro ao deletar feedback");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEdit ? "Editar Feedback" : "Criar Feedback"}
          </h1>
          {isEdit && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deletando..." : "Deletar"}
            </button>
          )}
        </div>

        {/* Form */}
      
        <form onSubmit={
              //@ts-expect-error
            handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
          {/* Título */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              {...register("titulo")}
              type="text"
              placeholder="Digite o título"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.titulo && (
              <p className="text-red-600 text-sm mt-1">{errors.titulo.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              {...register("descricao")}
              placeholder="Digite a descrição"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.descricao && (
              <p className="text-red-600 text-sm mt-1">{errors.descricao.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              {...register("categoria")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.categoria && (
              <p className="text-red-600 text-sm mt-1">{errors.categoria.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STATUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Salvando..."
                : isEdit
                ? "Atualizar Feedback"
                : "Criar Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}