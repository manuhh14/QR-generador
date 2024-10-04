const express= require('express')
const router = express.Router();
const AlumnoControlador= require ("../controladores/AlumnoControlador")



router.post('/generate-qr', AlumnoControlador.generarQR);
router.get('/listar-alumnos', AlumnoControlador.obtenerAlumnos)
router.post('/generate-all-qr', AlumnoControlador.generarTodosQR);
module.exports = router;