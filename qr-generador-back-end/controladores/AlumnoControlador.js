const Alumno = require('../models/alumno'); // Importa el modelo Alumno
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const bwipjs = require('bwip-js');

const generarQR = async (req, res) => {
  const { nombreCompleto, tipoSangre, numeroControl, contactoEmergencias } = req.body;

  try {
    // Busca si el alumno ya existe por numeroControl
    let alumno = await Alumno.findOne({ numeroControl });

    if (alumno) {
      // Si el alumno existe, actualiza solo los campos necesarios
      alumno.nombreCompleto = nombreCompleto || alumno.nombreCompleto;
      alumno.tipoSangre = tipoSangre || alumno.tipoSangre;
      alumno.contactoEmergencias = contactoEmergencias || alumno.contactoEmergencias;
    } else {
      // Si no existe, crea un nuevo alumno
      alumno = new Alumno({
        nombreCompleto,
        tipoSangre,
        numeroControl,
        contactoEmergencias,
      });
    }

    // Guardar o actualizar el alumno en la base de datos
    const alumnoGuardado = await alumno.save();

    // Genera el código QR
    const qrCode = await QRCode.toDataURL(JSON.stringify(alumnoGuardado));

    // Verificación de carpetas
    const qrDir = path.join(__dirname, '../qr');
    const barcodeDir = path.join(__dirname, '../barras');
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });
    if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

    // Almacena el código QR en el servidor
    const qrFileName = `qr-${numeroControl}.png`;
    const qrFilePath = path.join(qrDir, qrFileName);

    // Eliminar el prefijo base64 para guardar la imagen
    const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
    fs.writeFileSync(qrFilePath, base64Data, 'base64');

    // Genera el código de barras
    bwipjs.toBuffer({
      bcid: 'code128',
      text: numeroControl,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    }, (err, buffer) => {
      if (err) {
        return res.status(500).json({ message: 'Error al generar el código de barras', error: err });
      }

      const barcodeFileName = `barcode-${numeroControl}.png`;
      const barcodeFilePath = path.join(barcodeDir, barcodeFileName);

      // Almacena el código de barras en el servidor
      fs.writeFileSync(barcodeFilePath, buffer);

      res.json({
        message: 'Código QR, código de barras generados, y datos guardados',
        alumno: alumnoGuardado,
        qrUrl: `/qr/${qrFileName}`,  // URL para acceder al código QR
        barcodeUrl: `/barras/${barcodeFileName}`,  // URL para acceder al código de barras
      });
    });

  } catch (error) {
    console.error('Error en la generación de QR o almacenamiento de datos:', error);
    res.status(500).json({ message: 'Error al generar el código QR o guardar los datos', error: error.message });
  }
};
/*Metodo para conseguir los datos alamcenados */
const obtenerAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.find(); // Obtiene todos los alumnos
    res.json(alumnos); // Cambia esto para devolver solo el arreglo de alumnos
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los alumnos', error });
  } 
};
module.exports = {
  generarQR,
  obtenerAlumnos
}