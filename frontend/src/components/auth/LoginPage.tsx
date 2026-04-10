import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch {
      setError('Invalid credentials. Try demo / demo1234');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 20%, rgba(108,92,231,0.15) 0%, var(--color-bg-dark) 70%)',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        animation: 'scale-in 0.5s ease forwards',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: 64, height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            boxShadow: '0 8px 32px rgba(108,92,231,0.3)',
          }}>
            <Zap size={32} color="white" />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--color-text-primary), var(--color-primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}>
            gamiNANCE
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
            Level up your financial life
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '36px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', marginBottom: 8,
                color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 500,
              }}>
                Username
              </label>
              <input
                id="login-username"
                className="input-field"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{
                display: 'block', marginBottom: 8,
                color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: 500,
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginTop: 12 }}>
                {error}
              </p>
            )}

            <button
              id="login-submit"
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ width: '100%', marginTop: 24, fontSize: '1rem', padding: '14px' }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{
            marginTop: 24, paddingTop: 24,
            borderTop: '1px solid var(--color-border)',
            textAlign: 'center',
          }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
              Demo credentials: <span style={{ color: 'var(--color-accent)' }}>demo / demo1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
