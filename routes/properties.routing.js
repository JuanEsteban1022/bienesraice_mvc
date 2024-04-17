import express from "express";
import { body } from 'express-validator';
import { admin, crear, guardar, addImage } from "../controllers/properties.controller.js";
import protectRoute from "../middleware/protectedRoutes.middleware.js";

const router = express.Router();

router.get('/my-properties', protectRoute, admin);
router.get('/properties/create', protectRoute, crear);
router.post('/properties/create', protectRoute,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('la descripcion no puede ir vacia')
        .isLength({ max: 200 }).withMessage('La descripción es demasiado extensa'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona el número de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona el número de estacionamientos'),
    body('banos').isNumeric().withMessage('Selecciona el número de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardar
);
router.get('/properties/add-image/:id', protectRoute, addImage);

export default router;