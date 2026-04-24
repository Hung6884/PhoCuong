import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ShoppingBag, RefreshCw } from 'lucide-react'
import { orderApi } from '../../api/client'

const statusOptions = [
  { value: 'pending', label: 'Chờ xử lý', color: 'text-yellow-400' },
  { value: 'preparing', label: 'Đang chuẩn bị', color: 'text-orange-400' },
  { value: 'ready', label: 'Sẵn sàng', color: 'text-cyan-400' },
  { value: 'delivered', label: 'Đã giao', color: 'text-green-400' },
  { value: 'cancelled', label: 'Đã hủy', color: 'text-red-400' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400',
  preparing: 'bg-orange-900/30 text-orange-400',
  ready: 'bg-cyan-900/30 text-cyan-400',
  delivered: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-red-900/30 text-red-400',
}

export default function StaffOrders() {
  const [filter, setFilter] = useState('pending')
  const qc = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['all-orders', filter],
    queryFn: () => orderApi.getAll({ status: filter || undefined }).then(r => r.data),
    refetchInterval: 15000,
  })

  const updateStatus = async (id: number, status: string) => {
    try {
      await orderApi.updateStatus(id, { status })
      toast.success('Đã cập nhật trạng thái')
      qc.invalidateQueries({ queryKey: ['all-orders'] })
    } catch {
      toast.error('Không thể cập nhật')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-brand-gold text-3xl font-bold flex items-center gap-2">
          <ShoppingBag size={24} /> Đơn hàng
        </h1>
        <button onClick={() => qc.invalidateQueries({ queryKey: ['all-orders'] })} className="btn-outline gap-2 text-sm py-2">
          <RefreshCw size={14} /> Làm mới
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('')} className={`px-4 py-1.5 rounded-full text-sm border transition-all ${filter === '' ? 'bg-brand-gold text-brand-brown border-brand-gold' : 'border-brand-gold/30 text-brand-cream/60 hover:border-brand-gold'}`}>
          Tất cả
        </button>
        {statusOptions.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${filter === s.value ? 'bg-brand-gold text-brand-brown border-brand-gold' : 'border-brand-gold/30 text-brand-cream/60 hover:border-brand-gold'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-28 animate-pulse" />)}</div>
      ) : (orders || []).length === 0 ? (
        <div className="card p-12 text-center text-brand-cream/40">Không có đơn hàng nào</div>
      ) : (
        <div className="space-y-4">
          {(orders || []).map((order: any) => (
            <div key={order.ID} className="card p-5">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <div className="font-serif text-brand-gold font-semibold text-lg">Đơn #{order.ID}</div>
                  <div className="text-brand-cream/60 text-sm">
                    Khách: <span className="text-brand-cream/80">{order.customer?.name}</span>
                    {order.table_number && <span> · Bàn {order.table_number}</span>}
                    <span className="ml-2 text-brand-cream/40">{new Date(order.CreatedAt).toLocaleTimeString('vi-VN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${statusColors[order.status]}`}>
                    {statusOptions.find(s => s.value === order.status)?.label}
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                {order.items?.map((item: any) => (
                  <div key={item.ID} className="flex justify-between text-sm">
                    <span className="text-brand-cream/70">{item.menu_item?.name} × {item.quantity}</span>
                    <span className="text-brand-cream/60">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2 border-t border-brand-gold/10">
                  <span className="text-brand-cream/80">Tổng cộng</span>
                  <span className="text-brand-gold">{order.total_amount?.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Status actions */}
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="flex flex-wrap gap-2">
                  {statusOptions
                    .filter(s => s.value !== order.status && s.value !== 'pending')
                    .slice(0, 3)
                    .map(s => (
                      <button
                        key={s.value}
                        onClick={() => updateStatus(order.ID, s.value)}
                        className="text-xs px-3 py-1.5 border border-brand-gold/30 text-brand-cream/60 hover:border-brand-gold hover:text-brand-gold rounded transition-colors"
                      >
                        → {s.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
