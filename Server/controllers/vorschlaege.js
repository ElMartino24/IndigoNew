import Vorschlaege from "../models/vorschlaege.js";
import UserModel from "../models/userModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createEntryPost = async (req, res, next) => {
  const { text } = req.body;

  try {
    const user = await UserModel.findById(req.user);
    if (!user) {
      return res.status(404).json({
        message: "Benutzer nicht gefunden",
        content: null,
        isSuccess: false,
      });
    }

    const newEntry = new Vorschlaege({
      text,
      userId: req.user,
      userName: user.username,
      date: new Date(),
    });

    if (req.file) {
      newEntry.image = req.file.filename;
    }

    const entry = await newEntry.save();
    console.log(entry);
    res.status(201).json({
      message: "Eintrag gesichert",
      content: entry,
      isSuccess: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Eintrag kann nicht gespeichert werden",
      content: null,
      isSuccess: false,
    });
  }
};

export const updateEntry = async (req, res, next) => {
  try {
    const update = req.body;
    const entry = await Vorschlaege.findById(update.id);

    if (!entry) {
      return res.status(404).json({
        message: "Eintrag nicht gefunden",
        content: null,
        isSuccess: false,
      });
    }

    const updatedEntry = await Vorschlaege.findByIdAndUpdate(
      update.id,
      { text: update.text },
      { new: true }
    );

    res.status(200).json({
      message: "Eintrag erfolgreich aktualisiert",
      content: updatedEntry,
      isSuccess: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server-Fehler, bitte erneut versuchen",
      content: null,
      isSuccess: false,
    });
  }
};

export const getEntry = async (req, res, next) => {
  try {
    const entry = await Vorschlaege.find({}).populate("userId", "username");

    res.json({
      message: "Eintrag gespeichert",
      content: entry,
      isSuccess: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error bitte erneut versuchen",
      content: null,
      isSuccess: false,
    });
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    const deletePost = req.body;
    const entry = await Vorschlaege.findById(deletePost.id);

    if (!entry) {
      return res.status(404).json({
        message: "Eintrag nicht gefunden",
        content: null,
        isSuccess: false,
      });
    }

    if (entry.image) {
      const imagePath = path.join(__dirname, "../img", entry.image);
      fs.unlinkSync(imagePath);
    }

    await Vorschlaege.findByIdAndDelete(deletePost.id);

    res.status(200).json({
      message: "Eintrag erfolgreich gelöscht",
      content: entry,
      isSuccess: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server-Fehler, bitte erneut versuchen",
      content: null,
      isSuccess: false,
    });
  }
};
