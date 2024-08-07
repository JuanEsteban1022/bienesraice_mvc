import express from "express";
import { body } from 'express-validator';
import {
    addImage, cambiarEstado, crear, deletePropertie, editar, enviarMensaje, guardar, guardarCambios, storeImage, verMensajes, viewPropertie, admin,
} from "../controllers/properties.controller.js";
import protectRoute from "../middleware/protectedRoutes.middleware.js";
import upload from "../middleware/uploadFile.js";
import identificarUsuario from '../middleware/identificar_usuario.middleware.js'

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
router.post('/properties/add-image/:id', protectRoute, upload.single('imagen'), storeImage);

router.get('/properties/edit/:id', protectRoute, editar)
router.post('/properties/edit/:id', protectRoute,
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('la descripcion no puede ir vacia')
        .isLength({ max: 200 }).withMessage('La descripción es demasiado extensa'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona el número de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona el número de estacionamientos'),
    body('banos').isNumeric().withMessage('Selecciona el número de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    guardarCambios
);

/** Eliminación de propiedades */
router.post('/properties/delete/:id', protectRoute, deletePropertie);

/** Cambio de estado de la propiedad */
router.put('/properties/:id', protectRoute, cambiarEstado);

/** Area publica, no requiere cuenta */
router.get('/properties/:id',
    identificarUsuario,
    viewPropertie
);

/** Almacenar los mensajes */
router.post('/properties/:id',
    identificarUsuario,
    body('message').isLength({ min: 10 }).withMessage('El mensaje no puede ir vacío o es muy corto'),
    enviarMensaje
);

/** Visualización de mensajes */
router.get('/mensajes/:id',
    protectRoute,
    verMensajes
);


export default router;