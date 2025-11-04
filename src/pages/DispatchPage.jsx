import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import rideService from '../services/ride.service';
import AssignDriverModal from '../components/AssignDriverModal';

function DispatchPage() {
  const [pendingRides, setPendingRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState(null);

  useEffect(() => {
    fetchPendingRides();
  }, []);

  const fetchPendingRides = async () => {
    setLoading(true);
    try {
      const data = await rideService.getRidesByStatus('pending');
      setPendingRides(data);
    } catch (error) {
      console.error("Falha ao buscar corridas pendentes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (rideId) => {
    setSelectedRideId(rideId);
    setIsModalOpen(true);
  };

  const handleAssignDriver = async (driverId) => {
    if (!selectedRideId) return;

    try {
      await rideService.updateRide(selectedRideId, {
        driver_id: driverId,
        status: 'accepted'
      });
      
      setIsModalOpen(false);
      setSelectedRideId(null);
      
      setPendingRides(prevRides => 
        prevRides.filter(ride => ride.id !== selectedRideId)
      );

    } catch (error) {
      alert("Falha ao atribuir o motorista.");
    }
  };

  if (loading) return <div>Carregando corridas para despacho...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar para o Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>Torre de Controle - Corridas Pendentes</h1>
      
      {pendingRides.length === 0 ? (
        <p>Nenhuma corrida pendente no momento.</p>
      ) : (
        <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid black' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Colaborador (ID)</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Origem</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Destino</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Solicitado Em</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Agendado Para</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pendingRides.map((ride) => (
              <tr key={ride.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '8px' }}>{ride.employee_id}</td>
                <td style={{ padding: '8px' }}>{ride.origin_address}</td>
                <td style={{ padding: '8px' }}>{ride.destination_address}</td>
                <td style={{ padding: '8px' }}>{new Date(ride.requested_at).toLocaleString('pt-BR')}</td>
                <td style={{ padding: '8px' }}>{ride.scheduled_for ? new Date(ride.scheduled_for).toLocaleString('pt-BR') : 'IMEDIATA'}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => handleOpenModal(ride.id)}>
                    Atribuir Motorista
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AssignDriverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssignDriver}
      />
    </div>
  );
}

export default DispatchPage;