import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  autoComplete?: string;
  required?: boolean;
}

const FormInput = ({
  id,
  name,
  type,
  label,
  value,
  onChange,
  icon: Icon,
  autoComplete,
  required = true,
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Icon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
      </div>
    </div>
  );
};

export default FormInput;