const express = require('express');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Importa cors
const bwipjs = require('bwip-js'); // Importa bwip-js

const app = express();
const PORT = 3005;

// Middleware
app.use(cors()); // Habilita CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para recibir los datos del formulario
app.post('/generate-qr', async (req, res) => {
  const { nombreCompleto, tipoSangre, numeroControl, contactoEmergencias } = req.body;

  // Genera un objeto con los datos
  const data = {
    nombreCompleto,
    tipoSangre,
    numeroControl,
    contactoEmergencias,
  };

  try {
    // Genera el código QR
    const qrCode = await QRCode.toDataURL(JSON.stringify(data));

    // Almacena el código QR en el servidor en la carpeta "qr"
    const qrFileName = `qr-${numeroControl}.png`; // Asigna un nombre al archivo
    const qrFilePath = path.join(__dirname, 'qr', qrFileName); // Cambia la ruta para guardar en la carpeta "qr"

    // Guarda el código QR como imagen
    const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
    fs.writeFile(qrFilePath, base64Data, 'base64', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al guardar el código QR' });
      }
    });

    // Genera el código de barras
    bwipjs.toBuffer({
      bcid: 'code128', // Tipo de código de barras
      text: numeroControl, // Texto del código de barras
      scale: 3, // Escala
      height: 10, // Altura
      includetext: true, // Incluir texto
      textxalign: 'center', // Alinear texto al centro
    }, (err, buffer) => {
      if (err) {
        return res.status(500).json({ message: 'Error al generar el código de barras', error: err });
      }

      // Almacena el código de barras en el servidor
      const barcodeFileName = `barcode-${numeroControl}.png`; // Asigna un nombre al archivo
      const barcodeFilePath = path.join(__dirname, 'barras', barcodeFileName); // Cambia la ruta para guardar en la carpeta "qr"

      fs.writeFile(barcodeFilePath, buffer, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error al guardar el código de barras', error: err });
        }

        res.json({ message: 'Código QR y código de barras generados y guardados', qrFilePath, barcodeFilePath });
      });
    });

  } catch (error) {
    res.status(500).json({ message: 'Error al generar el código QR', error });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});