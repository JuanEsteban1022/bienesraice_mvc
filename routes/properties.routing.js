import express from "express";
import { body } from 'express-validator';
import { admin, crear, guardar } from "../controllers/properties.controller.js";

const router = express.Router();

router.get('/my-properties', admin);
router.get('/properties/create', crear);
router.post('/properties/create',
    body('title').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    guardar
);

export default router;