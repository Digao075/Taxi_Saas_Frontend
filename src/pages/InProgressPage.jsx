import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import rideService from '../services/ride.service';
import FinalizeRideModal from '../components/FinalizeRideModal';

function InProgressPage() {
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRideId, setSelectedRideId] = useState(null);

  useEffect(() => {
    fetchAcceptedRides();
  }, []);

  const fetchAcceptedRides = async () => {
    setLoading(true);
    try {
      const data = await rideService.getRidesByStatus('accepted');
      setAcceptedRides(data);
    } catch (error) {
      console.error("Falha ao buscar corridas em andamento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (rideId) => {
    setSelectedRideId(rideId);
    setIsModalOpen(true);
  };

  const handleFinalize = async (price, notes) => {
    if (!selectedRideId) return;
    try {
      await rideService.updateRide(selectedRideId, {
        price: price,
        admin_notes: notes,
        status: 'completed'
      });
      setIsModalOpen(false);
      setAcceptedRides(prevRides => 
        prevRides.filter(ride => ride.id !== selectedRideId)
      );
    } catch (error) {
      alert("Falha ao finalizar a corrida.");
    }
  };

  if (loading) return <div>Carregando corridas em andamento...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar para o Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>Corridas em Andamento (Aceitas)</h1>
      
      {acceptedRides.length === 0 ? (
        <p>Nenhuma corrida em andamento no momento.</p>
      ) : (
        <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid black' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Voucher</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Colaborador</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Motorista</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Destino</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {acceptedRides.map((ride) => (
              <tr key={ride.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '8px' }}>{ride.voucher_code}</td>
                <td style={{ padding: '8px' }}>{ride.employee_name}</td>
                <td style={{ padding: '8px' }}>{ride.driver_name}</td>
                <td style={{ padding: '8px' }}>{ride.destination_address}</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => handleOpenModal(ride.id)} style={{ background: 'green', color: 'white' }}>
                    Finalizar Corrida
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <FinalizeRideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFinalize={handleFinalize}
      />
    </div>
  );
}

export default InProgressPage;