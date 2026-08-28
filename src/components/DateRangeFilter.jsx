import React from 'react';
import { Calendar, X } from 'lucide-react';

const toDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRange = (preset) => {
  const today = new Date();
  const start = new Date(today);

  if (preset === 'today') {
    return { startDate: toDateInput(today), endDate: toDateInput(today) };
  }
  if (preset === 'yesterday') {
    start.setDate(today.getDate() - 1);
    return { startDate: toDateInput(start), endDate: toDateInput(start) };
  }
  if (preset === 'week') {
    const day = today.getDay();
    start.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  } else if (preset === 'month') {
    start.setDate(1);
  } else if (preset === 'year') {
    start.setMonth(0, 1);
  }

  return { startDate: toDateInput(start), endDate: toDateInput(today) };
};

export const defaultDateRange = {
  preset: 'month',
  ...getRange('month')
};

export default function DateRangeFilter({ value, onChange }) {
  const presets = [
    ['today', 'Today'],
    ['yesterday', 'Yesterday'],
    ['week', 'This Week'],
    ['month', 'This Month'],
    ['year', 'This Year']
  ];

  const applyPreset = (preset) => {
    onChange({ preset, ...getRange(preset) });
  };

  const updateCustomDate = (key, date) => {
    onChange({ ...value, preset: 'custom', [key]: date });
  };

  return (
    <div className="date-range-filter">
      <div className="date-preset-list">
        <Calendar size={15} color="#94a3b8" />
        {presets.map(([preset, label]) => (
          <button
            key={preset}
            type="button"
            className={`date-preset ${value.preset === preset ? 'active' : ''}`}
            onClick={() => applyPreset(preset)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className={`date-preset ${value.preset === 'custom' ? 'active' : ''}`}
          onClick={() => onChange({ ...value, preset: 'custom' })}
        >
          Custom
        </button>
      </div>

      <div className="custom-date-fields">
        <input
          type="date"
          className="date-input"
          value={value.startDate}
          onChange={(event) => updateCustomDate('startDate', event.target.value)}
          aria-label="Start date"
        />
        <span>to</span>
        <input
          type="date"
          className="date-input"
          value={value.endDate}
          onChange={(event) => updateCustomDate('endDate', event.target.value)}
          aria-label="End date"
        />
        <button
          type="button"
          className="btn-icon"
          onClick={() => onChange({ preset: 'all', startDate: '', endDate: '' })}
          title="Show all dates"
          aria-label="Clear date filter"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}