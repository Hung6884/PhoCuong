import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Calendar, Plus } from 'lucide-react'
import { reservationApi } from '../../api/client'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400',
  confirmed: 'bg-blue-900/30 text-blue-400',
  seated: 'bg-purple-900/30 text-purple-400',
  completed: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-red-900/30 text-red-400',
}
const statusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', seated: 'Đã được xếp chỗ',
  completed: 'Hoàn thành', cancelled: 'Đã hủy',
}

export default function CustomerReservations() {
  const qc = useQueryClient()
  const { data: reservations, isLoading } = useQuery({
    queryKey: ['my-reservations'],
    queryFn: () => reservationApi.getMy().then(r => r.data),
  })

  const handleCancel = async (id: number) => {
    if (!confirm('Bạn có chắc muốn hủy đặt bàn này?')) return
    try {
      await reservationApi.cancel(id)
      toast.success('Đã hủy đặt bàn')
      qc.invalidateQueries({ queryKey: ['my-reservations'] })
    } catch {
      toast.error('Không thể hủy')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-brand-gold text-3xl font-bold flex items-center gap-2">
            <Calendar size={24} /> Lịch đặt bàn
          </h1>
          <p className="text-brand-cream/50 text-sm mt-1">Theo dõi trạng thái đặt bàn của bạn</p>
        </div>
        <Link to="/booking" className="btn-gold gap-2">
          <Plus size={16} /> Đặt bàn mới
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({length: 3}).map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}</div>
      ) : (reservations || []).length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="text-brand-gold/30 mx-auto mb-4" size={48} />
          <p className="text-brand-cream/50 mb-4">Bạn chưa có đặt bàn nào</p>
          <Link to="/booking" className="btn-gold">Đặt bàn ngay</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {(reservations || []).map((r: any) => (
            <div key={r.ID} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-serif text-brand-gold font-semibold">
                      {new Date(r.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className={`badge ${statusColors[r.status]}`}>{statusLabels[r.status]}</span>
                  </div>
                  <div className="text-brand-cream/60 text-sm space-y-1">
                    <div>Giờ: <span className="text-brand-cream/80">{r.time_slot}</span> · Số khách: <span className="text-brand-cream/80">{r.guests}</span></div>
                    {r.note && <div>Ghi chú: <span className="text-brand-cream/70">{r.note}</span></div>}
                    {r.staff_note && <div className="text-blue-400">Nhân viên: {r.staff_note}</div>}
                  </div>
                </div>
                {(r.status === 'pending' || r.status === 'confirmed') && (
                  <button onClick={() => handleCancel(r.ID)} className="text-red-400 hover:text-red-300 text-sm border border-red-400/30 px-3 py-1 rounded transition-colors">
                    Hủy
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
