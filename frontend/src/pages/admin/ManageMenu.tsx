import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, UtensilsCrossed } from 'lucide-react'
import { menuApi } from '../../api/client'

const categories = [
  { value: 'pho', label: 'Phở' },
  { value: 'com_tam', label: 'Cơm tấm' },
  { value: 'drink', label: 'Đồ uống' },
  { value: 'topping', label: 'Topping' },
]

export default function AdminMenu() {
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const qc = useQueryClient()

  const { data: items, isLoading } = useQuery({
    queryKey: ['menu-admin'],
    queryFn: () => menuApi.getAll().then(r => r.data),
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  const openCreate = () => { reset({}); setEditing(null); setModal('create') }
  const openEdit = (item: any) => { reset(item); setEditing(item); setModal('edit') }

  const onSubmit = async (data: any) => {
    try {
      if (modal === 'edit') {
        await menuApi.update(editing.ID, { ...data, price: parseFloat(data.price) })
        toast.success('Đã cập nhật món')
      } else {
        await menuApi.create({ ...data, price: parseFloat(data.price) })
        toast.success('Đã thêm món mới')
      }
      setModal(null)
      qc.invalidateQueries({ queryKey: ['menu-admin'] })
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Lỗi')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa món này?')) return
    try {
      await menuApi.delete(id)
      toast.success('Đã xóa')
      qc.invalidateQueries({ queryKey: ['menu-admin'] })
    } catch { toast.error('Không thể xóa') }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-brand-gold text-3xl font-bold flex items-center gap-2">
          <UtensilsCrossed size={24} /> Quản lý thực đơn
        </h1>
        <button onClick={openCreate} className="btn-gold gap-2">
          <Plus size={16} /> Thêm món
        </button>
      </div>

      {isLoading ? (
        <div className="card animate-pulse h-64" />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tên món</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Nổi bật</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(items || []).map((item: any) => (
                <tr key={item.ID}>
                  <td>
                    <div className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />}
                      <div>
                        <div className="text-brand-cream/90 font-medium">{item.name}</div>
                        <div className="text-brand-cream/40 text-xs line-clamp-1">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>{categories.find(c => c.value === item.category)?.label}</td>
                  <td className="text-brand-gold">{item.price?.toLocaleString('vi-VN')}đ</td>
                  <td>
                    <span className={`badge ${item.available ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      {item.available ? 'Có sẵn' : 'Hết'}
                    </span>
                  </td>
                  <td>
                    {item.featured && <span className="badge bg-brand-gold/20 text-brand-gold">★</span>}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="text-brand-gold/60 hover:text-brand-gold transition-colors p-1">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.ID)} className="text-red-400/60 hover:text-red-400 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-brand-gold text-xl font-semibold mb-5">
              {modal === 'create' ? 'Thêm món mới' : 'Sửa món'}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Tên món</label>
                <input className="input-field" {...register('name', { required: true })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Danh mục</label>
                  <select className="input-field" {...register('category', { required: true })}>
                    {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Giá (VND)</label>
                  <input type="number" className="input-field" {...register('price', { required: true })} />
                </div>
              </div>
              <div>
                <label className="label">Mô tả</label>
                <textarea rows={2} className="input-field resize-none" {...register('description')} />
              </div>
              <div>
                <label className="label">URL ảnh</label>
                <input className="input-field" placeholder="https://..." {...register('image')} />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-brand-cream/70 cursor-pointer">
                  <input type="checkbox" className="accent-brand-gold" {...register('available')} />
                  Có sẵn
                </label>
                <label className="flex items-center gap-2 text-sm text-brand-cream/70 cursor-pointer">
                  <input type="checkbox" className="accent-brand-gold" {...register('featured')} />
                  Nổi bật
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-gold flex-1 justify-center">
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </button>
                <button type="button" onClick={() => setModal(null)} className="btn-outline flex-1 justify-center">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
