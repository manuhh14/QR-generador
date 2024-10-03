const { Schema, model } = require("mongoose");

const AlumnoSchema = Schema({
    nombreCompleto: String,
    tipoSangre: String,
    numeroControl: String,
    contactoEmergencias: String
});

module.exports = model("Alumnos", AlumnoSchema);
