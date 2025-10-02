import Fastify from "fastify";
import { appRoutes } from "./routes/appRoutes.js";
import cors from "@fastify/cors";

export const app = Fastify({ logger: false });

// CORS
app.register(cors, { origin: "*" });

// Rotas
app.register(appRoutes);
