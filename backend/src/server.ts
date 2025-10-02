import { app } from "./app.js";
import { env } from "./env/index.js";

app.listen({
  host: "0.0.0.0",
  port: env.PORT,
})
.then(() => {
  console.log(`Servidor rodando na porta ${env.PORT}`);
})
.catch((err: any) => {
  console.error(err);
  process.exit(1);
});
