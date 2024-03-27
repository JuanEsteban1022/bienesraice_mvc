import express from "express";
import { admin, crear } from "../controllers/properties.controller.js";

const router = express.Router();

router.get('/my-properties', admin);
router.get('/properties/create', crear);

export default router;