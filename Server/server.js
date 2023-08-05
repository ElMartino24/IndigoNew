import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import userRoutes from "./Routes/userRoutes.js";
import austauschRoutes from "./Routes/austauschRoutes.js";
import fanartsRotes from "./Routes/fanarts.js";
import fanfictRoutes from "./Routes/fanfics.js";
import fragenRoutes from "./Routes/fragen.js";
import neuigkeitenRoutes from "./Routes/neuigkeiten.js";
import vorschlaege from "./Routes/vorschlaege.js";

const PORT = process.env.PORT || 80;
const server = express();
const CONECTION = process.env.MONGOCONECT;
const JWT_SECRET = process.env.JWT_SECRET;

server.use(
  cors({
    origin: "https://indigodev.de",
    credentials: true,
  })
);

server.use(express.json());
server.use(cookieParser());

server.use("/api/checkAuth/", (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json(false);
    }

    const verified = jwt.verify(token, JWT_SECRET);

    if (verified) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (err) {
    console.log(err);
    return res.json(false);
  }
});
server.use(express.static("img"));
server.use("/api/user/", userRoutes);
server.use("/api/austausch/", austauschRoutes);
server.use("/api/fanarts/", fanartsRotes);
server.use("/api/fanfict/", fanfictRoutes);
server.use("/api/fragen/", fragenRoutes);
server.use("/api/neuigkeiten/", neuigkeitenRoutes);
server.use("/api/vorschlaege/", vorschlaege);

server.use("/img", express.static(path.join(__dirname, "img")));

server.get("/api/image/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const imagePath = path.join(__dirname, "img", filename);
    const imageData = fs.readFileSync(imagePath).toString("base64");
    res.json({ imageData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Fehler beim Laden des Bildes." });
  }
});

mongoose
  .connect(CONECTION, { useNewUrlParser: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server Listen Port: ${PORT}`);
    });
  })
  .catch((err) => {
    throw new Error(err);
  });
