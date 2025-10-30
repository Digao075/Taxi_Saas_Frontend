import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import driverService from '../services/driver.service';

function DriverDetailPage() {
  const { driverId } = useParams();
  
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const data = await driverService.getDriverById(driverId);
        setDriver(data);
        setFormData(data);
      } catch (err) {
        setError('Falha ao carregar os detalhes do motorista.');
      } finally {
        setLoading(false);
      }
    };
    fetchDriver();
  }, [driverId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const updatedDriver = await driverService.updateDriver(driverId, formData);
      setDriver(updatedDriver); 
      setIsEditing(false);
    } catch (err) {
      alert('Falha ao salvar as alterações.');
    }
  };

  if (loading) return <div>Carregando detalhes...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!driver) return <div>Motorista não encontrado.</div>;

return (
    <div style={{ padding: '2rem' }}>
      <Link to="/drivers">← Voltar para a lista</Link>
      
      {isEditing ? (
        <form onSubmit={handleSave} style={{ marginTop: '1rem' }}>
          <h1>Editando Motorista: {driver.full_name}</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <input name="full_name" value={formData.full_name} onChange={handleInputChange} placeholder="Nome Completo" />
            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
            <input name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Telefone" />
            <input name="license_plate" value={formData.license_plate} onChange={handleInputChange} placeholder="Placa do Veículo" />
            <input name="vehicle_model" value={formData.vehicle_model} onChange={handleInputChange} placeholder="Modelo do Veículo" />
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="pending_approval">Pendente</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="blocked">Bloqueado</option>
            </select>
            <div>
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: '1rem' }}>Cancelar</button>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <h1>Detalhes do Motorista</h1>
            <button onClick={() => setIsEditing(true)}>Editar</button>
          </div>
          <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
            <p><strong>ID:</strong> {driver.id}</p>
            <p><strong>Nome Completo:</strong> {driver.full_name}</p>
            <p><strong>Email:</strong> {driver.email}</p>
            <p><strong>Status:</strong> {driver.status}</p>
          </div>
        </div>
      )}
    </div>
  );
}
export default DriverDetailPage;