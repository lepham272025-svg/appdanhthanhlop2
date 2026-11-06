import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { vietnameseWeeks } from '../data/vietnameseCurriculum';
import {
  BookOpen,
  Search,
  Play,
  Send,
  Sparkles,
  PenTool,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export const VietnameseView: React.FC = () => {
  const { exerciseSets, startQuiz, setCurrentView } = useApp();
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredWeeks = vietnameseWeeks.filter((w) => {
    const matchesSemester = w.semester === selectedSemester;
    const matchesSearch =
      w.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.readingLessons.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase())) ||
      w.writingTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.grammarTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(w.week).includes(searchQuery);
    return matchesSemester && matchesSearch;
  });

  const getExerciseSetForWeek = (weekNum: number) => {
    return (
      exerciseSets.find((es) => es.subject === 'vietnamese' && es.topicId === `tv-w${weekNum}`) ||
      exerciseSets.find((es) => es.subject === 'vietnamese')
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Vietnamese Header */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-pink-700 to-purple-900 text-white p-6 sm:p-8 shadow-lg border-2 border-purple-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-purple-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                  Chương trình chuẩn GDPT 2018
                </span>
                <span className="text-xs text-purple-200">Kết nối tri thức với cuộc sống</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">KHO TIẾNG VIỆT LỚP 2</h1>
              <p className="text-xs sm:text-sm text-purple-100 max-w-2xl mt-1">
                Tổ chức theo <strong>35 tuần học</strong> với <strong>5 phân hệ kĩ năng</strong>: Đọc – Viết –
                Luyện từ và câu – Nói và nghe – Đọc mở rộng.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-purple-950/40 p-1.5 rounded-2xl border border-purple-400/30">
            <button
              onClick={() => setSelectedSemester(1)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedSemester === 1
                  ? 'bg-amber-400 text-purple-950 shadow-md'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Học kì I (Tuần 1 – Tuần 18)
            </button>
            <button
              onClick={() => setSelectedSemester(2)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedSemester === 2
                  ? 'bg-amber-400 text-purple-950 shadow-md'
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Học kì II (Tuần 19 – Tuần 35)
            </button>
          </div>
        </div>
      </div>

      {/* Search & Info Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800">
            {selectedSemester === 1 ? '18 Tuần Học kì I' : '17 Tuần Học kì II'}
          </span>
          <span>• 5 Phân hệ kiến thức toàn diện</span>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tuần, bài đọc, chủ điểm, chính tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* 35 Weeks Curriculum Accordion / Cards */}
      <div className="space-y-4">
        {filteredWeeks.map((week) => {
          const exSet = getExerciseSetForWeek(week.week);
          return (
            <div
              key={week.week}
              className="bg-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 p-5 shadow-sm transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-600 text-white font-black text-xs rounded-xl shadow-sm">
                    Tuần {week.week}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800">
                      Chủ điểm: {week.theme}
                    </h3>
                    <div className="text-xs text-purple-700 font-bold flex items-center gap-2 mt-0.5">
                      <span>Bài đọc chính: {week.readingLessons.join(' • ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (exSet) startQuiz(exSet);
                    }}
                    className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Làm bài tập tương tác (7-10 câu)</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('assign')}
                    title="Giao bài tuần này cho học sinh"
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCurrentView('ai-gen')}
                    title="Dùng AI tạo thêm bộ đề mới cho tuần này"
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 5 Skills Sub-modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mt-4 text-xs">
                {/* 1. Đọc */}
                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/70">
                  <div className="font-bold text-purple-900 flex items-center gap-1 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-purple-600" /> 1. ĐỌC
                  </div>
                  <p className="text-slate-600 leading-relaxed">{week.readingLessons.join(', ')}</p>
                </div>

                {/* 2. Viết */}
                <div className="p-3 rounded-xl bg-pink-50/70 border border-pink-200/70">
                  <div className="font-bold text-pink-900 flex items-center gap-1 mb-1">
                    <PenTool className="w-3.5 h-3.5 text-pink-600" /> 2. VIẾT
                  </div>
                  <p className="text-slate-600 leading-relaxed">{week.writingTopic}</p>
                </div>

                {/* 3. Luyện từ và câu */}
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70">
                  <div className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 3. TỪ VÀ CÂU
                  </div>
                  <p className="text-slate-600 leading-relaxed">{week.grammarTopic}</p>
                </div>

                {/* 4. Nói và nghe */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/70">
                  <div className="font-bold text-blue-900 flex items-center gap-1 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> 4. NÓI &amp; NGHE
                  </div>
                  <p className="text-slate-600 leading-relaxed">{week.speakingTopic}</p>
                </div>

                {/* 5. Đọc mở rộng */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                  <div className="font-bold text-emerald-900 flex items-center gap-1 mb-1">
                    <Bookmark className="w-3.5 h-3.5 text-emerald-600" /> 5. ĐỌC MỞ RỘNG
                  </div>
                  <p className="text-slate-600 leading-relaxed">{week.extensiveReadingTopic}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
