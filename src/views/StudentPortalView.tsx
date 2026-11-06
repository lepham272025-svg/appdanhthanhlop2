import React from 'react';
import { useApp } from '../context/AppContext';
import { sound } from '../utils/audio';
import {
  Sparkles,
  BookOpen,
  Calculator,
  Trophy,
  Gamepad2,
  Bot,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Award,
  ChevronRight,
} from 'lucide-react';

export const StudentPortalView: React.FC = () => {
  const {
    currentStudent,
    assignments,
    submissions,
    exerciseSets,
    startQuiz,
    setCurrentView,
  } = useApp();

  const studentSubmissions = submissions.filter(
    (s) => s.studentId === currentStudent?.id
  );

  // Check which assignments student has done
  const todayAssignments = assignments.map((assign) => {
    const sub = studentSubmissions.find((s) => s.assignmentId === assign.id);
    const exSet = exerciseSets.find((es) => es.id === assign.exerciseSetId);
    return {
      assign,
      exSet,
      isCompleted: Boolean(sub),
      submission: sub,
    };
  });

  const pendingCount = todayAssignments.filter((a) => !a.isCompleted).length;
  const completedCount = todayAssignments.filter((a) => a.isCompleted).length;

  if (!currentStudent) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border-2 border-dashed border-amber-300 text-center space-y-4 my-8 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-3xl">
          👨‍🎓
        </div>
        <h3 className="font-black text-lg text-slate-800">Chưa có học sinh trong lớp</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Thầy/Cô vui lòng chuyển sang chế độ <strong>Giáo viên</strong> và mở mục <strong>Quản lý lớp</strong> để thêm danh sách học sinh của lớp.
        </p>
        <button
          onClick={() => setCurrentView('class-manage')}
          className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs shadow transition-colors"
        >
          Đến trang Quản lý lớp &amp; Thêm học sinh
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5 pb-16">
      {/* Student Profile Card (Mobile Optimized) */}
      <div className="bg-gradient-to-br from-red-700 via-amber-600 to-red-800 rounded-3xl p-6 text-white shadow-xl border-4 border-amber-300 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-200 text-amber-950 flex items-center justify-center text-4xl shadow-md border-2 border-amber-300">
            {currentStudent?.avatar || '👦'}
          </div>
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-200 bg-black/20 px-2 py-0.5 rounded-full">
              Học sinh Lớp 2A
            </span>
            <h2 className="text-xl font-black mt-0.5">{currentStudent?.name || 'Học sinh'}</h2>
            <p className="text-xs text-amber-100 font-semibold">
              Tổ thi đua: <strong className="text-amber-300">{currentStudent?.team || 'Rồng Vàng'}</strong>
            </p>
          </div>
        </div>

        {/* Stars Counter */}
        <div className="mt-5 grid grid-cols-3 gap-2 bg-black/20 p-3 rounded-2xl border border-white/20 text-center">
          <div>
            <div className="text-xl font-black text-amber-300">{currentStudent?.points || 0} ⭐</div>
            <div className="text-[10px] text-amber-100 font-bold">Sao tích lũy</div>
          </div>
          <div>
            <div className="text-xl font-black text-white">{completedCount}</div>
            <div className="text-[10px] text-amber-100 font-bold">Đã làm</div>
          </div>
          <div>
            <div className="text-xl font-black text-amber-200">{pendingCount}</div>
            <div className="text-[10px] text-amber-100 font-bold">Cần làm</div>
          </div>
        </div>
      </div>

      {/* Badges showcase */}
      {currentStudent && currentStudent.badges.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {currentStudent.badges.map((b, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs font-black border border-amber-300 shrink-0 shadow-2xs"
            >
              🏅 {b}
            </span>
          ))}
        </div>
      )}

      {/* Quick Launch Buttons for Student */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-slate-700">
        <button
          onClick={() => setCurrentView('math')}
          className="p-3 bg-white rounded-2xl border-2 border-blue-200 shadow-xs hover:border-blue-400 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
            📐
          </div>
          <span className="text-[11px]">Toán 2</span>
        </button>

        <button
          onClick={() => setCurrentView('vietnamese')}
          className="p-3 bg-white rounded-2xl border-2 border-purple-200 shadow-xs hover:border-purple-400 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl">
            📚
          </div>
          <span className="text-[11px]">Tiếng Việt</span>
        </button>

        <button
          onClick={() => setCurrentView('games')}
          className="p-3 bg-white rounded-2xl border-2 border-pink-200 shadow-xs hover:border-pink-400 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center text-xl">
            🎮
          </div>
          <span className="text-[11px]">Trò chơi</span>
        </button>

        <button
          onClick={() => setCurrentView('chatbot')}
          className="p-3 bg-white rounded-2xl border-2 border-cyan-200 shadow-xs hover:border-cyan-400 transition-all flex flex-col items-center gap-1"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center text-xl">
            🤖
          </div>
          <span className="text-[11px]">Bạn Học AI</span>
        </button>
      </div>

      {/* Today's Assignments Task List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-1.5">
            <span>📋</span> Bài tập thầy cô giao
          </h3>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            {pendingCount} bài chưa làm
          </span>
        </div>

        {todayAssignments.length === 0 ? (
          <div className="p-6 bg-white rounded-3xl border text-center text-slate-500 text-xs">
            Hôm nay chưa có bài tập mới được giao. Em hãy tự luyện thêm trong kho bài tập nhé!
          </div>
        ) : (
          todayAssignments.map(({ assign, exSet, isCompleted, submission }) => {
            const isMath = assign.subject === 'math';
            return (
              <div
                key={assign.id}
                className={`p-4 rounded-3xl border-2 bg-white shadow-xs transition-all space-y-3 ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isMath
                    ? 'border-blue-200'
                    : 'border-purple-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        isMath ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {isMath ? 'Toán 2' : 'Tiếng Việt 2'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800 mt-1 line-clamp-2">
                      {assign.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Hạn nộp: <span className="text-red-700 font-bold">{assign.dueDate}</span> ({assign.questionCount} câu)
                    </p>
                  </div>

                  {isCompleted ? (
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black text-xs rounded-full inline-block">
                        {submission?.score}/10 điểm
                      </span>
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5">✓ Hoàn thành</div>
                    </div>
                  ) : (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full shrink-0">
                      Chưa nộp
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {isCompleted ? (
                    <button
                      onClick={() => {
                        if (exSet) startQuiz(exSet, assign.id);
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Làm lại để nâng điểm</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (exSet) startQuiz(exSet, assign.id);
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white text-xs font-black rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>BẮT ĐẦU LÀM BÀI NGAY</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
