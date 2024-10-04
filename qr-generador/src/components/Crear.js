import React, { useState } from 'react';

export const Crear = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    tipoSangre: '',
    numeroControl: '',
    contactoEmergencias: '',
    numeroSeguro: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [qrUrl, setQrUrl] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3005/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Respuesta del servidor:', result);
        setQrUrl(result.qrFilePath); // Ajuste aquí para usar qrFilePath
        setErrorMessage(''); // Limpia el mensaje de error si la respuesta fue exitosa
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      setErrorMessage('Hubo un error al enviar los datos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre Completo:</label>
          <input
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Tipo de Sangre:</label>
          <input
            type="text"
            name="tipoSangre"
            value={formData.tipoSangre}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Número de Control:</label>
          <input
            type="text"
            name="numeroControl"
            value={formData.numeroControl}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Contacto de Emergencias:</label>
          <input
            type="text"
            name="contactoEmergencias"
            value={formData.contactoEmergencias}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Numero de Seguro Social:</label>
          <input
            type="text"
            name="numeroSeguro"
            value={formData.numeroSeguro}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Enviar</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
     {/*{qrUrl && <img src={qrUrl} alt="Código QR generado" />}*/}
    </div>
  );
};