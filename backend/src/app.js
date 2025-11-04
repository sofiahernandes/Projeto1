import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import routes from "./routes.js";



const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true, // em dev, pode deixar true
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Servir /uploads (arquivos salvos pelo Multer)
app.use("/uploads", express.static(path.resolve("src", "uploads")));

// Health simples do app
app.get("/health", (_, res) => {
  res.json({ ok: true, server: "up" });
});


app.use("/api", routes);
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "Arquivo muito grande. Limite 5MB." });
    }
    return res.status(400).json({ error: `Erro no upload: ${err.code}` });
  }
  if (err && err.message === "Arquivo Inválido") {
    return res.status(415).json({ error: "Tipo de arquivo não suportado. Envie PNG/JPG." });
  }
  next(err);
});

// 404 handler (depois das rotas)
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});


// app.use('/api', routes)
export default app;
