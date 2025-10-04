import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () =>{
  console.log(`Server sunning on port http://localhost:${PORT}`);
});
