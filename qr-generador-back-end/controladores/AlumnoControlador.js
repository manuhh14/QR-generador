const Alumno = require('../models/alumno'); // Importa el modelo Alumno
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const bwipjs = require('bwip-js');

const generarQR = async (req, res) => {
  const { nombreCompleto, tipoSangre, numeroControl, contactoEmergencias,numeroSeguro } = req.body;

  try {
    // Busca si el alumno ya existe por numeroControl
    let alumno = await Alumno.findOne({ numeroControl });

    if (alumno) {
      // Si el alumno existe, actualiza solo los campos necesarios
      alumno.nombreCompleto = nombreCompleto || alumno.nombreCompleto;
      alumno.tipoSangre = tipoSangre || alumno.tipoSangre;
      alumno.contactoEmergencias = contactoEmergencias || alumno.contactoEmergencias;
      alumno.numeroSeguro= numeroSeguro || alumno.numeroSeguro;
    } else {
      // Si no existe, crea un nuevo alumno
      alumno = new Alumno({
        nombreCompleto,
        tipoSangre,
        numeroControl,
        contactoEmergencias,
        numeroSeguro
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
      text: numeroSeguro,
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
        qrUrl: `/qr/${qrFileName}`,  
        barcodeUrl: `/barras/${barcodeFileName}`, 
      });
    });

  } catch (error) {
    console.error('Error en la generación de QR o almacenamiento de datos:', error);
    res.status(500).json({ message: 'Error al generar el código QR o guardar los datos', error: error.message });
  }
};

/* Método para conseguir los datos almacenados */
const obtenerAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.find(); 
    res.json(alumnos); 
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los alumnos', error });
  } 
};

/* Nuevo método para generar códigos QR y de barras para todos los alumnos */
const generarTodosQR = async (req, res) => {
  try {
    const alumnos = await Alumno.find(); 
    const resultados = [];

    // Verificación de carpetas
    const qrDir = path.join(__dirname, '../qr');
    const barcodeDir = path.join(__dirname, '../barras');
    if (!fs.existsSync(qrDir)) fs.mkdirSync(qrDir, { recursive: true });
    if (!fs.existsSync(barcodeDir)) fs.mkdirSync(barcodeDir, { recursive: true });

    // Itera sobre cada alumno
    for (const alumno of alumnos) {
       // Solo los campos requeridos para el código QR
       const qrData = {
        nombreCompleto: alumno.nombreCompleto,
        tipoSangre: alumno.tipoSangre,
        numeroDeSeguroSocial: alumno.numeroSeguro,
        contactoEmergencias: alumno.contactoEmergencias,
      };

      // Genera el código QR con los datos seleccionados
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

      // Almacena el código QR en el servidor
      const qrFileName = `qr-${alumno.numeroControl}.png`;
      const qrFilePath = path.join(qrDir, qrFileName);
      const base64Data = qrCode.replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(qrFilePath, base64Data, 'base64');

      // Genera el código de barras
      const barcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128',
        text: alumno.numeroControl,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });

      const barcodeFileName = `barcode-${alumno.numeroControl}.png`;
      const barcodeFilePath = path.join(barcodeDir, barcodeFileName);
      fs.writeFileSync(barcodeFilePath, barcodeBuffer);

      // Guarda los resultados
      resultados.push({
        nombreCompleto: alumno.nombreCompleto,
        qrUrl: `/qr/${qrFileName}`,
        barcodeUrl: `/barras/${barcodeFileName}`
      });
    }

    res.json({
      message: 'Códigos QR y de barras generados para todos los alumnos',
      resultados,
    });
  } catch (error) {
    console.error('Error al generar códigos QR y de barras:', error);
    res.status(500).json({ message: 'Error al generar los códigos QR y de barras', error: error.message });
  }
};

module.exports = {
  generarQR,
  obtenerAlumnos,
  generarTodosQR, 
};