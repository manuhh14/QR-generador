import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Inicio } from '../Inicio';
import { Listado } from '../Listado';
import { Crear } from '../Crear';
import { Header } from '../layout/Header';

export const MisRutas = () => {
  return (
    <BrowserRouter>
      {/* Header y Navegación */}
      <Header />
      
      {/* Contenido central */}
      <section className='content'>
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/listado" element={<Listado />} />
          <Route path="/crear" element={<Crear />} />
        </Routes>
      </section>
    </BrowserRouter>
  );
}
