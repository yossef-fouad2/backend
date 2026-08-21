import { logger } from "./lib/logger.js";

process.on("uncaughtException", (err) => {
  logger.fatal(err, "CRITICAL UNCAUGHT ERROR at startup");
  process.exit(1);
});

import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Welcome to protopharma system!");
});

// Error handler must be defined last
app.use(errorHandler);

app.listen(8000, () => {
    console.log('server is running on port 8000');
});
