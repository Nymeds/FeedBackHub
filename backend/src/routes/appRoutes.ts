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
 
  app.get("/feedbacks", listFeedbacksController); 
  app.get("/feedbacks/:idfeedback", getFeedbackController); 
  app.post("/feedbacks", createFeedbackController); 
  app.put("/feedbacks/:idfeedback", updateFeedbackController); 
  app.delete("/feedbacks/:idfeedback", deleteFeedbackController); 


  app.get("/feedbacks/:idfeedback/comments", listCommentController); 
  app.post("/feedbacks/:idfeedback/comments", createCommentController); 
  app.put("/comments/:idcomment", updateCommentController); 
  app.delete("/comments/:idcomment", deleteCommentController); 
}
