const {conexion} = require('./dataBase/conexion');
const Alumno = require('./models/alumno');
const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bwipjs = require('bwip-js');
const {generarQR} = require('./controladores/AlumnoControlador');

// Iniciando app
console.log("App de Node arrancada");

// Conexión a la base de datos
conexion();

const app = express();
const PORT = 3005;

// Middleware
app.use(cors()); // Habilita CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sirve las carpetas 'qr' y 'barras' como recursos estáticos
app.use('/qr', express.static(path.join(__dirname, './qr')));
app.use('/barras', express.static(path.join(__dirname, './barras')));

// Rutas
const rutas_generar = require('./routes/AlumnosRutas');
app.use('/api', rutas_generar);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});