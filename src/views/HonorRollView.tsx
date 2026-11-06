import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  Sparkles,
  Star,
  Printer,
  Heart,
  Crown,
  Medal,
} from 'lucide-react';

export const HonorRollView: React.FC = () => {
  const { students, classConfig } = useApp();
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<any | null>(null);

  // Group by team
  const teamSummaries = classConfig.teams.map((teamName) => {
    const teamStudents = students.filter((s) => s.team === teamName);
    const totalPoints = teamStudents.reduce((acc, s) => acc + s.points, 0);
    const totalCompleted = teamStudents.reduce((acc, s) => acc + s.completedCount, 0);
    const avgScore =
      teamStudents.length > 0
        ? (teamStudents.reduce((acc, s) => acc + s.averageScore, 0) / teamStudents.length).toFixed(1)
        : '0';

    return {
      teamName,
      studentCount: teamStudents.length,
      totalPoints,
      totalCompleted,
      avgScore,
      students: teamStudents,
    };
  });

  // Sort teams encouragingly
  const sortedTeams = [...teamSummaries].sort((a, b) => b.totalPoints - a.totalPoints);

  const handleCelebrate = () => {
    sound.playFanfare();
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Honor Roll Header */}
      <div className="rounded-3xl bg-gradient-to-r from-yellow-600 via-amber-600 to-red-700 text-white p-6 sm:p-8 shadow-lg border-2 border-yellow-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner">
              🏮
            </div>
            <div>
              <span className="bg-amber-300 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                Tuyên dương &amp; Khích lệ học tập
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">BẢNG VÀNG TRẠNG NGUYÊN THI ĐUA</h1>
              <p className="text-xs sm:text-sm text-yellow-100 max-w-2xl mt-1">
                Tôn vinh sự nỗ lực và tiến bộ vượt bậc của 4 tổ thi đua: <strong>Rồng Vàng – Phượng Hoàng – Kỳ Lân – Rùa Thần</strong>.
                Mỗi bạn nhỏ đều là một Trạng Nguyên chăm ngoan!
              </p>
            </div>
          </div>

          <button
            onClick={handleCelebrate}
            className="px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-red-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 self-start md:self-auto transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-red-700" />
            Tung hoa chúc mừng! 🎊
          </button>
        </div>
      </div>

      {/* 4 Teams Podium Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedTeams.map((team, rank) => {
          let crownEmoji = rank === 0 ? '👑' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : '⭐';
          let borderStyle =
            rank === 0
              ? 'border-yellow-400 bg-gradient-to-b from-yellow-50 to-white'
              : 'border-slate-200 bg-white';

          return (
            <div
              key={team.teamName}
              className={`rounded-3xl border-2 p-5 shadow-sm hover:shadow-md transition-all text-center space-y-3 ${borderStyle}`}
            >
              <div className="text-3xl">{crownEmoji}</div>
              <h3 className="font-extrabold text-lg text-slate-800">Tổ {team.teamName}</h3>

              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-black rounded-full text-sm border border-amber-300">
                {team.totalPoints} Sao Thi Đua ⭐
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                <div>Sĩ số: <strong>{team.studentCount} bạn</strong></div>
                <div>Tổng bài đã làm: <strong>{team.totalCompleted} bài</strong></div>
                <div>Điểm trung bình: <strong className="text-red-700">{team.avgScore}/10</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouraging Badges & Student Honor Gallery */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" /> Vinh danh thành tích &amp; Huy hiệu cá nhân
          </h3>
          <p className="text-xs text-slate-500">
            Khen thưởng mang tính xây dựng, bảo vệ sự tự tin và khích lệ tất cả học sinh lớp 2 vươn lên.
          </p>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            Chưa có học sinh trong danh sách lớp. Thầy/Cô hãy vào mục "Quản lý lớp" để thêm danh sách học sinh và ghi nhận bảng vàng thành tích!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {students.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-amber-50/20 hover:bg-amber-50/50 transition-all flex flex-col justify-between"
              >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-2xl">{st.avatar}</span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {st.points} ⭐
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-800">{st.name}</h4>
                <p className="text-[11px] text-slate-500 font-medium">Tổ {st.team}</p>

                {/* Badges List */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {st.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-900 text-[10px] font-bold shadow-2xs"
                    >
                      🏅 {b}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForCert(st)}
                className="mt-3 w-full py-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Award className="w-3.5 h-3.5 text-amber-600" /> Xem giấy khen
              </button>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Certificate Preview Modal */}
      {selectedStudentForCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border-8 border-amber-400 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedStudentForCert(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-600"
            >
              ✕
            </button>

            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-3xl">
              👑
            </div>

            <span className="text-xs font-black text-amber-800 uppercase tracking-widest block mb-1">
              TRẠNG NGUYÊN AI 2.0 – LỚP HỌC KIẾN TẠO
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-red-800 font-display mb-1">
              GIẤY KHEN TUYÊN DƯƠNG
            </h3>

            <p className="text-xs text-slate-500 mb-6 italic">
              Trường TH-THCS Vĩnh Điều – An Giang • Năm học 2026–2027
            </p>

            <div className="my-4 p-4 bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-300 text-slate-800">
              <p className="text-xs font-semibold text-slate-500">Trao tặng cho em:</p>
              <h4 className="text-xl sm:text-2xl font-black text-red-700 my-1 font-display">
                {selectedStudentForCert.name}
              </h4>
              <p className="text-xs font-bold text-slate-700">
                Học sinh {classConfig.className} • Tổ {selectedStudentForCert.team}
              </p>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Đã có thành tích xuất sắc và tinh thần rèn luyện chăm chỉ, tích lũy được{' '}
                <strong className="text-amber-700 font-black">
                  {selectedStudentForCert.points} Sao Trạng Nguyên
                </strong>{' '}
                và hoàn thành tốt các bài tập Toán &amp; Tiếng Việt Lớp 2.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
              <div className="text-left">
                <p>Khẩu hiệu:</p>
                <p className="font-bold text-amber-900">Học vui – Chơi hay – Tiến bộ mỗi ngày</p>
              </div>
              <div className="text-right">
                <p>Giáo viên chủ nhiệm:</p>
                <p className="font-bold text-red-800">{classConfig.teacherName}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
