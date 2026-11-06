import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExerciseSet, Question } from '../types';
import {
  Layers,
  Search,
  Filter,
  Play,
  Send,
  Eye,
  Trash2,
  Plus,
  BookOpen,
  Calculator,
  CheckCircle,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react';

export const InteractiveExercisesView: React.FC = () => {
  const { exerciseSets, startQuiz, deleteExerciseSet, setCurrentView, showToast } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'math' | 'vietnamese'>('all');
  const [selectedSemester, setSelectedSemester] = useState<'all' | '1' | '2'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewSet, setPreviewSet] = useState<ExerciseSet | null>(null);

  const filteredSets = exerciseSets.filter((set) => {
    const matchesSubject = selectedSubject === 'all' || set.subject === selectedSubject;
    const matchesSemester =
      selectedSemester === 'all' || String(set.semester) === selectedSemester;
    const matchesSearch =
      set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      set.topicName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSemester && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Exercises Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-6 sm:p-8 shadow-lg border-2 border-emerald-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner">
              📑
            </div>
            <div>
              <span className="bg-amber-300 text-emerald-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                Quy chuẩn 7 – 10 câu mỗi lượt
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">KHO BÀI TẬP TƯƠNG TÁC SẴN CÓ</h1>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mt-1">
                Giáo viên chỉ cần chọn bài và giao ngay, không cần tự gõ từng câu hỏi. Hệ thống tự động chấm điểm,
                lưu tiến độ và phản hồi khích lệ học sinh!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setCurrentView('ai-gen')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Tạo bài mới bằng AI
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {/* Subject Filter */}
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedSubject === 'all'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả môn ({exerciseSets.length})
          </button>
          <button
            onClick={() => setSelectedSubject('math')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
              selectedSubject === 'math'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Toán 2
          </button>
          <button
            onClick={() => setSelectedSubject('vietnamese')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
              selectedSubject === 'vietnamese'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Tiếng Việt 2
          </button>

          {/* Semester Filter */}
          <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block"></div>
          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold ${
              selectedSemester === 'all' ? 'text-emerald-800 font-bold' : 'text-slate-500'
            }`}
          >
            Cả 2 học kì
          </button>
          <button
            onClick={() => setSelectedSemester('1')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold ${
              selectedSemester === '1' ? 'text-emerald-800 font-bold' : 'text-slate-500'
            }`}
          >
            Học kì I
          </button>
          <button
            onClick={() => setSelectedSemester('2')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold ${
              selectedSemester === '2' ? 'text-emerald-800 font-bold' : 'text-slate-500'
            }`}
          >
            Học kì II
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên bài tập, bài học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Exercise Sets List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSets.map((set) => {
          const isMath = set.subject === 'math';
          return (
            <div
              key={set.id}
              className={`bg-white rounded-2xl border-2 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                isMath ? 'border-blue-100 hover:border-blue-400' : 'border-purple-100 hover:border-purple-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase ${
                      isMath
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {isMath ? 'Toán 2' : 'Tiếng Việt 2'} • Kì {set.semester}
                  </span>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {set.questionCount} câu hỏi
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-800 line-clamp-2 leading-snug">
                  {set.title}
                </h3>

                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Bài học: <span className="text-slate-700">{set.lessonTitle}</span>
                </p>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-1 italic">
                  Nguồn: {set.sgkRef}
                </p>

                {set.isAiGenerated && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 text-amber-600" /> Do giáo viên &amp; AI đồng kiến tạo
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => startQuiz(set)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Làm thử ngay</span>
                </button>

                <button
                  onClick={() => setPreviewSet(set)}
                  title="Xem trước danh sách câu hỏi"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentView('assign')}
                  title="Giao bài này cho học sinh"
                  className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal for Questions in a Set */}
      {previewSet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border-4 border-amber-300 max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-800">{previewSet.title}</h3>
                <p className="text-xs text-slate-500">
                  {previewSet.lessonTitle} • {previewSet.sgkRef} ({previewSet.questions.length} câu)
                </p>
              </div>
              <button
                onClick={() => setPreviewSet(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 my-4 space-y-4 pr-1">
              {previewSet.questions.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between items-center font-bold text-slate-700 mb-1.5">
                    <span className="text-red-700">Câu {idx + 1}: ({q.type})</span>
                    <span className="text-slate-500 font-medium">{q.level}</span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm mb-2">{q.question}</p>
                  {q.options && (
                    <div className="grid grid-cols-2 gap-1.5 text-slate-600 mb-2">
                      {q.options.map((opt, i) => (
                        <div key={i} className="p-1.5 bg-white rounded border border-slate-200">
                          {String.fromCharCode(65 + i)}. {opt}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="text-emerald-700 font-bold mt-1">
                    Đáp án đúng: {String(q.correctAnswer)}
                  </div>
                  <div className="text-slate-500 italic mt-0.5">
                    Giải thích: {q.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  startQuiz(previewSet);
                  setPreviewSet(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Bắt đầu làm bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
