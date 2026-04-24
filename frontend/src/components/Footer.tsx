import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock, Facebook, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-brown border-t border-brand-gold/20 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-serif text-brand-gold text-2xl font-bold mb-2">Phở Cường</div>
            <p className="text-brand-cream/50 text-sm leading-relaxed">
              Hương vị phở truyền thống Hà Nội, được gìn giữ và trao truyền qua nhiều thế hệ từ năm 1985.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-brand-cream/50 hover:text-brand-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://zalo.me" target="_blank" rel="noreferrer" className="text-brand-cream/50 hover:text-brand-gold transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-brand-gold font-semibold mb-4 text-sm tracking-wider uppercase">Khám phá</h4>
            <ul className="space-y-2">
              {[
                { to: '/menu', label: 'Thực đơn' },
                { to: '/gallery', label: 'Hình ảnh' },
                { to: '/booking', label: 'Đặt bàn' },
                { to: '/register', label: 'Đăng ký thành viên' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-brand-cream/50 hover:text-brand-gold text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-brand-gold font-semibold mb-4 text-sm tracking-wider uppercase">Giờ mở cửa</h4>
            <div className="space-y-2 text-sm text-brand-cream/50">
              <div className="flex items-start gap-2">
                <Clock size={14} className="text-brand-gold mt-0.5 shrink-0" />
                <div>
                  <div>Buổi sáng: 06:00 – 14:00</div>
                  <div>Buổi tối: 17:00 – 21:00</div>
                </div>
              </div>
              <div className="text-brand-gold/70">Mở cửa tất cả các ngày</div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-brand-gold font-semibold mb-4 text-sm tracking-wider uppercase">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-brand-cream/50">
                <MapPin size={14} className="text-brand-gold mt-0.5 shrink-0" />
                <span>123 Phố Huế, Hai Bà Trưng, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-brand-cream/50">
                <Phone size={14} className="text-brand-gold shrink-0" />
                <a href="tel:02438268866" className="hover:text-brand-gold transition-colors">024 3826 8866</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-brand-gold/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-brand-cream/30 text-xs">© 2024 Phở Cường. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-brand-cream/30 hover:text-brand-gold text-xs transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-brand-cream/30 hover:text-brand-gold text-xs transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
