import React from 'react'
import { NavLink } from 'react-router-dom'

export const Header = () => {
    return (

        <header className='header'>
            <div className='logo'>
                <span>QR</span>
                <h3>Generador</h3>

            </div>

            <nav>
                <ul>
                    <li>
                        <NavLink to="/inicio" className={({isActive})=> isActive ? "active" : ""}>Inicio</NavLink>
                    </li>

                    <li>
                        <NavLink to="/listado" className={({isActive})=> isActive ? "active" : ""}>Listado</NavLink>
                    </li>

                    <li>
                        <NavLink to="/crear" className={({isActive})=> isActive ? "active" : ""}>Crear</NavLink>
                    </li>
                    
                    
                </ul>

                
            </nav>
        </header>

    )
}
