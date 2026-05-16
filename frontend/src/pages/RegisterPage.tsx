import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '../api/services';
import { useAuthStore } from '../store/authStore';

interface FormData {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'organizer';
}

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { role: 'user' },
  });
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const { data: res } = await authApi.register(data);
      setAuth(res.data!.user, res.data!.accessToken);
      toast.success('Account created!');
      navigate('/events');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8 animate-fade-up">
        <div className="text-center">
          <div className="inline-flex w-14 h-14 bg-brand-500 rounded-2xl items-center justify-center mb-4">
            <Ticket className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl text-white">Create account</h1>
          <p className="text-gray-400 mt-2">Join EventBook and start exploring</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              {...register('username', { required: 'Username is required', minLength: { value: 2, message: 'Min 2 characters' } })}
              className="input"
              placeholder="johndoe"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
          </div>

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
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              type="password"
              className="input"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">I want to</label>
            <select {...register('role')} className="input">
              <option value="user">Attend events (User)</option>
              <option value="organizer">Organize events (Organizer)</option>
            </select>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
