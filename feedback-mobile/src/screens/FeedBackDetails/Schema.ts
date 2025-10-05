import * as yup from "yup";

export const schema = yup.object({
  autor: yup
    .string()
    .trim()
    .required("O autor é obrigatório"),
  conteudo: yup
    .string()
    .trim()
    .required("O comentário é obrigatório"),
});
