import { DataTypes } from "sequelize";
import db from "../config/db.js";

const message= db.define('messages', {
    message: {
        type: DataTypes.STRING(200),
        allowNull: false
    }
});

export default message;