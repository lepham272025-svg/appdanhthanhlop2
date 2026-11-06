import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  BookOpen,
  Gamepad2,
  Sparkles,
  Trophy,
  Bot,
  Users,
  Send,
  BarChart3,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  Award,
  Library,
  Layers,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setCurrentView, role, currentStudent, assignments, exerciseSets, students, submissions } = useApp();

  const totalCompletedSubmissions = submissions.length;
  const averageClassScore =
    submissions.length > 0
      ? (submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length).toFixed(1)
      : '9.2';

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-800 via-amber-700 to-amber-900 text-white shadow-xl border-4 border-amber-300 p-6 sm:p-10">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs sm:text-sm font-bold border border-amber-300/30 mb-4">
            <span>🏮</span>
            <span>Ứng dụng giáo dục thông minh 2026–2027</span>
            <span>•</span>
            <span>SGK Kết nối tri thức với cuộc sống</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-3 font-display">
            TRẠNG NGUYÊN AI 2.0
            <span className="block text-amber-300 text-2xl sm:text-4xl mt-1">
              LỚP HỌC KIẾN TẠO – LỚP 2
            </span>
          </h1>

          <p className="text-base sm:text-lg text-amber-100/90 leading-relaxed max-w-3xl mb-6">
            Hệ sinh thái học tập tương tác giúp giáo viên tổ chức bài tập, trò chơi kiến tạo và đồng hành
            cùng học sinh chinh phục kiến thức <strong>Toán 2</strong> &amp; <strong>Tiếng Việt 2</strong>.
            Học sinh được luyện tập tích cực, nhận phản hồi tức thì và tiến bộ từng ngày!
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-amber-200 border-t border-amber-500/40 pt-4">
            <div>
              <span className="text-amber-300 font-semibold">Tác giả:</span>{' '}
              <strong className="text-white">DANH THANH</strong>
            </div>
            <span>•</span>
            <div>
              <span className="text-amber-300 font-semibold">Đơn vị:</span>{' '}
              <strong className="text-white">Trường TH-THCS Vĩnh Điều</strong> (An Giang)
            </div>
            <span>•</span>
            <div className="bg-amber-400 text-red-950 font-black px-2.5 py-0.5 rounded-full text-xs">
              HỌC VUI – CHƠI HAY – TIẾN BỘ MỖI NGÀY
            </div>
          </div>

          {/* Quick Action CTA */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentView('math')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-900/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all text-sm sm:text-base"
            >
              <Calculator className="w-5 h-5 text-amber-300" />
              Khám phá Toán 2
            </button>
            <button
              onClick={() => setCurrentView('vietnamese')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg shadow-purple-900/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all text-sm sm:text-base"
            >
              <BookOpen className="w-5 h-5 text-amber-300" />
              Khám phá Tiếng Việt 2
            </button>
            <button
              onClick={() => setCurrentView('games')}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-red-950 font-black shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 transition-all text-sm sm:text-base"
            >
              <Gamepad2 className="w-5 h-5" />
              8 Trò chơi học tập
            </button>
          </div>
        </div>
      </section>

      {/* Classroom Quick Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl">
            📐
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">75 bài</div>
            <div className="text-xs text-slate-500 font-semibold">Chương trình Toán 2 (14 Chủ đề)</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-2xl">
            📚
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">35 tuần</div>
            <div className="text-xs text-slate-500 font-semibold">Tiếng Việt 2 (5 Phân hệ)</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-2xl">
            🏆
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{students.length} em</div>
            <div className="text-xs text-slate-500 font-semibold">Sĩ số lớp (4 Tổ thi đua)</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-2xl">
            ⭐
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{averageClassScore}/10</div>
            <div className="text-xs text-slate-500 font-semibold">Điểm trung bình bài tập</div>
          </div>
        </div>
      </section>

      {/* 12 Feature Portals Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span className="text-red-700">🏮</span> 12 Phân hệ chức năng chính
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Thiết kế phục vụ trực tiếp giáo viên giảng dạy và học sinh lớp 2 tự luyện
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Card 1: Toán học 2 */}
          <div
            onClick={() => setCurrentView('math')}
            className="group p-5 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-blue-600 transition-colors">
                1. Toán học Lớp 2
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Trọn bộ 75 bài theo SGK 2 tập: phép cộng trừ có nhớ, bảng nhân chia 2, 5, kg, lít, khối trụ, khối cầu.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Khám phá 14 chủ đề</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Tiếng Việt 2 */}
          <div
            onClick={() => setCurrentView('vietnamese')}
            className="group p-5 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-purple-600 transition-colors">
                2. Tiếng Việt Lớp 2
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                35 tuần học theo 5 phân hệ: Đọc hiểu văn bản, Viết chính tả, Luyện từ và câu, Nói và nghe, Đọc mở rộng.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>Khám phá 35 tuần</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Kho bài tập tương tác */}
          <div
            onClick={() => setCurrentView('exercises')}
            className="group p-5 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-emerald-600 transition-colors">
                3. Kho bài tập 7–10 câu
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Bộ bài tập tương tác đa dạng dạng: Trắc nghiệm 4 đáp án, đúng/sai, điền khuyết, kéo thả, nối cặp, tự động chấm điểm.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Luyện tập ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Kho trò chơi */}
          <div
            onClick={() => setCurrentView('games')}
            className="group p-5 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-pink-600 transition-colors">
                4. Kho 8 trò chơi học tập
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Ai là Trạng Nguyên, Vòng quay may mắn, Rồng Vàng vượt ải, Giải cứu vương quốc Toán học, Ô chữ Tiếng Việt...
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-pink-600">
              <span>Chơi học vui</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: AI tạo bài tập */}
          <div
            onClick={() => setCurrentView('ai-gen')}
            className="group p-5 rounded-2xl bg-white border-2 border-amber-300 hover:border-amber-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between bg-gradient-to-b from-amber-50/30 to-white"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-amber-700 transition-colors">
                5. AI tạo bài tập SGK
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Tự động tạo bộ câu hỏi 7–10 câu (3 mức độ) bằng Gemini AI, có đáp án chuẩn, giáo viên xem trước và giao ngay.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Trợ lý AI tạo đề</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Giao bài cho học sinh */}
          <div
            onClick={() => setCurrentView('assign')}
            className="group p-5 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-indigo-600 transition-colors">
                6. Giao bài 1-chạm
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Chọn bài có sẵn → giao bài theo lớp, tổ thi đua hoặc cá nhân → học sinh mở điện thoại làm ngay.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>Giao bài tập</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 7: Quản lý lớp học */}
          <div
            onClick={() => setCurrentView('class-manage')}
            className="group p-5 rounded-2xl bg-white border-2 border-teal-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-teal-600 transition-colors">
                7. Quản lý lớp học
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Cấu hình sĩ số thực tế, quản lý 4 tổ thi đua (Rồng Vàng, Phượng Hoàng, Kỳ Lân, Rùa Thần), điểm danh, thưởng sao.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
              <span>Danh sách lớp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 8: Bảng vàng thi đua */}
          <div
            onClick={() => setCurrentView('honor-roll')}
            className="group p-5 rounded-2xl bg-white border-2 border-yellow-200 hover:border-yellow-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-yellow-600 transition-colors">
                8. Bảng vàng Trạng Nguyên
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Tuyên dương tiến bộ, trao tặng huy hiệu danh dự: Bút Vàng, Vở Sạch Chữ Đẹp, Trạng Nguyên Siêng Năng.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-yellow-600">
              <span>Xem vinh danh</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 9: Chatbot Bạn Học AI */}
          <div
            onClick={() => setCurrentView('chatbot')}
            className="group p-5 rounded-2xl bg-white border-2 border-cyan-200 hover:border-cyan-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-cyan-600 transition-colors">
                9. Bạn Học AI Lớp 2
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Chú robot hoạt hình hướng dẫn gợi ý từng bước, giải thích phép cộng qua 10, đơn vị lít, từ chỉ đặc điểm.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600">
              <span>Trò chuyện cùng AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 10: Thư viện học liệu */}
          <div
            onClick={() => setCurrentView('library')}
            className="group p-5 rounded-2xl bg-white border-2 border-rose-200 hover:border-rose-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Library className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-rose-600 transition-colors">
                10. Thư viện học liệu
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Kho tài liệu chuẩn SGK, xuất đề bài tập in ra giấy hoặc Word, phiếu tự học cho học sinh tiểu học.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>Xem tài liệu &amp; In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 11: Báo cáo và thống kê */}
          <div
            onClick={() => setCurrentView('reports')}
            className="group p-5 rounded-2xl bg-white border-2 border-slate-300 hover:border-slate-600 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-800 group-hover:text-slate-800 transition-colors">
                11. Báo cáo &amp; Đánh giá
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                Biểu đồ tỷ lệ hoàn thành, phân tích điểm số môn Toán vs Tiếng Việt, minh chứng ứng dụng AI thực tế.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Xem biểu đồ báo cáo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 12: Chế độ điện thoại học sinh */}
          <div
            onClick={() => setCurrentView('student-portal')}
            className="group p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">
                12. Góc học sinh điện thoại
              </h3>
              <p className="text-xs text-amber-100 mt-1 line-clamp-2">
                Giao diện tối ưu di động: Bài giao hôm nay, bài tập dở dang, thi đấu trò chơi, tích lũy sao Trạng Nguyên.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-amber-200">
              <span>Mở góc học sinh</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
