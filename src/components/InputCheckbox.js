import React from 'react';

function InputCheckbox({ id, label, isActive, onChange }) {
  return (
    <div className="input-item">
      <input
        type="checkbox"
        id={id}
        checked={isActive}
        onChange={() => onChange(id)}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default InputCheckbox;