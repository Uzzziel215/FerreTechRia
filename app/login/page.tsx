"use client";

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import AuthContext from '../../context/AuthContext';
import { login } from '../../services/authService';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login: contextLogin } = useContext(AuthContext);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            contextLogin(data.jwt);
            toast.success('Login exitoso!');
            router.push('/');
        } catch (error) {
            toast.error('Error en el login. Revisa tus credenciales.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo</label>
                    <input type="email" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
