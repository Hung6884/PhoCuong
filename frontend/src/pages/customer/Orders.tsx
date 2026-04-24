import { useQuery } from '@tanstack/react-query'
import { ShoppingBag } from 'lucide-react'
import { orderApi } from '../../api/client'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-900/30 text-yellow-400',
  preparing: 'bg-orange-900/30 text-orange-400',
  ready: 'bg-cyan-900/30 text-cyan-400',
  delivered: 'bg-green-900/30 text-green-400',
  cancelled: 'bg-red-900/30 text-red-400',
}
const statusLabels: Record<string, string> = {
  pending: 'Chờ xử lý', preparing: 'Đang chuẩn bị', ready: 'Sẵn sàng', delivered: 'Đã giao', cancelled: 'Đã hủy',
}

export default function CustomerOrders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderApi.getMy().then(r => r.data),
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-brand-gold text-3xl font-bold flex items-center gap-2 mb-8">
        <ShoppingBag size={24} /> Đơn hàng của tôi
      </h1>

      {isLoading ? (
        <div className="space-y-4">{Array.from({length: 3}).map((_, i) => <div key={i} className="card h-32 animate-pulse" />)}</div>
      ) : (orders || []).length === 0 ? (
        <div className="card p-12 text-center">
          <ShoppingBag className="text-brand-gold/30 mx-auto mb-4" size={48} />
          <p className="text-brand-cream/50">Bạn chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(orders || []).map((order: any) => (
            <div key={order.ID} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-serif text-brand-gold font-semibold">Đơn hàng #{order.ID}</span>
                  {order.table_number && <span className="text-brand-cream/50 text-sm ml-2">· Bàn {order.table_number}</span>}
                </div>
                <span className={`badge ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
              </div>
              <div className="space-y-2 mb-3">
                {order.items?.map((item: any) => (
                  <div key={item.ID} className="flex items-center justify-between text-sm">
                    <span className="text-brand-cream/70">{item.menu_item?.name} × {item.quantity}</span>
                    <span className="text-brand-cream/60">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-brand-gold/10">
                <span className="text-brand-cream/50 text-xs">
                  {new Date(order.CreatedAt).toLocaleString('vi-VN')}
                </span>
                <span className="text-brand-gold font-bold">{order.total_amount?.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
