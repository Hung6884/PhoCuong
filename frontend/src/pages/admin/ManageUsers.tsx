import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Users, ShieldCheck, ChefHat, User } from 'lucide-react'
import { adminApi } from '../../api/client'
import { useAuth } from '../../contexts/AuthContext'

const roleConfig = {
  admin: { label: 'Quản trị viên', icon: ShieldCheck, color: 'text-brand-gold' },
  staff: { label: 'Nhân viên', icon: ChefHat, color: 'text-blue-400' },
  customer: { label: 'Khách hàng', icon: User, color: 'text-green-400' },
}

export default function AdminUsers() {
  const { user: me } = useAuth()
  const qc = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers().then(r => r.data),
  })

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await adminApi.updateUserRole(id, role)
      toast.success('Đã cập nhật quyền')
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    } catch { toast.error('Không thể cập nhật') }
  }

  const handleToggle = async (id: number, name: string) => {
    if (!confirm(`Thay đổi trạng thái tài khoản ${name}?`)) return
    try {
      await adminApi.toggleUser(id)
      toast.success('Đã cập nhật')
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    } catch { toast.error('Lỗi') }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-serif text-brand-gold text-3xl font-bold flex items-center gap-2 mb-8">
        <Users size={24} /> Quản lý người dùng
      </h1>

      {isLoading ? (
        <div className="card h-48 animate-pulse" />
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Điện thoại</th>
                <th>Quyền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((u: any) => {
                const { label, icon: Icon, color } = roleConfig[u.role as keyof typeof roleConfig] || roleConfig.customer
                return (
                  <tr key={u.ID}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {u.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-brand-cream/90 font-medium">{u.name}</div>
                          <div className="text-brand-cream/40 text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-brand-cream/60">{u.phone || '—'}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Icon size={12} className={color} />
                        <span className={`text-xs ${color}`}>{label}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.active ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {u.active ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td>
                      {u.ID !== me?.id && (
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u.ID, e.target.value)}
                            className="bg-brand-brown border border-brand-gold/20 text-brand-cream/70 text-xs rounded px-2 py-1"
                          >
                            <option value="customer">Khách hàng</option>
                            <option value="staff">Nhân viên</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button
                            onClick={() => handleToggle(u.ID, u.name)}
                            className={`text-xs px-2 py-1 rounded border transition-colors ${u.active ? 'border-red-400/30 text-red-400 hover:bg-red-400/10' : 'border-green-400/30 text-green-400 hover:bg-green-400/10'}`}
                          >
                            {u.active ? 'Khóa' : 'Mở'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
