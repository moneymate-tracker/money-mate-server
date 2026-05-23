import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";
import { seedSystemCategories } from "./utils/seed-categories.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
  .then(async () => {
    await seedSystemCategories();
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error", err);
    process.exit(1);
  });
