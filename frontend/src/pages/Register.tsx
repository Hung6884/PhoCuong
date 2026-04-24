import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api/client'

export default function Register() {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<{
    name: string; email: string; phone: string; password: string; confirm: string
  }>()

  const onSubmit = async (data: any) => {
    try {
      const res = await authApi.register({ name: data.name, email: data.email, phone: data.phone, password: data.password })
      localStorage.setItem('token', res.data.token)
      toast.success('Đăng ký thành công! Chào mừng bạn đến Phở Cường.')
      navigate('/customer')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Đăng ký thất bại')
    }
  }

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-serif text-brand-gold text-4xl font-bold mb-2">Phở Cường</div>
          <div className="section-subtitle">Tạo tài khoản mới</div>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Họ và tên</label>
              <input className="input-field" placeholder="Nguyễn Văn A" {...register('name', { required: 'Nhập tên của bạn' })} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <input type="email" className="input-field" placeholder="email@example.com" {...register('email', { required: 'Nhập email', pattern: { value: /\S+@\S+\.\S+/, message: 'Email không hợp lệ' } })} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Số điện thoại</label>
              <input type="tel" className="input-field" placeholder="0912 345 678" {...register('phone')} />
            </div>

            <div>
              <label className="label">Mật khẩu</label>
              <input type="password" className="input-field" placeholder="Tối thiểu 6 ký tự" {...register('password', { required: 'Nhập mật khẩu', minLength: { value: 6, message: 'Tối thiểu 6 ký tự' } })} />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Xác nhận mật khẩu</label>
              <input type="password" className="input-field" placeholder="Nhập lại mật khẩu" {...register('confirm', { validate: v => v === watch('password') || 'Mật khẩu không khớp' })} />
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center py-3 text-base disabled:opacity-50 mt-2">
              {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>

          <p className="text-brand-cream/50 text-sm text-center mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-brand-gold hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
