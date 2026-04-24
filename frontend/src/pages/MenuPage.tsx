import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ShoppingBag } from 'lucide-react'
import { menuApi } from '../api/client'
import { Link } from 'react-router-dom'

const categories = [
  { value: '', label: 'Tất cả' },
  { value: 'pho', label: 'Phở' },
  { value: 'com_tam', label: 'Cơm tấm' },
  { value: 'drink', label: 'Đồ uống' },
  { value: 'topping', label: 'Thêm vào' },
]

function formatPrice(p: number) {
  return p.toLocaleString('vi-VN') + 'đ'
}

export default function MenuPage() {
  const [cat, setCat] = useState('')

  const { data: items, isLoading } = useQuery({
    queryKey: ['menu', cat],
    queryFn: () => menuApi.getAll({ category: cat || undefined, available: true }).then(r => r.data),
  })

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-subtitle">Nhà hàng Phở Cường</div>
          <h1 className="section-title">Thực Đơn</h1>
          <div className="gold-divider max-w-xs mx-auto mt-4 mb-6">✦</div>
          <p className="text-brand-cream/60 max-w-xl mx-auto text-sm">
            Tất cả món ăn được chế biến từ nguyên liệu tươi ngon, chọn lọc mỗi ngày
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                cat === c.value
                  ? 'bg-brand-gold text-brand-brown border-brand-gold'
                  : 'border-brand-gold/30 text-brand-cream/60 hover:border-brand-gold hover:text-brand-gold'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Items */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(items || []).map((item: any) => (
              <div key={item.ID} className="card group hover:border-brand-gold/40 transition-all duration-300 flex flex-col">
                {item.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-brand-gold font-semibold text-lg">{item.name}</h3>
                    <span className="text-brand-cream font-bold text-lg ml-2 shrink-0">{formatPrice(item.price)}</span>
                  </div>
                  {item.description && (
                    <p className="text-brand-cream/50 text-sm flex-1">{item.description}</p>
                  )}
                  {!item.available && (
                    <div className="mt-3 text-xs text-brand-red-light font-medium">Tạm hết</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {items?.length === 0 && (
          <div className="text-center text-brand-cream/50 py-20">Không có món nào trong danh mục này</div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center p-8 card border-brand-gold/30">
          <ShoppingBag className="text-brand-gold mx-auto mb-4" size={32} />
          <h3 className="font-serif text-brand-gold text-2xl mb-2">Đặt bàn hoặc gọi món</h3>
          <p className="text-brand-cream/60 mb-6">Đặt bàn trước để được phục vụ tốt nhất, hoặc đến trực tiếp nhà hàng</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/booking" className="btn-gold">Đặt bàn ngay</Link>
            <a href="tel:02438268866" className="btn-outline">Gọi 024 3826 8866</a>
          </div>
        </div>
      </div>
    </div>
  )
}
