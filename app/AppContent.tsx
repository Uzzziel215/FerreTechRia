"use client";

import { useContext } from 'react';
import Link from 'next/link';
import AuthContext from '../context/AuthContext';

export default function AppContent({ children }: { children: React.ReactNode }) {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            <nav>
                <Link href="/">Home</Link>
                {user ? (
                    <>
                        <span>Hola, {user.nombre}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <Link href="/login">Login</Link>
                )}
            </nav>
            <main>
                {children}
            </main>
        </div>
    );
}
