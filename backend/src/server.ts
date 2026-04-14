import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // FORCE PATH

console.log("Loaded key:", process.env.GROQ_API_KEY); // debug

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});