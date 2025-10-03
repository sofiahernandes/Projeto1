import express from "express";
import cors from "cors";
import "dotenv/config";
import routes from "./routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://192.168.3.122:3000", "https://arkana-projeto1.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/health", (_, res) => {
  res.json({ ok: true, server: "up" });
});

app.use("/api", routes);

export default app;
