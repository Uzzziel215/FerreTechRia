"use client";

import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { seedDatabase } from '../../services/authService';
import { toast } from 'react-hot-toast';

export default function Seed() {
    const { user } = useContext(AuthContext);

    const handleSeed = async () => {
        try {
            await seedDatabase();
            toast.success('Base de datos poblada exitosamente!');
        } catch (error) {
            toast.error('Error al poblar la base de datos.');
        }
    };

    if (user?.rol !== 'ADMIN') {
        return null;
    }

    return (
        <div>
            <h2>Poblar Base de Datos</h2>
            <button onClick={handleSeed}>Poblar</button>
        </div>
    );
}
