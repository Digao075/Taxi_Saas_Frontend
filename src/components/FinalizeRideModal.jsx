import React, { useState } from 'react';

function FinalizeRideModal({ isOpen, onClose, onFinalize }) {
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!price) {
      alert("O preço é obrigatório para finalizar a corrida.");
      return;
    }
    onFinalize(price, notes);
    setPrice('');
    setNotes('');
  };

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
    width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem'
  };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
  const textAreaStyle = { ...inputStyle, minHeight: '80px' };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <h2>Finalizar Corrida</h2>
        
        <label htmlFor="price">Valor Total (ex: 45.50)</label>
        <input
          id="price"
          type="number"
          placeholder="Ex: 45.50"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle}
        />
        
        <label htmlFor="notes">Observações (Opcional)</label>
        <textarea
          id="notes"
          placeholder="Ex: Inclui de taxa de espera."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={textAreaStyle}
        />
        
        <div>
          <button onClick={handleSubmit} style={{ background: 'green', color: 'white' }}>Finalizar e Faturar</button>
          <button onClick={onClose} style={{ marginLeft: '1rem' }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default FinalizeRideModal;