import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Star, CheckCircle } from 'lucide-react'
import { reviewApi } from '../../api/client'

export default function AdminReviews() {
  const qc = useQueryClient()
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => reviewApi.getAllAdmin().then(r => r.data),
  })

  const handleApprove = async (id: number) => {
    try {
      await reviewApi.approve(id)
      toast.success('Đã duyệt đánh giá')
      qc.invalidateQueries({ queryKey: ['admin-reviews'] })
    } catch { toast.error('Lỗi') }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-serif text-brand-gold text-3xl font-bold flex items-center gap-2 mb-8">
        <Star size={24} /> Quản lý đánh giá
      </h1>

      {isLoading ? (
        <div className="space-y-4">{Array.from({length: 3}).map((_, i) => <div key={i} className="card h-24 animate-pulse" />)}</div>
      ) : (reviews || []).length === 0 ? (
        <div className="card p-12 text-center text-brand-cream/40">Chưa có đánh giá nào</div>
      ) : (
        <div className="space-y-4">
          {(reviews || []).map((r: any) => (
            <div key={r.ID} className={`card p-5 ${!r.approved ? 'border-yellow-500/30' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="font-medium text-brand-cream/90">{r.customer?.name}</div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < r.rating ? 'text-brand-gold fill-brand-gold' : 'text-brand-cream/20'} />
                      ))}
                    </div>
                    {!r.approved && <span className="badge bg-yellow-900/30 text-yellow-400">Chờ duyệt</span>}
                    {r.approved && <span className="badge bg-green-900/30 text-green-400">Đã duyệt</span>}
                  </div>
                  <p className="text-brand-cream/60 text-sm italic">"{r.comment}"</p>
                  <p className="text-brand-cream/30 text-xs mt-2">{new Date(r.CreatedAt).toLocaleDateString('vi-VN')}</p>
                </div>
                {!r.approved && (
                  <button onClick={() => handleApprove(r.ID)} className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm border border-green-400/30 px-3 py-1 rounded transition-colors ml-4 shrink-0">
                    <CheckCircle size={14} /> Duyệt
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
