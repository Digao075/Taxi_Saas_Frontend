import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); 
    setLoading(true); 

    try {
      const data = await authService.login(email, password);
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
      console.log('Login bem-sucedido!', data);
      alert('Login realizado com sucesso! Token: ' + data.token);

      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erro ao tentar fazer login.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <h2>Login do Painel</h2>
        
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label htmlFor="password">Senha</label>
          <input
            id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;