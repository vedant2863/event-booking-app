import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';

interface FormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const { data: res } = await authApi.login(data);
      setAuth(res.data!.user, res.data!.accessToken);
      toast.success('Welcome back!');
      navigate('/events');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8 animate-fade-up">
        <div className="text-center">
          <div className="inline-flex w-14 h-14 bg-brand-500 rounded-2xl items-center justify-center mb-4">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">Welcome back</h1>
          <p className="text-gray-400 mt-2">Sign in to your EventBook account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="input"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className="input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300">
              Sign up
            </Link>
          </p>
        </form>

        {/* Demo credentials */}
        <div className="card p-4 text-sm text-gray-400 space-y-1">
          <p className="text-gray-300 font-medium">Demo accounts:</p>
          <p>User: user@demo.com / password123</p>
          <p>Organizer: organizer@demo.com / password123</p>
          <p>Admin: admin@demo.com / password123</p>
        </div>
      </div>
    </div>
  );
};
