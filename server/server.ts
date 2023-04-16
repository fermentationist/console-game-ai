import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import apiRouter from "./api/router.js";

const API_SERVER_PORT = process.env.API_SERVER_PORT || 8000;

const STATIC_FOLDER = "../../game_dist/";
const filename = fileURLToPath(import.meta.url);
const dirName = dirname(filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const staticPath = path.join(dirName, STATIC_FOLDER);
app.use(express.static(staticPath));

app.use("/api", apiRouter);

app.use("/*", (req, res) => {
  res.sendFile(path.join(dirName, "../../index.html"));
});

app.listen(API_SERVER_PORT, () => {
  console.log(`Express app listening on port ${API_SERVER_PORT}`);
});


export default app;
