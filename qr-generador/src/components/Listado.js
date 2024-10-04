import React, { useState, useEffect } from 'react';

export const Listado = () => {

  const [alumnos, setAlumnos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatingFor, setGeneratingFor] = useState(null); 
  // Función para obtener los alumnos
  const fetchAlumnos = async () => {
  
    try {
      const response = await fetch('http://localhost:3005/api/listar-alumnos');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setAlumnos(data);
    } catch (error) {
      console.error('Error al obtener los alumnos:', error);
      setErrorMessage('Hubo un error al obtener los datos.');
    }
  };

  // useEffect que configura la carga inicial y la actualización automática
  useEffect(() => {
    fetchAlumnos(); // Carga inicial

    // Configura un intervalo para actualizar el listado automáticamente cada 5 segundos
    const intervalId = setInterval(fetchAlumnos, 5000);

    // Limpia el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // Función para generar imágenes por alumno
  const handleGenerateImages = async (numeroControl) => {
    setGeneratingFor(numeroControl); // Marca al alumno que está en proceso de generación
    try {
      const response = await fetch('http://localhost:3005/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numeroControl }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      console.log('Código QR y código de barras generados:', result);
    } catch (error) {
      console.error('Error al generar las imágenes:', error);
      setErrorMessage('Hubo un error al generar las imágenes.');
    } finally {
      setGeneratingFor(null); 
    }
  };

  // Función para generar imágenes para todos los alumnos
  const handleGenerateAllImages = async () => {
    setGeneratingFor('all'); 
    try {
      const response = await fetch('http://localhost:3005/api/generate-all-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alumnos: alumnos.map(alumno => alumno.numeroControl) }), // Envía todos los números de control
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      console.log('Códigos QR y códigos de barras generados para todos los alumnos:', result);
    } catch (error) {
      console.error('Error al generar las imágenes para todos:', error);
      setErrorMessage('Hubo un error al generar las imágenes para todos.');
    } finally {
      setGeneratingFor(null); 
    }
  };

  return (
    <div>
      <h1>Listado de Alumnos</h1>
      {errorMessage && <p>{errorMessage}</p>} {/* Muestra un mensaje de error si existe */}

      {/* Botón para generar todos los códigos */}
      <button onClick={handleGenerateAllImages} disabled={generatingFor !== null}>
        {generatingFor === 'all' ? 'Generando Todos...' : 'Generar Todos los Códigos'}
      </button>

      {/* Listado de alumnos */}
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
              {/* 
              <button onClick={() => handleGenerateImages(alumno.numeroControl)} disabled={generatingFor === alumno.numeroControl}>
                {generatingFor === alumno.numeroControl ? 'Generando...' : 'Generar Código de Barras'}
              </button>*/}
            </div>
          </div>
        ))
      ) : (
        <p>No hay alumnos registrados.</p>
      )}
    </div>
  );
};