import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import './AuthPages.css';
import { Lock, Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';

const ResetPassword = () => {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(uidb64, token, password, confirmPassword);
            alert('Contraseña actualizada con éxito. Ya puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Ocurrió un error al cambiar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    const renderError = () => {
        if (!error) return null;
        if (Array.isArray(error)) {
            return (
                <div className="alert alert-danger">
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {error.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>
                </div>
            );
        }
        return <div className="alert alert-danger">{error}</div>;
    };

    return (
        <AuthLayout title="Restablecer Contraseña">
            <p className="auth-description">
                Crea una nueva contraseña segura para tu cuenta.
            </p>

            {renderError()}

            <form className="auth-form" onSubmit={handleSubmit}>
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
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
