import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const schema = yup.object({
  autor: yup.string().required("O autor é obrigatório"),
  conteudo: yup.string().required("O comentário é obrigatório"),
});
