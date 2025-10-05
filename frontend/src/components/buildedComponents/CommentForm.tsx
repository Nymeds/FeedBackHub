/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../pages/Schema";
import AppInput from "../../components/buildedComponents/AppInput";
import { Button } from "../../components/baseComponents/button";
import { useToast } from "../../context/ToastProvider";

interface CommentFormProps {
  onAddComment: (conteudo: string, autor: string) => Promise<void>;
}

interface CommentFormData {
  autor: string;
  conteudo: string;
}

export default function CommentForm({ onAddComment }: CommentFormProps) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
    defaultValues: { autor: "", conteudo: "" },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: CommentFormData) => {
    // Trim nos valores antes de enviar
    const trimmedData = {
      autor: data.autor.trim(),
      conteudo: data.conteudo.trim(),
    };

    setSubmitting(true);
    try {
      await onAddComment(trimmedData.conteudo, trimmedData.autor);
      reset();
      showToast("Comentário publicado com sucesso!", 2000);
    } catch (err: any) {
      if (err?.details) {
        err.details.forEach((d: any) => showToast(d.message));
      } else {
        showToast("Ocorreu um erro ao publicar o comentário");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (formErrors: any) => {
    // Mostra erros de validação
    if (formErrors.autor) showToast(formErrors.autor.message);
    if (formErrors.conteudo) showToast(formErrors.conteudo.message);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="mt-4 flex flex-col gap-3"
    >
      <AppInput 
        control={control} 
        name="autor" 
        placeholder="Seu nome"
        error={errors.autor?.message}
      />
      <AppInput 
        control={control} 
        name="conteudo" 
        placeholder="Digite seu comentário..."
        error={errors.conteudo?.message}
      />
      <Button type="submit" disabled={submitting} size="lg">
        {submitting ? "Publicando..." : "Publicar"}
      </Button>
    </form>
  );
}