import React from 'react';

export interface FilterSelectProps {
  label?: string; // optional label displayed before select
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
  ariaLabel?: string; // accessibility label when visual label omitted
  size?: 'sm' | 'md';
}

// Unified styling for admin filter selects
const baseSel = 'border rounded bg-white border-[var(--rose-200)] focus:outline-none';
const sizeMap = {
  sm: 'text-[11px] px-2 py-1',
  md: 'text-[12px] px-2.5 py-1.5'
};

const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, options, onChange, className='', ariaLabel, size='sm' }) => {
  const id = React.useId();
  return (
    <label className={`flex items-center gap-1 ${size==='sm'?'text-[11px]':'text-[12px]'} ${className}`}> 
      {label && <span className="font-medium">{label}</span>}
      <select
        id={id}
        aria-label={ariaLabel||label}
        value={value}
        onChange={e=>onChange(e.target.value)}
        className={`${baseSel} ${sizeMap[size]}`}
      >
        {options.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
};

export default FilterSelect;
