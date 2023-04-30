import "dotenv/config";
import express from "express";
import wakeDyno from "woke-dyno";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import apiRouter from "./api/routes/index.js";
import rateLimiter from "./rateLimiter.js";

const API_SERVER_PORT = process.env.API_SERVER_PORT || 8080;
const WAKE_SERVER_URL = process.env.WAKE_SERVER_URL || `http://localhost:${API_SERVER_PORT}`;
const WAKE_SERVER_INTERVAL = process.env.WAKE_SERVER_INTERVAL || 14 * 60 * 1000; // 14 minutes
const STATIC_FOLDER = "../game/";
const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const staticPath = path.join(dirName, STATIC_FOLDER);
app.use(express.static(staticPath));

app.use("/api", rateLimiter, apiRouter);

app.use("/*", (req, res) => {
  res.sendFile(path.join(dirName, "../../index.html"));
});

app.listen(API_SERVER_PORT, () => {
  console.log(`Express app listening on port ${API_SERVER_PORT}`);
  const offset = 4; // NY
  const getOffsetHours = (hours: number) => (hours + offset) > 24 ? 24 - (hours + offset) : hours + offset;
  const napStartHour = getOffsetHours(22);
  const napEndHour = getOffsetHours(7)
  wakeDyno({
    url: WAKE_SERVER_URL,
    interval: WAKE_SERVER_INTERVAL, 
    startNap: [napStartHour, 0, 0, 0],
    endNap: [napEndHour, 0, 0, 0]
  }).start();
});

export default app;
