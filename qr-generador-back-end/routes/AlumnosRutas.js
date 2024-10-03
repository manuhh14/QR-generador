const express= require('express')
const router = express.Router();
const AlumnoControlador= require ("../controladores/AlumnoControlador")



router.post('/generate-qr', AlumnoControlador.generarQR);

module.exports = router;