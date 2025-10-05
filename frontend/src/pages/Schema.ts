import * as yup from "yup";

export const schema = yup.object({
  autor: yup
    .string()
    .trim()
    .required("O autor é obrigatório")
    .test("not-blank", "O autor não pode estar em branco", (val) => !!val?.trim()),
  conteudo: yup
    .string()
    .trim()
    .required("O comentário é obrigatório")
    .test("not-blank", "O comentário não pode estar em branco", (val) => !!val?.trim()),
});