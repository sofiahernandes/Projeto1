import express from "express";
import cors from "cors";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/public", (req, res) => {
  res.json({ message: "This is public data" });
});

// Protected route
app.get("/protected", ClerkExpressRequireAuth(), (req, res) => {
  // req.auth contains the Clerk session info
  res.json({ message: "This is protected data", userId: req.auth.userId });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
