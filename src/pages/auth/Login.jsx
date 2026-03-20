import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import './AuthPages.css';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await authService.login(email, password);
            login(data.user);

            // Redirigir según el rol real devuelto por el backend
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/personal');
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Credenciales incorrectas. Verifique e intente de nuevo.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Iniciar Sesión">
            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}

                <div className="input-group">
                    <Mail className="input-icon" size={20} />
                    <input
                        type="email"
                        placeholder="cliente@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="input-group" style={{ position: 'relative' }}>
                    <Lock className="input-icon" size={20} />
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
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

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Iniciando...
                        </>
                    ) : (
                        'Inicio Sesión'
                    )}
                </button>

                <div className="auth-footer">
                    <Link to="/forgot-password">¿Olvidó su Contraseña?</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
