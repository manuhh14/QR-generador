const Alumno = require('../models/alumno'); // Importa el modelo Alumno
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const bwipjs = require('bwip-js');

const generarQR = async (req, res) => {
  const { nombreCompleto, tipoSangre, numeroControl, contactoEmergencias } = req.body;

  const nuevoAlumno = new Alumno({
    nombreCompleto,
    tipoSangre,
    numeroControl,
    contactoEmergencias,
  });

  try {
    // Guardar alumno en la base de datos
    const alumnoGuardado = await nuevoAlumno.save();

    // Genera el código QR
    const qrCode = await QRCode.toDataURL(JSON.stringify(alumnoGuardado));

    // Almacena el código QR en el servidor
    const qrFileName = `qr-${numeroControl}.png`;
    const qrFilePath = path.join(__dirname, '../qr', qrFileName);

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
      const barcodeFilePath = path.join(__dirname, '../barras', barcodeFileName);

      // Almacena el código de barras en el servidor
      fs.writeFileSync(barcodeFilePath, buffer);

      res.json({
        message: 'Código QR, código de barras generados, y datos guardados',
        alumno: alumnoGuardado,
        qrFilePath,
        barcodeFilePath,
      });
    });

  } catch (error) {
    // Manejo de errores mejorado
    console.error('Error en la generación de QR o almacenamiento de datos:', error);
    res.status(500).json({ message: 'Error al generar el código QR o guardar los datos', error: error.message });
  }
};

module.exports = {
  generarQR,
}