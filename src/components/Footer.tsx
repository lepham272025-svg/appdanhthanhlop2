import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-gradient-to-b from-amber-900 to-red-950 text-amber-100 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-amber-700/50">
          {/* Brand info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🏮</span>
              <div>
                <h4 className="font-black text-lg text-amber-300 font-display">
                  TRẠNG NGUYÊN AI 2.0
                </h4>
                <p className="text-xs text-amber-200/80">LỚP HỌC KIẾN TẠO LỚP 2</p>
              </div>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              Ứng dụng trí tuệ nhân tạo hỗ trợ thiết kế học liệu, tổ chức trò chơi, bài tập tương tác
              và quản lý tiến độ học tập môn Toán, Tiếng Việt cho học sinh lớp 2 theo chương trình GDPT 2018.
            </p>
            <div className="mt-3 inline-block px-3 py-1 bg-amber-400/20 rounded-full text-xs font-bold text-amber-300 border border-amber-400/30">
              Khẩu hiệu: HỌC VUI – CHƠI HAY – TIẾN BỘ MỖI NGÀY
            </div>
          </div>

          {/* School & Author credentials */}
          <div>
            <h5 className="font-bold text-sm text-amber-300 mb-3 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Thông tin chính thức
            </h5>
            <ul className="space-y-2 text-xs text-amber-100/90">
              <li>
                <strong className="text-white">Tác giả sáng kiến:</strong> DANH THANH
              </li>
              <li>
                <strong className="text-white">Đơn vị công tác:</strong> Trường TH-THCS Vĩnh Điều
              </li>
              <li>
                <strong className="text-white">Địa phương:</strong> Huyện Giang Thành, Tỉnh An Giang
              </li>
              <li>
                <strong className="text-white">Năm học triển khai:</strong> 2026–2027
              </li>
              <li>
                <strong className="text-white">Bộ sách giáo khoa:</strong> Kết nối tri thức với cuộc sống
              </li>
            </ul>
          </div>

          {/* Standards & pedagogical principles */}
          <div>
            <h5 className="font-bold text-sm text-amber-300 mb-3 uppercase tracking-wider">
              Cam kết sư phạm & bản quyền
            </h5>
            <p className="text-xs text-amber-200/80 leading-relaxed mb-3">
              Hệ thống học liệu được thiết kế bám sát chuẩn kiến thức kĩ năng SGK Toán 2 và Tiếng Việt 2.
              Ngữ liệu luyện tập mới mẻ, tôn trọng bản quyền giáo dục và tuyệt đối an toàn cho học sinh tiểu học.
            </p>
            <div className="p-2.5 bg-red-900/40 rounded-xl border border-amber-500/20 text-[11px] text-amber-200">
              ✓ Không thu thập thông tin định danh cá nhân nhạy cảm của học sinh.
              <br />
              ✓ Cơ chế khen thưởng khích lệ, bảo vệ tâm lý lứa tuổi 7-8 tuổi.
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-300/80">
          <p>© 2026–2027 TRẠNG NGUYÊN AI 2.0 – Danh Thanh – Trường TH-THCS Vĩnh Điều, An Giang.</p>
          <p className="flex items-center gap-1">
            Ứng dụng kiến tạo giáo dục tiểu học bằng tâm huyết <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};
