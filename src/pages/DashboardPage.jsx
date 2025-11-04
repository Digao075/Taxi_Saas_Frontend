import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import rideService from '../services/ride.service';

function DashboardPage() {
  const navigate = useNavigate();

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const data = await rideService.getAllRides();
        setRides(data);
      } catch (err) {
        if (err.response?.status === 403) {
            handleLogout();
        } else {
            setError('Falha ao carregar as corridas.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }
  
return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard de Corridas</h1>
        <button onClick={handleLogout}>Sair</button>
      </div>

      <nav style={{ margin: '2rem 0' }}>
        <Link to="/drivers" style={{ fontSize: '1.2rem' }}>
          Gerenciar Motoristas
        </Link>
      </nav>

      <h2>Corridas Recentes</h2>
      <nav style={{ margin: '2rem 0', display: 'flex', gap: '2rem' }}>
        <Link to="/dispatch" style={{ fontSize: '1.2rem', padding: '10px', background: '#007bff', color: 'white', borderRadius: '5px' }}>
          TORRE DE CONTROLE (DESPACHO)
        </Link>
        <Link to="/drivers" style={{ fontSize: '1.2rem' }}>
          Gerenciar Motoristas
        </Link>
      </nav>
      
    </div>
  );
}
export default DashboardPage;