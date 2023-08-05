import Router from "express";
import {isAuth} from "../middleware/isAuthMiddleware.js";
import {createEntryPost, updateEntry, getEntry, deleteEntry } from "../controllers/fanarts.js";
import {blogInput} from "../middleware/entryMiddleware.js";
import {updateInput} from "../middleware/entryMiddleware.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./img");
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname;
    const sanitizedFilename = originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + sanitizedFilename);
  },
});

const upload = multer({ storage: storage });

router.post( "/createEntryPost", isAuth, upload.single("image"), blogInput, createEntryPost
);

router.get("", getEntry);

router.patch("/update", updateInput, updateEntry);

router.post("/delete", deleteEntry);

export default router;