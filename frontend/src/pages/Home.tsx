import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Star, Clock, MapPin, Phone } from 'lucide-react'
import { menuApi, galleryApi, reviewApi } from '../api/client'

function formatPrice(p: number) {
  return p.toLocaleString('vi-VN') + 'đ'
}

export default function Home() {
  const { data: featuredMenu } = useQuery({
    queryKey: ['menu', 'featured'],
    queryFn: () => menuApi.getAll({ featured: true, available: true }).then(r => r.data),
  })

  const { data: gallery } = useQuery({
    queryKey: ['gallery', 'featured'],
    queryFn: () => galleryApi.getAll({ featured: true }).then(r => r.data),
  })

  const { data: reviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => reviewApi.getAll().then(r => r.data),
  })

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555126634-323283e090fa?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-brown/60 via-transparent to-brand-brown" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="text-brand-gold text-sm tracking-[0.3em] uppercase mb-4 animate-pulse">Hà Nội · Từ Năm 1985</div>
          <h1 className="font-serif text-5xl md:text-7xl text-white font-bold mb-6 text-shadow leading-tight">
            Phở Cường<br />
            <span className="text-brand-gold">Hương Vị</span> Truyền Thống
          </h1>
          <p className="text-brand-cream/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Nước dùng xương hầm 8 tiếng, thịt bò tươi mỗi ngày — công thức gia truyền được gìn giữ qua 3 thế hệ
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking" className="btn-gold text-base px-8 py-3">
              Đặt bàn ngay
            </Link>
            <Link to="/menu" className="btn-outline text-base px-8 py-3">
              Xem thực đơn
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-gold/50">
          <span className="text-xs tracking-widest uppercase">Khám phá</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-gold/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-brand-brown-light border-y border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: '39+', label: 'Năm kinh nghiệm' },
            { number: '500+', label: 'Khách mỗi ngày' },
            { number: '4.9★', label: 'Đánh giá trung bình' },
            { number: '8h', label: 'Hầm xương mỗi ngày' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-serif text-3xl text-brand-gold font-bold">{stat.number}</div>
              <div className="text-brand-cream/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Menu */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="section-subtitle">Thực đơn nổi bật</div>
          <h2 className="section-title">Những Tô Phở Đặc Trưng</h2>
          <div className="gold-divider max-w-xs mx-auto mt-4">✦</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(featuredMenu || []).slice(0, 6).map((item: any) => (
            <div key={item.ID} className="card group hover:border-brand-gold/40 transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <h3 className="text-white font-serif font-semibold text-lg text-shadow">{item.name}</h3>
                  <span className="text-brand-gold font-bold text-lg">{formatPrice(item.price)}</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-brand-cream/60 text-sm line-clamp-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/menu" className="btn-outline gap-2">
            Xem toàn bộ thực đơn <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* About / Story */}
      <section className="py-20 bg-brand-brown-light border-y border-brand-gold/20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=700"
              alt="Bếp Phở Cường"
              className="rounded-lg w-full h-80 object-cover"
            />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-red rounded-lg overflow-hidden hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1534482421-64566f976cfa?w=200"
                alt="Phở"
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          </div>
          <div>
            <div className="section-subtitle text-left">Câu chuyện của chúng tôi</div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-gold font-bold mb-6">Ba Thế Hệ<br />Giữ Lửa Hương Phở</h2>
            <p className="text-brand-cream/70 leading-relaxed mb-4">
              Từ năm 1985, ông Cường đã mang công thức nước dùng gia truyền từ làng quê ra Hà Nội, tạo nên một tiệm phở nhỏ tại phố Huế. Nước dùng trong vắt, ngọt từ xương ống hầm 8 tiếng với gia vị bí truyền.
            </p>
            <p className="text-brand-cream/70 leading-relaxed mb-6">
              Ngày nay, con cháu ông tiếp nối truyền thống đó — mỗi tô phở là một câu chuyện về tình yêu ẩm thực và sự tận tâm.
            </p>
            <Link to="/gallery" className="btn-primary">
              Khám phá thêm <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {gallery && gallery.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-subtitle">Không gian & ẩm thực</div>
            <h2 className="section-title">Album Ảnh</h2>
            <div className="gold-divider max-w-xs mx-auto mt-4">✦</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {gallery.slice(0, 6).map((item: any, i: number) => (
              <div key={item.ID} className={`overflow-hidden rounded-lg ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                <img
                  src={item.image_url}
                  alt={item.title}
                  className={`w-full object-cover hover:scale-105 transition-transform duration-500 ${i === 0 ? 'h-64 md:h-full' : 'h-48'}`}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/gallery" className="btn-outline">Xem tất cả ảnh <ChevronRight size={16} /></Link>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="py-20 bg-brand-brown-light border-t border-brand-gold/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="section-subtitle">Khách hàng nói gì</div>
              <h2 className="section-title">Đánh Giá Thực Khách</h2>
              <div className="gold-divider max-w-xs mx-auto mt-4">✦</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((r: any) => (
                <div key={r.ID} className="card p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-brand-gold fill-brand-gold" />
                    ))}
                  </div>
                  <p className="text-brand-cream/70 text-sm italic mb-4">"{r.comment}"</p>
                  <div className="text-brand-gold font-medium text-sm">— {r.customer?.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA / Contact */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title mb-4">Ghé Thăm Chúng Tôi</h2>
          <div className="gold-divider max-w-xs mx-auto mb-8">✦</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="card p-6 text-center">
              <MapPin className="text-brand-gold mx-auto mb-3" size={24} />
              <div className="text-brand-gold font-semibold mb-1 text-sm">Địa chỉ</div>
              <div className="text-brand-cream/60 text-sm">123 Phố Huế, Hai Bà Trưng, Hà Nội</div>
            </div>
            <div className="card p-6 text-center">
              <Clock className="text-brand-gold mx-auto mb-3" size={24} />
              <div className="text-brand-gold font-semibold mb-1 text-sm">Giờ mở cửa</div>
              <div className="text-brand-cream/60 text-sm">Sáng: 6:00 – 14:00<br />Tối: 17:00 – 21:00</div>
            </div>
            <div className="card p-6 text-center">
              <Phone className="text-brand-gold mx-auto mb-3" size={24} />
              <div className="text-brand-gold font-semibold mb-1 text-sm">Điện thoại</div>
              <div className="text-brand-cream/60 text-sm">024 3826 8866<br />Zalo: 0912 345 678</div>
            </div>
          </div>
          <Link to="/booking" className="btn-gold text-base px-10 py-3">
            Đặt bàn ngay hôm nay
          </Link>
        </div>
      </section>
    </div>
  )
}
