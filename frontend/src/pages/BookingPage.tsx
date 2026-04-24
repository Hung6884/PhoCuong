import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Calendar, Clock, Users, MessageSquare } from 'lucide-react'
import { reservationApi } from '../api/client'
import { useAuth } from '../contexts/AuthContext'

const timeSlots = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
]

export default function BookingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{
    date: string; time_slot: string; guests: number; note: string
  }>({
    defaultValues: { guests: 2, note: '' },
  })

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt bàn')
      navigate('/login')
      return
    }
    try {
      await reservationApi.create(data)
      toast.success('Đặt bàn thành công! Chúng tôi sẽ liên hệ xác nhận sớm.')
      navigate('/customer/reservations')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Không thể đặt bàn, vui lòng thử lại')
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="section-subtitle">Dễ dàng và nhanh chóng</div>
          <h1 className="section-title">Đặt Bàn</h1>
          <div className="gold-divider max-w-xs mx-auto mt-4">✦</div>
          <p className="text-brand-cream/60 mt-4 text-sm">
            Đặt bàn trực tuyến 24/7. Chúng tôi sẽ xác nhận qua điện thoại trong vòng 30 phút.
          </p>
        </div>

        <div className="card p-8">
          {!user && (
            <div className="mb-6 p-4 border border-brand-gold/30 rounded-lg bg-brand-gold/5 text-center">
              <p className="text-brand-cream/70 text-sm mb-3">Đăng nhập để đặt bàn và theo dõi lịch đặt của bạn</p>
              <button onClick={() => navigate('/login')} className="btn-gold text-sm py-1.5 px-4">Đăng nhập</button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-2">
                  <Calendar size={14} /> Ngày
                </label>
                <input
                  type="date"
                  min={today}
                  className="input-field"
                  {...register('date', { required: 'Chọn ngày đặt bàn' })}
                />
                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message as string}</p>}
              </div>

              <div>
                <label className="label flex items-center gap-2">
                  <Clock size={14} /> Giờ
                </label>
                <select
                  className="input-field"
                  {...register('time_slot', { required: 'Chọn giờ đặt bàn' })}
                >
                  <option value="">-- Chọn giờ --</option>
                  <optgroup label="Buổi sáng (6:00 - 14:00)">
                    {timeSlots.filter(t => t < '14:00').map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                  <optgroup label="Buổi tối (17:00 - 21:00)">
                    {timeSlots.filter(t => t >= '17:00').map(t => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                </select>
                {errors.time_slot && <p className="text-red-400 text-xs mt-1">{errors.time_slot.message as string}</p>}
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Users size={14} /> Số khách
              </label>
              <input
                type="number"
                min="1"
                max="20"
                className="input-field"
                {...register('guests', { required: true, min: 1, max: 20, valueAsNumber: true })}
              />
              {errors.guests && <p className="text-red-400 text-xs mt-1">Số khách từ 1-20 người</p>}
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <MessageSquare size={14} /> Ghi chú (không bắt buộc)
              </label>
              <textarea
                rows={3}
                placeholder="Yêu cầu đặc biệt, dịp kỷ niệm, dị ứng thức ăn..."
                className="input-field resize-none"
                {...register('note')}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !user}
              className="btn-gold w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang đặt bàn...' : 'Xác nhận đặt bàn'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-gold/10 text-center">
            <p className="text-brand-cream/40 text-xs">
              Cần hỗ trợ? Gọi ngay <a href="tel:02438268866" className="text-brand-gold">024 3826 8866</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
