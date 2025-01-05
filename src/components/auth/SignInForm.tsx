import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import AuthLayout from './AuthLayout';
import FormInput from './FormInput';
import FormError from './FormError';
import AuthButton from './AuthButton';
import AuthDivider from './AuthDivider';

interface SignInValues {
  email: string;
  password: string;
}

const SignInForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const { values, errors, loading, handleChange, handleSubmit } = useForm<SignInValues>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      await signIn(values.email, values.password);
      navigate('/dashboard');
    },
  });

  return (
    <AuthLayout 
      title="HEVA BJJ" 
      subtitle="Sign in to your account"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <FormError error={errors.form} />

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
          autoComplete="current-password"
        />

        <AuthButton type="submit" loading={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </AuthButton>
      </form>

      <div className="mt-6">
        <AuthDivider text="Don't have an account?" />
        <div className="mt-6">
          <AuthButton
            variant="secondary"
            onClick={() => navigate('/signup')}
            disabled={loading}
          >
            Sign up
          </AuthButton>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignInForm;