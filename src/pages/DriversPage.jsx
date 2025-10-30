import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import driverService from '../services/driver.service';

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await driverService.getAllDrivers();
        setDrivers(data);
      } catch (err) {
        setError('Falha ao carregar os motoristas.');
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

const handleStatusChange = async (driverId, newStatus) => {
    try {
      const updatedDriver = await driverService.updateDriver(driverId, { status: newStatus });
      
      setDrivers(prevDrivers => 
        prevDrivers.map(driver => 
          driver.id === driverId ? updatedDriver : driver
        )
      );
    } catch (err) {
      alert('Falha ao atualizar o status do motorista.');
    }
  };
  if (loading) return <div>Carregando motoristas...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
<div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gerenciamento de Motoristas</h1>
        <Link to="/dashboard">Voltar para o Dashboard</Link>
      </div>

      <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
        <thead>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '8px' }}>{driver.full_name}</td>
              <td style={{ padding: '8px' }}>{driver.email}</td>
              <td style={{ padding: '8px' }}>{driver.license_plate}</td>
              <td style={{ padding: '8px', textTransform: 'capitalize' }}>{driver.status.replace('_', ' ')}</td>
              <td style={{ padding: '8px' }}>
                <Link to={`/drivers/${driver.id}`}>{driver.full_name}</Link>
                {driver.status === 'pending_approval' && (
                  <button onClick={() => handleStatusChange(driver.id, 'active')}>
                    Aprovar
                  </button>
                )}
                {driver.status === 'active' && (
                  <button onClick={() => handleStatusChange(driver.id, 'inactive')} style={{ backgroundColor: '#ffc107' }}>
                    Desativar
                  </button>
                )}
                 {driver.status === 'inactive' && (
                  <button onClick={() => handleStatusChange(driver.id, 'active')} style={{ backgroundColor: '#28a745', color: 'white' }}>
                    Reativar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
}

export default DriversPage;