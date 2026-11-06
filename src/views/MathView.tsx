import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mathTopics } from '../data/mathCurriculum';
import {
  Calculator,
  Search,
  BookOpen,
  Play,
  Send,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const MathView: React.FC = () => {
  const { exerciseSets, startQuiz, setCurrentView } = useApp();
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter topics based on semester
  const filteredTopics = mathTopics.filter((t) => t.semester === selectedSemester);

  // Filter lessons
  const allLessons = filteredTopics.flatMap((t) => t.lessons);
  const displayedLessons = allLessons.filter((lesson) => {
    const matchesTopic = selectedTopicId === 'all' || lesson.topicId === selectedTopicId;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(lesson.number).includes(searchQuery);
    return matchesTopic && matchesSearch;
  });

  const getExerciseSetForLesson = (lessonId: string) => {
    return (
      exerciseSets.find((es) => es.lessonId === lessonId) ||
      // Fallback to first math set for smooth demo experience if not individually seeded
      exerciseSets.find((es) => es.subject === 'math')
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Subject Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-6 sm:p-8 shadow-lg border-2 border-blue-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner">
              📐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-blue-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                  Chương trình chuẩn GDPT 2018
                </span>
                <span className="text-xs text-blue-200">Kết nối tri thức với cuộc sống</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">KHO TOÁN HỌC LỚP 2</h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1">
                Toàn diện <strong>75 bài học</strong> chia theo <strong>14 chủ đề</strong> trong 2 tập sách.
                Mỗi bài học đều có bộ câu hỏi tương tác từ 7 đến 10 câu, tự động chấm điểm và gợi ý bài làm!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-blue-950/40 p-1.5 rounded-2xl border border-blue-400/30">
            <button
              onClick={() => {
                setSelectedSemester(1);
                setSelectedTopicId('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedSemester === 1
                  ? 'bg-amber-400 text-blue-950 shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Học kì I (Tập một • 7 Chủ đề)
            </button>
            <button
              onClick={() => {
                setSelectedSemester(2);
                setSelectedTopicId('all');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedSemester === 2
                  ? 'bg-amber-400 text-blue-950 shadow-md'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Học kì II (Tập hai • 7 Chủ đề)
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Topic Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <button
            onClick={() => setSelectedTopicId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedTopicId === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả chủ đề ({filteredTopics.length})
          </button>
          {filteredTopics.map((top) => (
            <button
              key={top.id}
              onClick={() => setSelectedTopicId(top.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedTopicId === top.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Chủ đề {top.number}: {top.title}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên bài học hoặc số bài..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Lessons List Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Hiển thị <strong>{displayedLessons.length}</strong> bài học Toán 2 ({selectedSemester === 1 ? 'Học kì I' : 'Học kì II'})
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Đã sẵn sàng học liệu tương tác 7–10 câu
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedLessons.map((lesson) => {
            const exSet = getExerciseSetForLesson(lesson.id);
            return (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-black text-xs rounded-lg border border-blue-200">
                      Bài {lesson.number}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Trang {lesson.pageNumber}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-800 line-clamp-2 leading-snug">
                    {lesson.title}
                  </h3>

                  <div className="text-[11px] font-semibold text-blue-600 mt-1">
                    {lesson.topicName}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {lesson.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      if (exSet) {
                        startQuiz(exSet);
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Luyện tập (7-10 câu)</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('assign')}
                    title="Giao bài này cho cả lớp hoặc tổ"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentView('ai-gen')}
                    title="Dùng AI tạo thêm bộ đề mới cho bài này"
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
