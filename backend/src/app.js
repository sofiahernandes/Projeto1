import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    //"http:localhost:3000"
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/health", (_, res) => {
  res.json({ ok: true, server: "up" });
});

app.use("/api", routes);

export default app;
