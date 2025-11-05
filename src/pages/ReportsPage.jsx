import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import rideService from '../services/ride.service';
import companyService from '../services/company.service';
import driverService from '../services/driver.service';


function ReportsPage() {
  const [billingRides, setBillingRides] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingTotal, setBillingTotal] = useState(0);
  const [companyId, setCompanyId] = useState('');
  const [billStartDate, setBillStartDate] = useState('');
  const [billEndDate, setBillEndDate] = useState('');

  const [driverRides, setDriverRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverLoading, setDriverLoading] = useState(false);
  const [driverTotal, setDriverTotal] = useState(0);
  const [driverId, setDriverId] = useState('');
  const [driverStartDate, setDriverStartDate] = useState('');
  const [driverEndDate, setDriverEndDate] = useState('');

  useEffect(() => {
    companyService.getAllCompanies()
      .then(data => setCompanies(data))
      .catch(err => console.error("Erro ao buscar empresas", err));
    
    driverService.getAllDrivers()
      .then(data => setDrivers(data.filter(d => d.status === 'active')))
      .catch(err => console.error("Erro ao buscar motoristas", err));
  }, []);

  const handleGenerateBillingReport = async () => {
    setBillingLoading(true);
    try {
      const filters = {
        status: 'completed',
        company_id: companyId || undefined,
        startDate: billStartDate || undefined,
        endDate: billEndDate || undefined,
      };
      const data = await rideService.getFilteredRides(filters);
      setBillingRides(data);
      const sum = data.reduce((acc, ride) => acc + parseFloat(ride.price || 0), 0);
      setBillingTotal(sum);
    } catch (error) {
      alert("Falha ao gerar o relatório de faturamento.");
    } finally {
      setBillingLoading(false);
    }
  };

  const handleGenerateDriverReport = async () => {
    if (!driverId) {
      alert("Por favor, selecione um motorista.");
      return;
    }
    setDriverLoading(true);
    try {
      const filters = {
        status: 'completed',
        driver_id: driverId, 
        startDate: driverStartDate || undefined,
        endDate: driverEndDate || undefined,
      };
      const data = await rideService.getFilteredRides(filters);
      setDriverRides(data);
      let totalBruto = 0;
      let totalComissao = 0;
      data.forEach(ride => {
        const ridePrice = parseFloat(ride.price || 0);
        const commissionRate = parseFloat(ride.driver_commission_rate || 0.25);
        totalBruto += ridePrice;
        totalComissao += ridePrice * commissionRate;
      });
      setDriverTotal(totalBruto - totalComissao);
    } catch (error) {
      alert("Falha ao gerar o relatório do motorista.");
    } finally {
      setDriverLoading(false);
    }
  };
const handleExportExcel = () => {
    if (billingRides.length === 0) {
      alert("Nenhum dado para exportar. Por favor, gere um relatório primeiro.");
      return;
    }

    const formattedData = billingRides.map(ride => ({
      "Voucher": ride.voucher_code,
      "Colaborador": ride.employee_name,
      "Motorista": ride.driver_name || 'N/A',
      "Data": ride.completed_at ? new Date(ride.completed_at).toLocaleString('pt-BR') : 'N/A',
      "Origem": ride.origin_address,
      "Destino": ride.destination_address,
      "Observações": ride.admin_notes || '',
      "Valor (R$)": parseFloat(ride.price || 0).toFixed(2)
    }));
    
    formattedData.push({
      "Voucher": "TOTAL",
      "Valor (R$)": billingTotal.toFixed(2)
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Faturamento"); // Dá o nome "Faturamento" para a aba

    const fileName = `faturamento_gestaxi_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const reportSectionStyle = { marginTop: '2rem', borderTop: '2px solid #007bff', paddingTop: '2rem' };
  const filterBoxStyle = { display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: '#f4f4f4', padding: '1rem', borderRadius: '8px' };
  const buttonStyle = { padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
  const inputStyle = { padding: '8px', marginLeft: '5px' };
  const tableStyle = { width: '100%', marginTop: '1rem', borderCollapse: 'collapse' };
  const thStyle = { textAlign: 'left', padding: '8px', borderBottom: '2px solid black' };
  const tdStyle = { padding: '8px', borderBottom: '1px solid #ccc' };

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/dashboard">← Voltar para o Dashboard</Link>
      <h1 style={{ marginTop: '1rem' }}>Relatórios e Finanças</h1>
      <section style={reportSectionStyle}>
        <h2>Faturamento por Empresa (Contas a Receber)</h2>
        <div style={filterBoxStyle}>
          <button onClick={handleGenerateBillingReport} disabled={billingLoading} style={buttonStyle}>
            {billingLoading ? 'Gerando...' : 'Gerar Relatório'}
          </button>
          
          <button 
            onClick={handleExportExcel} 
            disabled={billingRides.length === 0}
            style={{ ...buttonStyle, background: '#17a2b8', marginLeft: '1rem' }}
          >
            Exportar Excel (.xlsx)
          </button>
          <div>
            <label>Empresa:</label>
            <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} style={inputStyle}>
              <option value="">Todas as Empresas</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>De:</label>
            <input type="date" value={billStartDate} onChange={(e) => setBillStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label>Até:</label>
            <input type="date" value={billEndDate} onChange={(e) => setBillEndDate(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={handleGenerateBillingReport} disabled={billingLoading} style={buttonStyle}>
            {billingLoading ? 'Gerando...' : 'Gerar Faturamento'}
          </button>
        </div>
        <h3 style={{ marginTop: '2rem' }}>Total a Faturar: R$ {billingTotal.toFixed(2)}</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Voucher</th>
              <th style={thStyle}>Colaborador</th>
              <th style={thStyle}>Motorista</th>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Origem</th>
              <th style={thStyle}>Destino</th>
              <th style={thStyle}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {billingRides.map((ride) => (
              <tr key={ride.id}>
                <td style={tdStyle}>{ride.voucher_code}</td>
                <td style={tdStyle}>{ride.employee_name}</td>
                <td style={tdStyle}>{ride.driver_name || 'N/A'}</td>
                <td style={tdStyle}>{ride.completed_at ? new Date(ride.completed_at).toLocaleString('pt-BR') : 'N/A'}</td>
                <td style={tdStyle}>{ride.origin_address}</td>
                <td style={tdStyle}>{ride.destination_address}</td>
                <td style={tdStyle}>R$ {parseFloat(ride.price || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={reportSectionStyle}>
        <h2>Pagamentos por Motorista (Contas a Pagar)</h2>
        <div style={filterBoxStyle}>
          <div>
            <label>Motorista:</label>
            <select value={driverId} onChange={(e) => setDriverId(e.target.value)} style={inputStyle}>
              <option value="">Selecione um motorista</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>De:</label>
            <input type="date" value={driverStartDate} onChange={(e) => setDriverStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label>Até:</label>
            <input type="date" value={driverEndDate} onChange={(e) => setDriverEndDate(e.target.value)} style={inputStyle} />
          </div>
          <button onClick={handleGenerateDriverReport} disabled={driverLoading} style={buttonStyle}>
            {driverLoading ? 'Gerando...' : 'Gerar Extrato'}
          </button>
        </div>
        <h3 style={{ marginTop: '2rem' }}>Total LÍQUIDO a Pagar ao Motorista: R$ {driverTotal.toFixed(2)}</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Voucher</th>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Colaborador</th>
              <th style={thStyle}>Valor Bruto</th>
              <th style={thStyle}>Nossa Taxa (%)</th>
              <th style={thStyle}>Valor Líquido</th>
            </tr>
          </thead>
          <tbody>
            {driverRides.map((ride) => {
              const ridePrice = parseFloat(ride.price || 0);
              const rate = parseFloat(ride.driver_commission_rate || 0.25);
              const commission = ridePrice * rate;
              const netValue = ridePrice - commission;
              return (
                <tr key={ride.id}>
                  <td style={tdStyle}>{ride.voucher_code}</td>
                  <td style={tdStyle}>{ride.completed_at ? new Date(ride.completed_at).toLocaleString('pt-BR') : 'N/A'}</td>
                  <td style={tdStyle}>{ride.employee_name}</td>
                  <td style={tdStyle}>R$ {ridePrice.toFixed(2)}</td>
                  <td style={tdStyle}>R$ {commission.toFixed(2)} ({rate * 100}%)</td>
                  <td style={tdStyle}><strong>R$ {netValue.toFixed(2)}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default ReportsPage;