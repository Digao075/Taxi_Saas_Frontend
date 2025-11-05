import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard Principal</h1>
        <button onClick={handleLogout}>Sair</button>
      </div>

      <nav style={{ margin: '2rem 0', display: 'flex', gap: '2rem' }}>
        <Link 
          to="/dispatch" 
          style={{ fontSize: '1.2rem', padding: '10px 15px', background: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}
        >
          Torre de Controle (Despacho)
        </Link>
        <Link to="/in-progress" style={{ fontSize: '1.2rem', padding: '10px 15px', background: '#ffc107', color: 'black', borderRadius: '5px', textDecoration: 'none' }}>
          Corridas em Andamento
        </Link>
        <Link 
          to="/drivers" 
          style={{ fontSize: '1.2rem', padding: '10px 15px', background: '#17a2b8', color: 'white', borderRadius: '5px', textDecoration: 'none' }}
        >
          Gerenciar Motoristas
        </Link>
        <Link 
          to="/reports" 
          style={{ fontSize: '1.2rem', padding: '10px 15px', background: '#28a745', color: 'white', borderRadius: '5px', textDecoration: 'none' }}
        >
          Relatórios e Faturamento
        </Link>
      </nav>

      <h2>Bem-vindo à Central de Comando</h2>
      <p>Use os links acima para navegar entre as seções.</p>
    </div>
  );
}

export default DashboardPage;