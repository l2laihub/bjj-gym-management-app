import { useState, ChangeEvent, FormEvent } from 'react';

interface FormConfig<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
}

export function useForm<T>({ initialValues, onSubmit }: FormConfig<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof T]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ form: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    errors,
    loading,
    handleChange,
    handleSubmit,
  };
}