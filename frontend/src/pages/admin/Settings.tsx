import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Settings } from 'lucide-react'
import { adminApi } from '../../api/client'

export default function AdminSettings() {
  const qc = useQueryClient()
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => adminApi.getSettings().then(r => r.data),
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    if (settings) reset(settings)
  }, [settings, reset])

  const onSubmit = async (data: any) => {
    try {
      await Promise.all(Object.entries(data).map(([key, value]) => adminApi.updateSetting(key, value as string)))
      toast.success('Đã lưu cài đặt')
      qc.invalidateQueries({ queryKey: ['settings'] })
    } catch { toast.error('Lỗi lưu cài đặt') }
  }

  const fields = [
    { key: 'restaurant_name', label: 'Tên nhà hàng' },
    { key: 'address', label: 'Địa chỉ' },
    { key: 'phone', label: 'Điện thoại' },
    { key: 'open_time_morning', label: 'Giờ mở cửa buổi sáng' },
    { key: 'close_time_morning', label: 'Giờ đóng cửa buổi sáng' },
    { key: 'open_time_evening', label: 'Giờ mở cửa buổi tối' },
    { key: 'close_time_evening', label: 'Giờ đóng cửa buổi tối' },
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'zalo', label: 'Zalo (số điện thoại)' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-serif text-brand-gold text-3xl font-bold flex items-center gap-2 mb-8">
        <Settings size={24} /> Cài đặt nhà hàng
      </h1>

      {isLoading ? (
        <div className="card h-64 animate-pulse" />
      ) : (
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map(({ key, label }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input className="input-field" {...register(key)} />
              </div>
            ))}
            <button type="submit" disabled={isSubmitting} className="btn-gold w-full justify-center py-3 mt-4">
              {isSubmitting ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
