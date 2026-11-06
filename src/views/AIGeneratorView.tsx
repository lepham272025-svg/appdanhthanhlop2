import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mathTopics } from '../data/mathCurriculum';
import { vietnameseWeeks } from '../data/vietnameseCurriculum';
import { Question, ExerciseSet } from '../types';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Calculator,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Save,
  Send,
  Eye,
  Edit3,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const AIGeneratorView: React.FC = () => {
  const { addExerciseSet, setCurrentView, showToast } = useApp();

  const [subject, setSubject] = useState<'math' | 'vietnamese'>('math');
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [selectedTopic, setSelectedTopic] = useState<string>('math-topic-1');
  const [lessonTitle, setLessonTitle] = useState<string>('Ôn tập các số đến 100');
  const [questionCount, setQuestionCount] = useState<number>(10); // 7, 8, 9, or 10

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[] | null>(null);
  const [isFallbackNotice, setIsFallbackNotice] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Available topics based on subject & semester
  const mathCurrentTopics = mathTopics.filter((t) => t.semester === selectedSemester);
  const vietnameseCurrentWeeks = vietnameseWeeks.filter((w) => w.semester === selectedSemester);

  const handleGenerate = async () => {
    setIsGenerating(true);
    sound.playClick();
    setGeneratedQuestions(null);
    setIsFallbackNotice(false);

    try {
      const response = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          grade: 2,
          topic: selectedTopic,
          lessonTitle,
          count: questionCount,
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.data?.questions) {
        // AI generated successfully
        const mappedQuestions: Question[] = resData.data.questions.map((q: any, i: number) => ({
          id: `ai-q-${Date.now()}-${i}`,
          subject,
          semester: selectedSemester,
          topicId: selectedTopic,
          topicName: subject === 'math' ? 'Toán 2 SGK' : 'Tiếng Việt 2 SGK',
          lessonId: `l-${Date.now()}`,
          lessonTitle,
          level: q.level || (i < 3 ? 'nhan_biet' : i < 7 ? 'thong_hieu' : 'van_dung'),
          type: q.type || 'multiple_choice',
          question: q.question,
          options: q.options || ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
          correctAnswer: q.correctAnswer || (q.options ? q.options[0] : '10'),
          explanation: q.explanation || 'Kiến thức cốt lõi SGK Lớp 2',
          sgkRef: subject === 'math' ? 'Toán 2 - KNTT' : 'Tiếng Việt 2 - KNTT',
          isVerified: false, // Teacher reviews before verified
        }));
        setGeneratedQuestions(mappedQuestions);
        sound.playFanfare();
        showToast(`AI đã tạo thành công ${mappedQuestions.length} câu hỏi mới chuẩn SGK!`);
      } else {
        // Fallback intelligent curriculum generation
        setIsFallbackNotice(true);
        generateFallbackCurriculumQuestions();
      }
    } catch (err) {
      console.error('AI generation request failed:', err);
      setIsFallbackNotice(true);
      generateFallbackCurriculumQuestions();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackCurriculumQuestions = () => {
    // Generate high quality SGK-aligned questions locally
    const fallbackList: Question[] = [];
    for (let i = 0; i < questionCount; i++) {
      const level = i < 3 ? 'nhan_biet' : i < 7 ? 'thong_hieu' : 'van_dung';
      if (subject === 'math') {
        const numA = 5 + (i * 2);
        const numB = 4 + (i % 3);
        const sum = numA + numB;
        fallbackList.push({
          id: `fb-m-${Date.now()}-${i}`,
          subject: 'math',
          semester: selectedSemester,
          topicId: selectedTopic,
          topicName: 'Toán 2 SGK',
          lessonId: `math-l-${i}`,
          lessonTitle,
          level,
          type: 'multiple_choice',
          question: `Câu ${i + 1} (${level === 'nhan_biet' ? 'Nhận biết' : level === 'thong_hieu' ? 'Thông hiểu' : 'Vận dụng'}): Tính kết quả phép cộng: ${numA} + ${numB} = ?`,
          options: [`${sum}`, `${sum - 1}`, `${sum + 2}`, `${sum - 2}`],
          correctAnswer: `${sum}`,
          explanation: `Ta lấy ${numA} cộng với ${numB} được kết quả là ${sum}.`,
          sgkRef: `Toán 2 - Tập ${selectedSemester}, Bài "${lessonTitle}"`,
          isVerified: false,
        });
      } else {
        const sampleWords = ['chăm chỉ', 'yêu thương', 'xanh biếc', 'cần cù', 'trường tiểu học'];
        const word = sampleWords[i % sampleWords.length];
        fallbackList.push({
          id: `fb-tv-${Date.now()}-${i}`,
          subject: 'vietnamese',
          semester: selectedSemester,
          topicId: selectedTopic,
          topicName: 'Tiếng Việt 2 SGK',
          lessonId: `tv-l-${i}`,
          lessonTitle,
          level,
          type: 'multiple_choice',
          question: `Câu ${i + 1} (${level === 'nhan_biet' ? 'Nhận biết' : level === 'thong_hieu' ? 'Thông hiểu' : 'Vận dụng'}): Từ nào dưới đây cùng nghĩa hoặc phù hợp nhất với "${word}"?`,
          options: [`${word}`, 'lười biếng', 'đen sì', 'ồn ào'],
          correctAnswer: `${word}`,
          explanation: `Từ "${word}" mang ý nghĩa tích cực, chuẩn mực trong chương trình Tiếng Việt 2.`,
          sgkRef: `Tiếng Việt 2 - Tập ${selectedSemester}, Bài "${lessonTitle}"`,
          isVerified: false,
        });
      }
    }
    setGeneratedQuestions(fallbackList);
    sound.playCorrect();
    showToast(`Đã nạp ${fallbackList.length} câu hỏi chuẩn SGK cho bài "${lessonTitle}"`);
  };

  const handleSaveToLibrary = () => {
    if (!generatedQuestions || generatedQuestions.length === 0) return;

    const newSet: ExerciseSet = {
      id: `custom-set-${Date.now()}`,
      title: `Bài tập AI: ${lessonTitle} (${generatedQuestions.length} câu)`,
      subject,
      semester: selectedSemester,
      topicId: selectedTopic,
      topicName: subject === 'math' ? 'Toán 2 SGK' : 'Tiếng Việt 2 SGK',
      lessonId: `custom-lesson-${Date.now()}`,
      lessonTitle,
      type: 'basic',
      questionCount: generatedQuestions.length,
      questions: generatedQuestions.map((q) => ({ ...q, isVerified: true })),
      sgkRef: subject === 'math' ? `Toán 2 - Tập ${selectedSemester} (KNTT)` : `Tiếng Việt 2 - Tập ${selectedSemester} (KNTT)`,
      createdAt: new Date().toISOString().split('T')[0],
      isAiGenerated: true,
    };

    addExerciseSet(newSet);
    sound.playFanfare();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* AI Header */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white p-6 sm:p-8 shadow-lg border-2 border-amber-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner">
              ✨
            </div>
            <div>
              <span className="bg-amber-300 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                Trợ lý Gemini AI Giáo Dục
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">AI TẠO BÀI TẬP THEO SGK</h1>
              <p className="text-xs sm:text-sm text-amber-100 max-w-2xl mt-1">
                Tự động tạo câu hỏi trắc nghiệm và tương tác bám sát nội dung SGK Kết nối tri thức với cuộc sống.
                Giáo viên toàn quyền xem trước, chỉnh sửa câu hỏi, duyệt và giao ngay cho học sinh!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Subject, Lesson & Question Count */}
      <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 shadow-sm space-y-6">
        <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
          <span>⚙️</span> Cấu hình tạo bộ đề bài tập mới
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold text-slate-700">
          {/* 1. Môn học */}
          <div>
            <label className="block mb-1.5 text-slate-600">1. Chọn môn học</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSubject('math')}
                className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  subject === 'math'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Calculator className="w-4 h-4" /> Toán 2
              </button>
              <button
                type="button"
                onClick={() => setSubject('vietnamese')}
                className={`flex-1 py-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  subject === 'vietnamese'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Tiếng Việt 2
              </button>
            </div>
          </div>

          {/* 2. Học kì */}
          <div>
            <label className="block mb-1.5 text-slate-600">2. Chọn học kì</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedSemester(1)}
                className={`flex-1 py-2.5 rounded-xl border text-center transition-all ${
                  selectedSemester === 1
                    ? 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Học kì I (Tập 1)
              </button>
              <button
                type="button"
                onClick={() => setSelectedSemester(2)}
                className={`flex-1 py-2.5 rounded-xl border text-center transition-all ${
                  selectedSemester === 2
                    ? 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Học kì II (Tập 2)
              </button>
            </div>
          </div>

          {/* 3. Tên bài học */}
          <div>
            <label className="block mb-1.5 text-slate-600">3. Tên bài học cần tạo</label>
            <input
              type="text"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="VD: Phép cộng qua 10, Đơn vị lít, Từ chỉ đặc điểm..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 font-semibold text-slate-800"
            />
          </div>

          {/* 4. Số câu hỏi (7 - 10 câu bắt buộc theo quy định) */}
          <div>
            <label className="block mb-1.5 text-slate-600">
              4. Số lượng câu hỏi (Quy chuẩn 7 – 10 câu)
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2 rounded-xl border font-black transition-all ${
                    questionCount === num
                      ? 'bg-red-700 text-white border-red-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} câu
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="text-amber-600 font-bold">Phân bổ chuẩn:</span>
            <span>3 Nhận biết (Mức 1) • 4 Thông hiểu (Mức 2) • 3 Vận dụng (Mức 3)</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !lessonTitle}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-extrabold text-sm shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI đang phân tích SGK &amp; tạo câu hỏi...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>AI TẠO BÀI TẬP THEO SGK</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fallback Notice if API key was not configured */}
      {isFallbackNotice && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong>Thông báo trạng thái AI:</strong> Chưa cấu hình khóa API Gemini hoặc lỗi đường truyền.
            Hệ thống đã tự động chuyển đổi sang tạo bộ câu hỏi mẫu chuẩn theo SGK Kết nối tri thức với cuộc sống.
          </div>
        </div>
      )}

      {/* Generated Questions List (Live Preview & Teacher Verification) */}
      {generatedQuestions && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-extrabold text-base text-slate-800">
                Bộ câu hỏi vừa tạo: {lessonTitle} ({generatedQuestions.length} câu)
              </h3>
              <p className="text-xs text-slate-500">
                Giáo viên hãy kiểm tra và duyệt nội dung trước khi giao cho học sinh.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToLibrary}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" /> Lưu vào thư viện
              </button>
              <button
                onClick={() => {
                  handleSaveToLibrary();
                  setCurrentView('assign');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-4 h-4" /> Giao ngay cho lớp
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {generatedQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-xs">
                      Câu {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {q.level === 'nhan_biet' && '🟢 Mức 1: Nhận biết'}
                      {q.level === 'thong_hieu' && '🟡 Mức 2: Thông hiểu'}
                      {q.level === 'van_dung' && '🔴 Mức 3: Vận dụng'}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Đã tạo tự động
                  </span>
                </div>

                <p className="font-bold text-slate-800 text-base">{q.question}</p>

                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, i) => {
                      const isCorrect =
                        String(opt).trim().toLowerCase() ===
                        String(q.correctAnswer).trim().toLowerCase();
                      return (
                        <div
                          key={i}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="w-5 h-5 rounded-md bg-white border flex items-center justify-center font-bold text-[10px]">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                          {isCorrect && (
                            <span className="ml-auto text-emerald-600 font-extrabold">✓ Đúng</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Giải thích học sinh:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
