// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();

// const app = express();
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// app.get("/public", (_, res) => {
//   res.json({ message: "This is public data" });
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*", 
    credentials: true,
  })
);

app.get("/public", (_: Request, res: Response) => {
  res.json({ message: "This is public data" });
});


export default app;
