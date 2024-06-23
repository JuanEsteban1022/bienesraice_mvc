import express from "express";
import { buscador, categoria, inicio, notFound } from "../controllers/app.controller.js";

const router = express.Router();

// Página de inicio
router.get('/', inicio);

// Categorias
router.get('/categorias/:id', categoria);

// Buscador
router.post('/buscador', buscador);
router.get('/buscador', buscador);

// Página 404
router.get('/404', notFound);

export default router;