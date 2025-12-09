import express from "express";
import { upload, uploadFile, getFiles, removeFile, removeAllFiles ,updateFileController} from "../controllers/uploadController";

const router = express.Router();

router.post("/", upload.single("file"), uploadFile);
router.get("/", getFiles);
// DELETE all files
router.delete("/all", removeAllFiles);
router.delete("/:id", removeFile);
router.put("/:id", upload.single("file"), updateFileController);
export default router;
