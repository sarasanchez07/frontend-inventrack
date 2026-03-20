import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import './AuthPages.css';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authService.forgotPassword(email);
            if (res.data?.exists) {
                setStep(2);
            } else {
                setError('Ese correo no está registrado en el sistema.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'No pudimos validar tu correo.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, password, confirmPassword);
            alert('Contraseña actualizada con éxito. Ya puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Ocurrió un error al cambiar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title={step === 1 ? "¿Olvidaste tu contraseña?" : "Restablecer Contraseña"}>
            <p className="auth-description">
                {step === 1
                    ? "Ingresa tu correo para recuperar tu cuenta y vuelve a gestionar tu inventario."
                    : "Crea una nueva contraseña segura para tu cuenta."
                }
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            {step === 1 ? (
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
                        {loading ? 'Validando...' : 'Ingresar Correo'}
                    </button>

                    <Link to="/login" className="btn btn-outline btn-block mt-3 text-center">
                        Volver a Inicio de Sesión
                    </Link>
                </form>
            ) : (
                <form className="auth-form" onSubmit={handleResetPassword}>
                    <label className="input-label">Nueva Contraseña</label>
                    <div className="input-group" style={{ position: 'relative' }}>
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{ paddingRight: '40px' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'
                            }}
                        >
                            {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                        </button>
                    </div>

                    <label className="input-label">Confirmar Contraseña</label>
                    <div className="input-group" style={{ position: 'relative' }}>
                        <Lock className="input-icon" size={20} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repite tu contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            style={{ paddingRight: '40px' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center'
                            }}
                        >
                            {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Contraseña'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-outline btn-block mt-3 text-center"
                        disabled={loading}
                    >
                        Volver atrás
                    </button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
