import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import AuthLayout from './AuthLayout';
import FormInput from './FormInput';
import FormError from './FormError';
import AuthButton from './AuthButton';
import AuthDivider from './AuthDivider';

interface SignUpValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const { values, errors, loading, handleChange, handleSubmit } = useForm<SignUpValues>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      await signUp(values.email, values.password, values.fullName);
      navigate('/dashboard');
    },
  });

  return (
    <AuthLayout 
      title="HEVA BJJ" 
      subtitle="Create your account"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormError error={errors.form} />

        <FormInput
          id="fullName"
          name="fullName"
          type="text"
          label="Full name"
          value={values.fullName}
          onChange={handleChange}
          icon={User}
          autoComplete="name"
        />

        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          value={values.email}
          onChange={handleChange}
          icon={Mail}
          autoComplete="email"
        />

        <FormInput
          id="password"
          name="password"
          type="password"
          label="Password"
          value={values.password}
          onChange={handleChange}
          icon={Lock}
          autoComplete="new-password"
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm password"
          value={values.confirmPassword}
          onChange={handleChange}
          icon={Lock}
          autoComplete="new-password"
        />

        <AuthButton type="submit" loading={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </AuthButton>
      </form>

      <div className="mt-6">
        <AuthDivider text="Already have an account?" />
        <div className="mt-6">
          <AuthButton
            variant="secondary"
            onClick={() => navigate('/signin')}
            disabled={loading}
          >
            Sign in
          </AuthButton>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpForm;