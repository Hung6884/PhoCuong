import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Calendar, RefreshCw } from 'lucide-react'
import { reservationApi } from '../../api/client'

const statusOptions = [
  { value: 'pending', label: 'Chờ xác nhận', color: 'bg-yellow-900/30 text-yellow-400' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-900/30 text-blue-400' },
  { value: 'seated', label: 'Đã xếp chỗ', color: 'bg-purple-900/30 text-purple-400' },
  { value: 'completed', label: 'Hoàn thành', color: 'bg-green-900/30 text-green-400' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-900/30 text-red-400' },
]

export default function StaffReservations() {
  const [filter, setFilter] = useState('pending')
  const [editing, setEditing] = useState<any>(null)
  const qc = useQueryClient()
  const { register, handleSubmit, reset } = useForm()

  const { data: reservations, isLoading } = useQuery({
    queryKey: ['all-reservations', filter],
    queryFn: () => reservationApi.getAll({ status: filter || undefined }).then(r => r.data),
    refetchInterval: 20000,
  })

  const onUpdate = async (data: any) => {
    try {
      await reservationApi.updateStatus(editing.ID, data)
      toast.success('Đã cập nhật')
      setEditing(null)
      reset()
      qc.invalidateQueries({ queryKey: ['all-reservations'] })
    } catch {
      toast.error('Không thể cập nhật')
    }
  }

  const getStatusColor = (s: string) => statusOptions.find(o => o.value === s)?.color || ''
  const getStatusLabel = (s: string) => statusOptions.find(o => o.value === s)?.label || s

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-brand-gold text-3xl font-bold flex items-center gap-2">
          <Calendar size={24} /> Quản lý đặt bàn
        </h1>
        <button onClick={() => qc.invalidateQueries({ queryKey: ['all-reservations'] })} className="btn-outline gap-2 text-sm py-2">
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('')} className={`px-4 py-1.5 rounded-full text-sm border transition-all ${filter === '' ? 'bg-brand-gold text-brand-brown border-brand-gold' : 'border-brand-gold/30 text-brand-cream/60'}`}>Tất cả</button>
        {statusOptions.map(s => (
          <button key={s.value} onClick={() => setFilter(s.value)} className={`px-4 py-1.5 rounded-full text-sm border transition-all ${filter === s.value ? 'bg-brand-gold text-brand-brown border-brand-gold' : 'border-brand-gold/30 text-brand-cream/60'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}</div>
      ) : (reservations || []).length === 0 ? (
        <div className="card p-12 text-center text-brand-cream/40">Không có đặt bàn nào</div>
      ) : (
        <div className="space-y-3">
          {(reservations || []).map((r: any) => (
            <div key={r.ID} className="card p-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-serif text-brand-gold font-semibold">
                      {new Date(r.date).toLocaleDateString('vi-VN')} · {r.time_slot}
                    </span>
                    <span className={`badge ${getStatusColor(r.status)}`}>{getStatusLabel(r.status)}</span>
                  </div>
                  <div className="text-brand-cream/60 text-sm">
                    <span className="text-brand-cream/80">{r.customer?.name}</span> · {r.guests} khách
                    {r.note && <span> · <span className="italic">{r.note}</span></span>}
                  </div>
                  {r.staff_note && <div className="text-blue-400 text-sm mt-1">Ghi chú NV: {r.staff_note}</div>}
                </div>
                <button
                  onClick={() => { setEditing(r); reset({ status: r.status, staff_note: r.staff_note }) }}
                  className="text-sm btn-outline py-1.5 px-3"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-brand-gold font-semibold text-xl mb-4">
              Cập nhật đặt bàn #{editing.ID}
            </h3>
            <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
              <div>
                <label className="label">Trạng thái</label>
                <select className="input-field" {...register('status', { required: true })}>
                  {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Ghi chú nhân viên</label>
                <textarea rows={2} className="input-field resize-none" placeholder="Ghi chú..." {...register('staff_note')} />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-gold flex-1 justify-center">Lưu</button>
                <button type="button" onClick={() => setEditing(null)} className="btn-outline flex-1 justify-center">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
