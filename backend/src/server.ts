import dotenv from "dotenv";
import app from "./app";

dotenv.config({ path: "./.env" });

console.log(
  "Loaded key:",
  process.env.GROQ_API_KEY
);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});