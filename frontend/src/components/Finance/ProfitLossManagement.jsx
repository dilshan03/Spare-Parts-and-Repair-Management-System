// src/components/ProfitLossManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const token = localStorage.getItem('token');
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/profit-loss';

const emptyEntry = {
  date: '',
  description: '',
  revenue: { serviceIncome: 0, sparePartsSales: 0, otherIncome: 0 },
  cogs:    { partsCost: 0, materialsCost: 0 },
  expenses:{ salaries: 0, rent: 0, utilities: 0, maintenance: 0, marketing: 0, depreciation: 0 },
  other:   { interestIncome: 0, interestExpense: 0, misc: 0 }
};

export default function ProfitLossManagement() {
  // Today's date in YYYY-MM-DD format for default and max validation
  const today = new Date().toISOString().slice(0, 10);

  const [entries, setEntries]       = useState([]);
  const [form, setForm]             = useState({ ...emptyEntry, date: today });
  const [editingId, setEditingId]   = useState(null);
  const [summary, setSummary]       = useState(null);


  // Helpers to load data
  const fetchEntries = async () => {
    const res = await axios.get(`${baseUrl}/`,{
      headers: { Authorization: `Bearer ${token}` }
    });
    setEntries(res.data);
  };
  const fetchSummary = async () => {
    const now = new Date();
    const params = { month: now.getMonth() + 1, year: now.getFullYear() };
    
    const res = await axios.get(`${baseUrl}/monthly`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setSummary(res.data);
  };
  

  useEffect(() => {
    fetchEntries();
    fetchSummary();
  }, []);

  // New: download full report from backend
  const downloadFullReport = async () => {
    const url = `${baseUrl}/generate-report`;
    console.log('Downloading P&L from:', url);
    try {
      const res = await axios.get(url, {
        responseType: 'blob',
        headers: { Accept: 'application/pdf',
        Authorization: `Bearer ${token}`

         }
      });
      console.log('Got blob:', res.data, res.headers['content-type']);
  
      // create a Blob URL
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'profit_loss_report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      // More detailed error logging:
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
      } else {
        console.error(err);
      }
      alert(
        err.response?.data?.message ||
        err.message ||
        'Failed to download report.'
      );
    }
  };
  
  // PDF generation
  const generatePDF = (entry) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Profit & Loss Entry', 14, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${entry.date.slice(0,10)}`, 14, 30);
    doc.text(`Description: ${entry.description}`, 14, 38);
    let y = 48;
    doc.text('Revenue:', 14, y);
    Object.entries(entry.revenue).forEach(([key, val]) => {
      y += 8;
      doc.text(`${key}: ${val}`, 20, y);
    });
    y += 10;
    doc.text('COGS:', 14, y);
    Object.entries(entry.cogs).forEach(([key, val]) => {
      y += 8;
      doc.text(`${key}: ${val}`, 20, y);
    });
    y += 10;
    doc.text('Expenses:', 14, y);
    Object.entries(entry.expenses).forEach(([key, val]) => {
      y += 8;
      doc.text(`${key}: ${val}`, 20, y);
    });
    y += 10;
    doc.text('Other:', 14, y);
    Object.entries(entry.other).forEach(([key, val]) => {
      y += 8;
      doc.text(`${key}: ${val}`, 20, y);
    });
    doc.save(`${entry.description.replace(/\s+/g, '_')}_${entry.date.slice(0,10)}.pdf`);
  };

  // Form handlers
  const handleChange = (section, field) => e => {
    const value = section
      ? { ...form[section], [field]: Number(e.target.value) }
      : e.target.value;
    setForm(prev => section
      ? ({ ...prev, [section]: value })
      : ({ ...prev, [field]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    if (!form.description.trim()) {
      alert('Please enter a description.');
      return;
    }
  
    if (form.date > today) {
      alert('Date cannot be in the future.');
      return;
    }
  
    const sections = ['revenue', 'cogs', 'expenses', 'other'];
    for (const section of sections) {
      for (const [_, val] of Object.entries(form[section])) {
        if (val < 0) {
          alert('Values cannot be negative.');
          return;
        }
      }
    }
  
    const payload = { ...form, date: form.date };
  
    const headers = { 
      Authorization: `Bearer ${token}` 
    };
  
    if (editingId) {
      await axios.put(`${baseUrl}/update/${editingId}`, payload, { headers });
    } else {
      await axios.post(`${baseUrl}/add`, payload, { headers });
    }
  
    setForm({ ...emptyEntry, date: today });
    setEditingId(null);
    await fetchEntries();
    await fetchSummary();
  };
  
  const startEdit = entry => {
    setEditingId(entry._id);
    setForm({ ...entry, date: entry.date.slice(0,10) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async id => {
    if (!confirm('Delete this entry?')) return;
  
    const headers = { 
      Authorization: `Bearer ${token}` 
    };
  
    try {
      await axios.delete(`${baseUrl}/delete/${id}`, { headers });
      await fetchEntries();
      await fetchSummary();
    } catch (err) {
      console.error('Error deleting entry:', err);
      alert('Failed to delete the entry.');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {summary && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <h2 className="text-xl font-semibold mb-2">Monthly Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Total Revenue" value={summary.totalRevenue} />
            <Stat label="Total COGS"    value={summary.totalCOGS} />
            <Stat label="Gross Profit"  value={summary.grossProfit} />
            <Stat label="Op. Expenses"  value={summary.totalOperatingExpenses} />
            <Stat label="Op. Profit"    value={summary.operatingProfit} />
            <Stat label="Other (Net)"   value={summary.netOther} />
            <Stat label="Net Profit"    value={summary.netProfit} highlight />
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-white shadow p-6 rounded space-y-4">
        <h2 className="text-2xl font-bold">{editingId ? 'Edit' : 'Add'} Profit & Loss Entry</h2>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Date</label>
            <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} required max={today} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div className="flex-2">
            <label className="block text-sm font-medium">Description</label>
            <input type="text" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="e.g. April services & sales" required className="mt-1 block w-full border rounded p-2" />
          </div>
        </div>
        <Section title="Revenue" section="revenue" data={form} onChange={handleChange} />
        <Section title="COGS" section="cogs" data={form} onChange={handleChange} />
        <Section title="Expenses" section="expenses" data={form} onChange={handleChange} />
        <Section title="Other" section="other" data={form} onChange={handleChange} />
        <button type="submit" className="w-full bg-green-600 text-white p-3 font-semibold rounded hover:bg-green-700">
          {editingId ? 'Update Entry' : 'Add Entry'}</button>
      </form>
      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">All Entries</h2>
        {entries.length===0 ? <p className="text-gray-500">No entries yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead><tr className="bg-gray-100"><th className="p-2">Date</th><th className="p-2">Desc</th><th className="p-2">Rev</th><th className="p-2">COGS</th><th className="p-2">Exp</th><th className="p-2">Other</th><th className="p-2">Actions</th></tr></thead>
              <tbody>
                {entries.map(e=>(
                  <tr key={e._id} className="text-center border-t">
                    <td className="p-2">{e.date.slice(0,10)}</td>
                    <td className="p-2">{e.description}</td>
                    <td className="p-2">{(e.revenue.serviceIncome+e.revenue.sparePartsSales+e.revenue.otherIncome).toLocaleString()}</td>
                    <td className="p-2">{(e.cogs.partsCost+e.cogs.materialsCost).toLocaleString()}</td>
                    <td className="p-2">{Object.values(e.expenses).reduce((a,b)=>a+b,0).toLocaleString()}</td>
                    <td className="p-2">{(e.other.interestIncome-e.other.interestExpense+e.other.misc).toLocaleString()}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={()=>startEdit(e)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Edit</button>
                      <button onClick={()=>handleDelete(e._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                      <button onClick={()=>downloadFullReport(e)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Download PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components
function Section({ title, section, data, onChange }) {
  return (<fieldset className="border p-4 rounded space-y-2"><legend className="font-semibold">{title}</legend><div className="grid grid-cols-2 gap-4">{Object.entries(data[section]).map(([key,val])=>(<div key={key}><label className="block text-sm">{key.replace(/([A-Z])/g,' $1')}</label><input type="number" step="any" min="0" value={val} onChange={onChange(section,key)} className="mt-1 block w-full border rounded p-2"/></div>))}</div></fieldset>);
}

function Stat({ label, value, highlight=false }) {
  return (<div className={`p-3 rounded ${highlight?'bg-green-100':'bg-white'} border`}><div className="text-sm text-gray-600">{label}</div><div className={`text-xl font-bold ${highlight?'text-green-800':'text-gray-800'}`}>LKR {value.toFixed(2).toLocaleString()}</div></div>);
}
