import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const initialFormState = {
  assets: {
    currentAssets: {
      cashBankBalances: '',
      accountsReceivable: '',
      inventory: '',
      prepaidExpenses: ''
    },
    nonCurrentAssets: {
      propertyPlantEquipment: '',
      machineryTools: '',
      vehicles: '',
      intangibleAssets: ''
    }
  },
  liabilities: {
    currentLiabilities: {
      accountsPayable: '',
      shortTermLoans: '',
      taxesPayable: '',
      wagesPayable: ''
    },
    nonCurrentLiabilities: {
      longTermLoans: '',
      leaseObligations: '',
      deferredTaxLiabilities: ''
    }
  },
  equity: {
    ownersCapital: '',
    retainedEarnings: '',
    shareholderContributions: ''
  },
  description: '',
  date: new Date(),
};

// ... imports and initialFormState remain the same

const BalanceSheetForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (section, category, field, value) => {
    const numericValue = value === '' ? '' : Number(value);

    // Update form data
    setFormData(prev => ({
      ...prev,
      [section]: category ? {
        ...prev[section],
        [category]: {
          ...prev[section][category],
          [field]: numericValue
        }
      } : {
        ...prev[section],
        [field]: numericValue
      }
    }));

    // Clear error if valid
    if (!isNaN(numericValue) && numericValue >= 0) {
      setErrors(prev => ({ ...prev, [`${section}.${category || ''}.${field}`]: '' }));
    } else {
      setErrors(prev => ({ ...prev, [`${section}.${category || ''}.${field}`]: 'Please enter a valid non-negative number' }));
    }
  };

  const handleTextChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (value.trim()) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateAllFields = () => {
    const newErrors = {};

    const validateGroup = (section, categoryObj, sectionKey) => {
      Object.entries(categoryObj).forEach(([key, val]) => {
        if (val === '' || isNaN(val) || val < 0) {
          newErrors[`${sectionKey}.${key}`] = 'Please enter a valid non-negative number';
        }
      });
    };

    validateGroup('assets.currentAssets', formData.assets.currentAssets, 'assets.currentAssets');
    validateGroup('assets.nonCurrentAssets', formData.assets.nonCurrentAssets, 'assets.nonCurrentAssets');
    validateGroup('liabilities.currentLiabilities', formData.liabilities.currentLiabilities, 'liabilities.currentLiabilities');
    validateGroup('liabilities.nonCurrentLiabilities', formData.liabilities.nonCurrentLiabilities, 'liabilities.nonCurrentLiabilities');
    validateGroup('equity', formData.equity, 'equity');

    if (!formData.description.trim()) {
      newErrors['description'] = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatLabel = (key) =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      alert('Please correct the highlighted errors before submitting.');
      return;
    }

    const parseToNumber = (obj) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === '' ? 0 : Number(v)]));

    const dataToSend = {
      ...formData,
      assets: {
        currentAssets: parseToNumber(formData.assets.currentAssets),
        nonCurrentAssets: parseToNumber(formData.assets.nonCurrentAssets),
      },
      liabilities: {
        currentLiabilities: parseToNumber(formData.liabilities.currentLiabilities),
        nonCurrentLiabilities: parseToNumber(formData.liabilities.nonCurrentLiabilities),
      },
      equity: parseToNumber(formData.equity),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/api/balance-sheet/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error(await response.text() || 'Submission failed');

      alert('Balance sheet submitted successfully!');
      setFormData(initialFormState);
      setErrors({});
    } catch (err) {
      console.error('Error submitting balance sheet:', err);
      alert('Failed to submit balance sheet');
    }
  };

  const renderInput = (section, category, key, value) => {
    const errorKey = `${section}.${category || ''}.${key}`;
    return (
      <div key={key} className="grid grid-cols-12 gap-4 items-center">
        <label className="col-span-5">{formatLabel(key)}</label>
        <div className="col-span-5">
          <input
            type="number"
            step="any"
            value={value}
            onChange={(e) => handleChange(section, category, key, e.target.value)}
            className={`w-full p-2 border rounded ${errors[errorKey] ? 'border-red-500' : ''}`}
            min="0"
          />
          {errors[errorKey] && (
            <p className="text-red-500 text-sm mt-1">{errors[errorKey]}</p>
          )}
        </div>
      </div>
    );
  };

  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">Balance Sheet Entry</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : ''}`}
            value={formData.description}
            onChange={(e) => handleTextChange('description', e.target.value)}
            required
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <DatePicker
            selected={formData.date}
            onChange={(date) => handleTextChange('date', date)}
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 border rounded"
            minDate={oneMonthAgo}
            maxDate={today}
            required
          />
        </div>

        {/* Render sections with validation */}
        <Section title="Assets" group={formData.assets} section="assets" renderInput={renderInput} />
        <Section title="Liabilities" group={formData.liabilities} section="liabilities" renderInput={renderInput} />
        <Section title="Equity" group={formData.equity} section="equity" renderInput={renderInput} isFlat />

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Balance Sheet
        </button>
      </form>
    </div>
  );
};

// Helper to render asset/liability/equity sections
const Section = ({ title, group, section, renderInput, isFlat = false }) => (
  <div className="border rounded-md p-4">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    {isFlat ? (
      <div className="space-y-3">
        {Object.entries(group).map(([key, value]) => renderInput(section, null, key, value))}
      </div>
    ) : (
      Object.entries(group).map(([subsection, fields]) => (
        <div key={subsection} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {subsection.includes("current") ? "Current" : "Non-Current"} {title.slice(0, -1)}
          </h3>
          <div className="space-y-3">
            {Object.entries(fields).map(([key, value]) =>
              renderInput(section, subsection, key, value)
            )}
          </div>
        </div>
      ))
    )}
  </div>
);

export default BalanceSheetForm;
