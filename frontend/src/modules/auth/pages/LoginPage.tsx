import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const { data: res } = await authApi.login(data);
      setAuth(res.data!.user, res.data!.accessToken);
      toast.success('Welcome back to BookMyShow!');
      navigate('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillDemo = (email: string) => {
    setValue('email', email);
    setValue('password', 'password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* BookMyShow Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-3xl font-black tracking-tight text-white mb-2">
            <span>book</span>
            <span className="bg-[#f84464] text-white px-2 py-0.5 rounded text-lg font-black uppercase">
              my{' '}
            </span>
            <span>show</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Sign In to Your Account</h1>
          <p className="text-xs text-gray-400">
            Unlock personalized offers, M-Tickets & fast checkout
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="input"
              placeholder="user@demo.com"
            />
            {errors.email && <p className="text-[#f84464] text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              className="input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-[#f84464] text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f84464] hover:bg-[#e03050] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-xs text-gray-400 pt-2">
            Don't have a BookMyShow account?{' '}
            <Link to="/register" className="text-[#f84464] hover:underline font-bold">
              Sign Up
            </Link>
          </p>
        </form>

        {/* Quick Demo Login Badges */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 text-xs space-y-2">
          <p className="text-gray-300 font-bold">🚀 Quick Demo Logins (Click to autofill):</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fillDemo('user@demo.com')}
              className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-[11px] font-medium transition-colors"
            >
              👤 User (user@demo.com)
            </button>
            <button
              onClick={() => fillDemo('organizer@demo.com')}
              className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-[11px] font-medium transition-colors"
            >
              🎭 Organizer (organizer@demo.com)
            </button>
            <button
              onClick={() => fillDemo('admin@demo.com')}
              className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-[11px] font-medium transition-colors"
            >
              🛡️ Admin (admin@demo.com)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
