import type { FastifyInstance } from "fastify";
import { createFeedbackController } from "../controllers/feedback/create";
import { listFeedbacksController } from "../controllers/feedback/list";
import { getFeedbackController } from "../controllers/feedback/getFeedback";
import { updateFeedbackController } from "../controllers/feedback/update";
import { deleteFeedbackController } from "../controllers/feedback/delete";
import { createCommentController } from "../controllers/comment/create";
import { listCommentController } from "../controllers/comment/lits";
import { updateCommentController } from "../controllers/comment/update";
import { deleteCommentController } from "../controllers/comment/delete";



export async function appRoutes(app: FastifyInstance) {
  // -------------------------
  // Feedbacks
  // -------------------------
  app.get("/feedbacks", listFeedbacksController); // lista com paginação e busca
  app.get("/feedbacks/:idfeedback", getFeedbackController); // detalhe de um feedback
  app.post("/feedbacks", createFeedbackController); // criar
  app.put("/feedbacks/:idfeedback", updateFeedbackController); // atualizar
  app.delete("/feedbacks/:idfeedback", deleteFeedbackController); // deletar

  // -------------------------
  // Comments
  // -------------------------
  app.get("/feedbacks/:idfeedback/comments", listCommentController); // lista comentários de um feedback
  app.post("/feedbacks/:idfeedback/comments", createCommentController); // criar comentário
  app.put("/comments/:idcomment", updateCommentController); // atualizar comentário
  app.delete("/comments/:idcomment", deleteCommentController); // deletar comentário
}
