import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Trash2, ImageIcon } from 'lucide-react'
import { galleryApi } from '../../api/client'

const categories = [
  { value: 'food', label: 'Ẩm thực' },
  { value: 'restaurant', label: 'Không gian' },
  { value: 'event', label: 'Sự kiện' },
]

export default function AdminGallery() {
  const [modal, setModal] = useState(false)
  const qc = useQueryClient()

  const { data: items, isLoading } = useQuery({
    queryKey: ['gallery-admin'],
    queryFn: () => galleryApi.getAll().then(r => r.data),
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  const onSubmit = async (data: any) => {
    try {
      await galleryApi.create({ ...data, sort_order: parseInt(data.sort_order) || 0 })
      toast.success('Đã thêm ảnh')
      setModal(false)
      reset()
      qc.invalidateQueries({ queryKey: ['gallery-admin'] })
    } catch { toast.error('Lỗi') }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa ảnh này?')) return
    await galleryApi.delete(id)
    toast.success('Đã xóa')
    qc.invalidateQueries({ queryKey: ['gallery-admin'] })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-brand-gold text-3xl font-bold flex items-center gap-2">
          <ImageIcon size={24} /> Quản lý hình ảnh
        </h1>
        <button onClick={() => { reset(); setModal(true) }} className="btn-gold gap-2">
          <Plus size={16} /> Thêm ảnh
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({length: 6}).map((_, i) => <div key={i} className="aspect-square card animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(items || []).map((item: any) => (
            <div key={item.ID} className="card group relative overflow-hidden">
              <img src={item.image_url} alt={item.title} className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-brand-brown/0 group-hover:bg-brand-brown/70 transition-all flex flex-col items-center justify-center gap-2">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center px-2">
                  <div className="text-white text-sm font-medium">{item.title}</div>
                  <div className="text-brand-gold text-xs">{categories.find(c => c.value === item.category)?.label}</div>
                  {item.featured && <div className="text-brand-gold text-xs">★ Nổi bật</div>}
                </div>
                <button onClick={() => handleDelete(item.ID)} className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded p-1.5 hover:bg-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setModal(false)}>
          <div className="card p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-brand-gold text-xl font-semibold mb-5">Thêm ảnh</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">URL ảnh</label>
                <input className="input-field" placeholder="https://..." {...register('image_url', { required: true })} />
              </div>
              <div>
                <label className="label">Tiêu đề</label>
                <input className="input-field" {...register('title')} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Danh mục</label>
                  <select className="input-field" {...register('category')}>
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Thứ tự</label>
                  <input type="number" className="input-field" defaultValue={0} {...register('sort_order')} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-brand-cream/70 cursor-pointer">
                <input type="checkbox" className="accent-brand-gold" {...register('featured')} />
                Nổi bật (hiện trên trang chủ)
              </label>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-gold flex-1 justify-center">Thêm</button>
                <button type="button" onClick={() => setModal(false)} className="btn-outline flex-1 justify-center">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
