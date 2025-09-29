import Fastify from "fastify";
import { appRoutes } from "./routes/appRoutes.js";
import cors from '@fastify/cors';
import { env } from "./env/index.js";

export const app = Fastify({
   logger: false
});

// CORS
app.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:19006"],
});

// Rotas
app.register(appRoutes);
