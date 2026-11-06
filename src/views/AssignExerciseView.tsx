import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Assignment } from '../types';
import { sound } from '../utils/audio';
import {
  Send,
  Users,
  Calendar,
  CheckSquare,
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Filter,
} from 'lucide-react';

export const AssignExerciseView: React.FC = () => {
  const {
    exerciseSets,
    assignments,
    createAssignment,
    deleteAssignment,
    students,
    classConfig,
    submissions,
    showToast,
  } = useApp();

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    exerciseSets[0]?.id || ''
  );
  const [assignedTarget, setAssignedTarget] = useState<'all' | 'team' | 'individual'>('all');
  const [targetTeam, setTargetTeam] = useState<string>('Rồng Vàng');
  const [targetStudentIds, setTargetStudentIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [allowReviewAnswers, setAllowReviewAnswers] = useState<boolean>(true);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);

  const selectedSet = exerciseSets.find((s) => s.id === selectedExerciseId) || exerciseSets[0];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSet) {
      showToast('Vui lòng chọn một bộ bài tập');
      return;
    }

    createAssignment({
      title: selectedSet.title,
      exerciseSetId: selectedSet.id,
      subject: selectedSet.subject,
      lessonTitle: selectedSet.lessonTitle,
      questionCount: selectedSet.questionCount,
      assignedTo: assignedTarget,
      targetTeam: assignedTarget === 'team' ? targetTeam : undefined,
      targetStudentIds: assignedTarget === 'individual' ? targetStudentIds : undefined,
      dueDate,
      allowReviewAnswers,
      shuffleQuestions,
    });
  };

  const getSubmissionsForAssignment = (assignmentId: string) => {
    return submissions.filter((s) => s.assignmentId === assignmentId);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Assign Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-900 text-white p-6 sm:p-8 shadow-lg border-2 border-indigo-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner">
              📤
            </div>
            <div>
              <span className="bg-amber-300 text-indigo-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                Phân quyền Giáo viên
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">GIAO BÀI TẬP CHO HỌC SINH</h1>
              <p className="text-xs sm:text-sm text-indigo-100 max-w-2xl mt-1">
                Giao bài tập có sẵn trong kho cho cả lớp, theo từng tổ thi đua hoặc từng em học sinh cần bồi dưỡng.
                Học sinh đăng nhập trên điện thoại sẽ thấy ngay bài cần làm hôm nay!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to Dispatch New Assignment */}
        <div className="lg:col-span-1 bg-white rounded-3xl border-2 border-indigo-200 p-6 shadow-sm space-y-5">
          <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
            <span>📝</span> Thiết lập giao bài mới
          </h3>

          <form onSubmit={handleDispatch} className="space-y-4 text-xs font-bold text-slate-700">
            {/* 1. Chọn bài tập trong kho */}
            <div>
              <label className="block mb-1.5 text-slate-600">1. Chọn bài tập trong kho</label>
              <select
                value={selectedExerciseId}
                onChange={(e) => setSelectedExerciseId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:border-indigo-500 font-semibold text-xs"
              >
                {exerciseSets.map((set) => (
                  <option key={set.id} value={set.id}>
                    [{set.subject === 'math' ? 'Toán' : 'Tiếng Việt'}] {set.title} ({set.questionCount} câu)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Đối tượng giao bài */}
            <div>
              <label className="block mb-1.5 text-slate-600">2. Đối tượng nhận bài</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setAssignedTarget('all')}
                  className={`py-2 rounded-xl border font-bold transition-all ${
                    assignedTarget === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Cả lớp
                </button>
                <button
                  type="button"
                  onClick={() => setAssignedTarget('team')}
                  className={`py-2 rounded-xl border font-bold transition-all ${
                    assignedTarget === 'team'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Theo tổ
                </button>
                <button
                  type="button"
                  onClick={() => setAssignedTarget('individual')}
                  className={`py-2 rounded-xl border font-bold transition-all ${
                    assignedTarget === 'individual'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  Cá nhân
                </button>
              </div>

              {/* Sub-select for Team */}
              {assignedTarget === 'team' && (
                <div className="mt-2.5">
                  <label className="block mb-1 text-[11px] text-slate-500">Chọn tổ nhận bài:</label>
                  <select
                    value={targetTeam}
                    onChange={(e) => setTargetTeam(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                  >
                    {classConfig.teams.map((t) => (
                      <option key={t} value={t}>
                        Tổ: {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sub-select for Individual */}
              {assignedTarget === 'individual' && (
                <div className="mt-2.5 max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1">
                  {students.map((st) => (
                    <label
                      key={st.id}
                      className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded text-xs cursor-pointer font-medium"
                    >
                      <input
                        type="checkbox"
                        checked={targetStudentIds.includes(st.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTargetStudentIds([...targetStudentIds, st.id]);
                          } else {
                            setTargetStudentIds(targetStudentIds.filter((id) => id !== st.id));
                          }
                        }}
                      />
                      <span>{st.name} ({st.team})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Hạn nộp bài */}
            <div>
              <label className="block mb-1.5 text-slate-600">3. Hạn nộp bài</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-xs"
              />
            </div>

            {/* 4. Tùy chọn xem đáp án & đảo câu */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowReviewAnswers}
                  onChange={(e) => setAllowReviewAnswers(e.target.checked)}
                />
                <span className="font-semibold text-slate-700">Cho phép học sinh xem đáp án sau khi nộp</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                />
                <span className="font-semibold text-slate-700">Đảo thứ tự câu hỏi chống quay cóp</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>GIAO BÀI TẬP NGAY</span>
            </button>
          </form>
        </div>

        {/* List of Active Assignments & Real Student Progress */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-800">
              Danh sách bài tập đã giao ({assignments.length})
            </h3>
            <span className="text-xs font-bold text-slate-500">
              Sĩ số lớp: {students.length} em ({classConfig.className})
            </span>
          </div>

          <div className="space-y-3">
            {assignments.map((assign) => {
              const subs = getSubmissionsForAssignment(assign.id);
              const completedCount = subs.length;
              const targetCount =
                assign.assignedTo === 'all'
                  ? students.length
                  : assign.assignedTo === 'team'
                  ? students.filter((s) => s.team === assign.targetTeam).length
                  : assign.targetStudentIds?.length || 1;
              const percent = Math.min(Math.round((completedCount / (targetCount || 1)) * 100), 100);

              return (
                <div
                  key={assign.id}
                  className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            assign.subject === 'math'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {assign.subject === 'math' ? 'Toán 2' : 'Tiếng Việt 2'}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          Giao ngày: {assign.createdAt}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-800">{assign.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Đối tượng:{' '}
                        <strong>
                          {assign.assignedTo === 'all'
                            ? 'Cả lớp'
                            : assign.assignedTo === 'team'
                            ? `Tổ ${assign.targetTeam}`
                            : 'Cá nhân được chỉ định'}
                        </strong>{' '}
                        • Hạn nộp: <span className="text-red-700 font-bold">{assign.dueDate}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => deleteAssignment(assign.id)}
                      title="Xóa bài tập đã giao"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar of Completion */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1">
                      <span>
                        Tiến độ nộp bài: <strong>{completedCount}</strong> / {targetCount} học sinh ({percent}%)
                      </span>
                      <span className={percent === 100 ? 'text-emerald-600' : 'text-amber-700'}>
                        {percent === 100 ? 'Hoàn thành 100%' : 'Đang thực hiện'}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Recent Submissions Snippet */}
                  {subs.length > 0 && (
                    <div className="pt-2 text-[11px] text-slate-500 flex flex-wrap gap-2 items-center">
                      <span className="font-semibold text-slate-600">Đã nộp gần đây:</span>
                      {subs.slice(0, 4).map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-bold"
                        >
                          {s.studentName}: {s.score}/10đ
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
