import React from 'react';

interface FormErrorProps {
  error?: string;
}

const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
      {error}
    </div>
  );
};

export default FormError;