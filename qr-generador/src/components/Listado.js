import React, { useState, useEffect } from 'react';

export const Listado = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [generating, setGenerating] = useState(false); // Para manejar el estado de generación

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/listar-alumnos');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Datos recibidos:', data);
        setAlumnos(data);
      } catch (error) {
        console.error('Error al obtener los alumnos:', error);
        setErrorMessage('Hubo un error al obtener los datos.');
      }
    };

    fetchAlumnos();
  }, []);

  const handleGenerateImages = async (numeroControl) => {
    setGenerating(true); // Inicia el estado de generación
    try {
      const response = await fetch('http://localhost:3005/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numeroControl }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Código QR y código de barras generados:', result);
        // Actualiza el estado de alumnos si es necesario
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al generar las imágenes:', error);
      setErrorMessage('Hubo un error al generar las imágenes.');
    } finally {
      setGenerating(false); // Termina el estado de generación
    }
  };

  return (
    <div>
      <h1>Listado de Alumnos</h1>
      {errorMessage && <p>{errorMessage}</p>} {/* Muestra un mensaje de error si existe */}
      {alumnos.length > 0 ? (
        alumnos.map(alumno => (
          <div key={alumno._id} id="content" className="content">
            <div className="alumno-info">
              <h2>{alumno.nombreCompleto}</h2>
              <p><strong>Tipo de Sangre:</strong> {alumno.tipoSangre}</p>
              <p><strong>Número de Control:</strong> {alumno.numeroControl}</p>
              <p><strong>Contacto de Emergencias:</strong> {alumno.contactoEmergencias}</p>
            </div>
            <div className="imagenes">
              <div className="imagen-qr">
                <h4>Código QR</h4>
                <img src={`http://localhost:3005/qr/qr-${alumno.numeroControl}.png`} alt="Código QR" />
              </div>
              <div className="imagen-barcode">
                <h4>Código de Barras</h4>
                <img src={`http://localhost:3005/barras/barcode-${alumno.numeroControl}.png`} alt="Código de Barras" />
              </div>
              <button onClick={() => handleGenerateImages(alumno.numeroControl)} disabled={generating}>
                {generating ? 'Generando...' : 'Generar Código de Barras'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay alumnos registrados.</p>
      )}
    </div>
  );
};