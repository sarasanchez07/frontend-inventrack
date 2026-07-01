import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import './AuthPages.css';
import { Mail } from 'lucide-react';
import authService from '../../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            setError(err.response?.data?.error || 'No pudimos procesar tu solicitud. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title={submitted ? "Correo Enviado" : "¿Olvidaste tu contraseña?"}>
            {submitted ? (
                <>
                    <p className="auth-description text-center">
                        Si el correo electrónico está registrado, se han enviado las instrucciones de recuperación. Por favor, revisa tu bandeja de entrada y tu carpeta de spam.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-block text-center mt-4">
                        Volver a Inicio de Sesión
                    </Link>
                </>
            ) : (
                <>
                    <p className="auth-description">
                        Ingresa tu correo para recuperar tu cuenta y volver a gestionar tu inventario.
                    </p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form className="auth-form" onSubmit={handleVerifyEmail}>
                        <label className="input-label">Correo Electrónico</label>
                        <div className="input-group">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                        </button>

                        <Link to="/login" className="btn btn-outline btn-block mt-3 text-center">
                            Volver a Inicio de Sesión
                        </Link>
                    </form>
                </>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
