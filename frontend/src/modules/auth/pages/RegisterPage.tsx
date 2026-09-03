import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';

interface FormData {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'organizer';
}

export const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { role: 'user' },
  });
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const { data: res } = await authApi.register(data);
      setAuth(res.data!.user, res.data!.accessToken);
      toast.success('Welcome to BookMyShow! Your account is ready.');
      navigate('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
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
          <h1 className="text-2xl font-extrabold text-white">Create Your Account</h1>
          <p className="text-xs text-gray-400">
            Join millions of movie lovers & entertainment fans
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Full Name / Username
            </label>
            <input
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 2, message: 'Min 2 characters' },
              })}
              className="input"
              placeholder="Vedant Patil"
            />
            {errors.username && (
              <p className="text-[#f84464] text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="input"
              placeholder="vedant@example.com"
            />
            {errors.email && <p className="text-[#f84464] text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Min 6 characters' },
              })}
              type="password"
              className="input"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-[#f84464] text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Account Role</label>
            <select {...register('role')} className="input">
              <option value="user">Movie & Event Lover (User)</option>
              <option value="organizer">Cinema / Event Organizer (Organizer)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f84464] hover:bg-[#e03050] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-rose-950/40 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-gray-400 pt-2">
            Already have a BookMyShow account?{' '}
            <Link to="/login" className="text-[#f84464] hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
