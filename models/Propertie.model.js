import { DataTypes } from "sequelize"; 
import db from "../config/db.js"; 

const propertie =  db.define('properties', {
     id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
     },
     title: {
        type: DataTypes.STRING(100),
        allowNull: false
     },
     description: {
        type: DataTypes.TEXT,
        allowNull: false
     },
     habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: false
     },
     estacionamiento: {
        type: DataTypes.INTEGER,
        allowNull: false
     },
     banos: {
        type: DataTypes.INTEGER,
        allowNull: false
     },
     calle: {
        type: DataTypes.STRING(60),
        allowNull: false
     },
     lat: {
        type: DataTypes.STRING,
        allowNull: false
     },
     lng: {
        type: DataTypes.STRING,
        allowNull: false
     },
     imagen: {
        type: DataTypes.STRING,
        allowNull: false
     },
     publicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
     },
     
});

export default propertie;