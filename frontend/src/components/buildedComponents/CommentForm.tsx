/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../../pages/Schema"; // ajuste o caminho se necessário
import AppInput from "../../components/buildedComponents/AppInput";
import { Button } from "../../components/baseComponents/button";
import { useToast } from "../../context/ToastProvider";

interface CommentFormProps {
  onAddComment: (conteudo: string, autor: string) => Promise<void>;
}

// Tipagem forte para o form
interface CommentFormData {
  autor: string;
  conteudo: string;
}

export default function CommentForm({ onAddComment }: CommentFormProps) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<CommentFormData>({
    defaultValues: { autor: "", conteudo: "" },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: CommentFormData) => {
    setSubmitting(true);
    try {
      await onAddComment(data.conteudo, data.autor);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        if (errors.autor) showToast(errors.autor.message!);
        if (errors.conteudo) showToast(errors.conteudo.message!);
      })}
      className="mt-4 flex flex-col gap-3"
    >
      <AppInput control={control} name="autor" placeholder="Seu nome" />
      <AppInput control={control} name="conteudo" placeholder="Digite seu comentário..." />
      <Button type="submit" disabled={submitting} size="lg">
        {submitting ? "Publicando..." : "Publicar"}
      </Button>
    </form>
  );
}