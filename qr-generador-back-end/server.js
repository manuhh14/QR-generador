const {conexion} = require( './dataBase/conexion')
const Alumno =require('./models/alumno')
const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bwipjs = require('bwip-js');
const {generarQR} = require('./controladores/AlumnoControlador')

///Iniciando app
console.log("app de node arrancada")

//Conexion a la base de datos
conexion()


const app = express();
const PORT = 3005;

// Middleware
app.use(cors()); // Habilita CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para recibir los datos del formulario
///app.post('/generate-qr', generarQR);

const rutas_generar = require("./routes/AlumnosRutas")
app.use("/api", rutas_generar)
// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});