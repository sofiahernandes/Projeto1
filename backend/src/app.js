import express from "express";
import "dotenv/config";
import routes from './routes.js';

const app = express();
app.use(express.json()); // Middleware
app.use(express.urlencoded({ extended: true }));

// Check server health
app.get("/health", (_, res) => {
  res.json({ ok: true, server: "up" });
});

app.use("/api", routes);

export default app;
