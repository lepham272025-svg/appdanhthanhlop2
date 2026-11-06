import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Library,
  BookOpen,
  Printer,
  ExternalLink,
  Download,
  FileText,
  Search,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

export const LearningLibraryView: React.FC = () => {
  const { exerciseSets, classConfig } = useApp();
  const [selectedSetForPrint, setSelectedSetForPrint] = useState<any | null>(null);

  const officialSources = [
    {
      title: 'SGK Toán 2 – Tập một',
      publisher: 'NXB Giáo dục Việt Nam (Bộ Kết nối tri thức với cuộc sống)',
      url: 'https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-2-tap-mot.4698648594#page=0',
      description: 'Chủ đề 1 đến Chủ đề 7 (Ôn tập, Phép cộng trừ qua 10, Khối lượng lít-kg, Phép tính có nhớ phạm vi 100, Hình phẳng, Ngày giờ).',
      badge: 'Học kì I',
      color: 'border-blue-300 bg-blue-50/40',
    },
    {
      title: 'SGK Toán 2 – Tập hai',
      publisher: 'NXB Giáo dục Việt Nam (Bộ Kết nối tri thức với cuộc sống)',
      url: 'https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-toan-2-tap-hai.4713893812#page=0',
      description: 'Chủ đề 8 đến Chủ đề 14 (Phép nhân chia 2, 5, Khối trụ cầu, Số phạm vi 1 000, Độ dài m-dm-km, Tiền Việt Nam, Thống kê xác suất).',
      badge: 'Học kì II',
      color: 'border-indigo-300 bg-indigo-50/40',
    },
    {
      title: 'SGK Tiếng Việt 2 – Tập một',
      publisher: 'NXB Giáo dục Việt Nam (Bộ Kết nối tri thức với cuộc sống)',
      url: 'https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tieng-viet-2-tap-mot.4698590737#page=0',
      description: 'Tuần 1 đến Tuần 18 (Em lớn lên từng ngày, Đi học vui sao, Niềm vui tuổi thơ, Mái ấm gia đình, Ôn tập cuối học kì I).',
      badge: 'Học kì I',
      color: 'border-purple-300 bg-purple-50/40',
    },
    {
      title: 'SGK Tiếng Việt 2 – Tập hai',
      publisher: 'NXB Giáo dục Việt Nam (Bộ Kết nối tri thức với cuộc sống)',
      url: 'https://taphuan.nxbgd.vn/tap-huan/doc-sach/sgk-tieng-viet-2-tap-hai.4698600732#page=0',
      description: 'Tuần 19 đến Tuần 35 (Vẻ đẹp quanh em, Hành tinh xanh của em, Giao tiếp và kết nối, Con người Việt Nam, Việt Nam quê hương em).',
      badge: 'Học kì II',
      color: 'border-pink-300 bg-pink-50/40',
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Library Header */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-700 via-red-700 to-rose-900 text-white p-6 sm:p-8 shadow-lg border-2 border-rose-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner">
              📚
            </div>
            <div>
              <span className="bg-amber-300 text-rose-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                Kho học liệu chuẩn &amp; Xuất in
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">THƯ VIỆN HỌC LIỆU &amp; TÀI LIỆU SGK</h1>
              <p className="text-xs sm:text-sm text-rose-100 max-w-2xl mt-1">
                Tra cứu nguồn sách giáo khoa chính thức 4 tập, in phiếu bài tập ra giấy cho học sinh
                làm trực tiếp trên lớp và tải học liệu tham khảo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official SGK References Section */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-rose-600" /> Bốn nguồn SGK chính thức (Bộ GD&amp;ĐT - KNTT)
        </h3>
        <p className="text-xs text-slate-500">
          Các đường dẫn số hóa chính thức trên cổng tập huấn NXB Giáo Dục Việt Nam dùng làm căn cứ kiến thức.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialSources.map((src, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border-2 ${src.color} shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-white text-slate-700 rounded-md font-bold text-[10px] border">
                    {src.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{src.publisher}</span>
                </div>
                <h4 className="font-extrabold text-base text-slate-900">{src.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{src.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-colors shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
                  Mở sách điện tử taphuan.nxbgd.vn
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Worksheets Section */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
              <Printer className="w-5 h-5 text-rose-600" /> Xuất phiếu bài tập in ra giấy / Word
            </h3>
            <p className="text-xs text-slate-500">
              Chọn bất kì bộ bài tập nào để định dạng trang in chuẩn A4, kèm tiêu đề trường lớp và ô chấm điểm.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {exerciseSets.map((set) => (
            <div
              key={set.id}
              className="p-4 rounded-2xl border border-slate-200 hover:border-rose-400 bg-slate-50/50 hover:bg-white transition-all flex items-center justify-between gap-3"
            >
              <div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    set.subject === 'math' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {set.subject === 'math' ? 'Toán 2' : 'Tiếng Việt 2'}
                </span>
                <h5 className="font-bold text-xs text-slate-800 line-clamp-1 mt-1">{set.title}</h5>
                <p className="text-[11px] text-slate-400">{set.questionCount} câu hỏi</p>
              </div>

              <button
                onClick={() => setSelectedSetForPrint(set)}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs flex items-center gap-1 shrink-0"
              >
                <Printer className="w-3.5 h-3.5" /> In phiếu
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Worksheet Preview Modal */}
      {selectedSetForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border-4 border-slate-300 max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] flex flex-col my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <span className="font-bold text-xs text-slate-500">Xem trước bản in phiếu học tập</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> In ngay (Ctrl + P)
                </button>
                <button
                  onClick={() => setSelectedSetForPrint(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-600"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* A4 Printable Layout */}
            <div className="overflow-y-auto flex-1 my-4 space-y-4 pr-1 text-slate-900 font-serif">
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3">
                <div className="text-xs">
                  <p className="font-bold uppercase">{classConfig.schoolName}</p>
                  <p>Lớp: {classConfig.className} • Năm học: {classConfig.schoolYear}</p>
                  <p>Giáo viên: {classConfig.teacherName}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold">PHIẾU BÀI TẬP TƯƠNG TÁC</p>
                  <p className="italic">{selectedSetForPrint.sgkRef}</p>
                </div>
              </div>

              <div className="text-center my-3">
                <h3 className="text-base font-bold uppercase">{selectedSetForPrint.title}</h3>
                <div className="flex justify-between items-center text-xs mt-3 px-2 border p-2 rounded">
                  <span>Họ và tên học sinh: ................................................................</span>
                  <span>Điểm: ............ / 10</span>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {selectedSetForPrint.questions.map((q: any, i: number) => (
                  <div key={q.id} className="pb-2 border-b border-dashed border-slate-200">
                    <p className="font-bold">
                      Câu {i + 1}: {q.question}
                    </p>
                    {q.options && (
                      <div className="grid grid-cols-2 gap-2 mt-1.5 pl-3">
                        {q.options.map((opt: string, optI: number) => (
                          <div key={optI}>
                            {String.fromCharCode(65 + optI)}. {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
