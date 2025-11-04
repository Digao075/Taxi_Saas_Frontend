import React, { useState, useEffect } from 'react';
import driverService from '../services/driver.service';

function AssignDriverModal({ isOpen, onClose, onAssign }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      driverService.getAllDrivers()
        .then(data => setDrivers(data))
        .catch(err => console.error("Erro ao buscar motoristas:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]); 

  if (!isOpen) {
    return null; 
  }

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  };
  const contentStyle = {
    backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
    width: '400px', maxHeight: '80vh', overflowY: 'auto',
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2>Atribuir Motorista</h2>
        {loading ? (
          <p>Carregando motoristas...</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {drivers.filter(d => d.status === 'active').map(driver => (
              <li key={driver.id} style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer' }}
                  onClick={() => onAssign(driver.id)}>
                {driver.full_name} (ID: {driver.id})
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}

export default AssignDriverModal;