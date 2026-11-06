import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ExerciseSet, Question } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface QuizRunnerModalProps {
  exerciseSet: ExerciseSet;
  assignmentId?: string | null;
  onClose: () => void;
}

export const QuizRunnerModal: React.FC<QuizRunnerModalProps> = ({
  exerciseSet,
  assignmentId,
  onClose,
}) => {
  const { currentStudent, recordSubmission, assignments } = useApp();
  const assignment = assignments.find((a) => a.id === assignmentId);
  const allowReviewAnswers = assignment ? assignment.allowReviewAnswers : true;

  const questions = exerciseSet.questions.slice(0, exerciseSet.questionCount || 10);
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [checkedState, setCheckedState] = useState<Record<string, { isChecked: boolean; isCorrect: boolean }>>({});
  const [startTime] = useState<string>(new Date().toLocaleString('vi-VN'));
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const currentQ = questions[currentIndex];
  const currentAnswer = userAnswers[currentQ?.id];
  const currentChecked = checkedState[currentQ?.id];

  const handleSelectAnswer = (ans: string) => {
    sound.playClick();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: ans,
    }));
  };

  const handleCheckAnswer = () => {
    if (!currentAnswer && currentAnswer !== 0) return;

    const isCorrect =
      String(currentAnswer).trim().toLowerCase() ===
      String(currentQ.correctAnswer).trim().toLowerCase();

    setCheckedState((prev) => ({
      ...prev,
      [currentQ.id]: { isChecked: true, isCorrect },
    }));

    if (isCorrect) {
      sound.playCorrect();
    } else {
      sound.playWrong();
    }
  };

  const handleRetryQuestion = () => {
    sound.playClick();
    setCheckedState((prev) => ({
      ...prev,
      [currentQ.id]: { isChecked: false, isCorrect: false },
    }));
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleSubmitQuiz = () => {
    // Calculate final results
    let correctCount = 0;
    questions.forEach((q) => {
      const uAns = userAnswers[q.id];
      if (
        uAns !== undefined &&
        String(uAns).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
      ) {
        correctCount += 1;
      }
    });

    const score = Number(((correctCount / totalQuestions) * 10).toFixed(1));
    const wrongCount = totalQuestions - correctCount;

    setFinalScore(score);
    setIsCompleted(true);

    if (score >= 8) {
      sound.playFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    } else {
      sound.playCorrect();
    }

    if (currentStudent) {
      recordSubmission({
        assignmentId: assignmentId || 'self-practice',
        exerciseSetId: exerciseSet.id,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        subject: exerciseSet.subject,
        lessonTitle: exerciseSet.lessonTitle,
        startTime,
        score,
        correctCount,
        wrongCount,
        totalQuestions,
        answers: userAnswers,
        attemptNumber: 1,
        status: 'completed',
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto flex flex-col max-h-[95vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-800 text-white px-5 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏮</span>
            <div>
              <h3 className="font-bold text-lg sm:text-xl line-clamp-1">{exerciseSet.title}</h3>
              <p className="text-xs text-amber-200 flex items-center gap-2">
                <span>{exerciseSet.lessonTitle}</span>
                <span>•</span>
                <span>{exerciseSet.sgkRef}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-amber-900/40 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-200 border border-amber-400/30">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {!isCompleted ? (
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-amber-50/20">
            {/* Progress Bar & Question Counter */}
            <div className="mb-5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  CÂU HỎI {currentIndex + 1} / {totalQuestions}
                </span>
                <span className="text-amber-800 font-medium">
                  {currentQ.level === 'nhan_biet' && '🟢 Mức 1: Nhận biết'}
                  {currentQ.level === 'thong_hieu' && '🟡 Mức 2: Thông hiểu'}
                  {currentQ.level === 'van_dung' && '🔴 Mức 3: Vận dụng'}
                </span>
              </div>
              <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden p-0.5 border border-amber-200">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm mb-6">
              {currentQ.readingPassage && (
                <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-slate-700 text-sm italic whitespace-pre-line leading-relaxed">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1 not-italic">
                    <BookOpen className="w-4 h-4" /> Đoạn đọc tham khảo:
                  </div>
                  {currentQ.readingPassage}
                </div>
              )}

              <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 leading-snug whitespace-pre-line">
                {currentQ.question}
              </h4>

              {currentQ.subText && (
                <p className="text-sm text-slate-500 mb-4">{currentQ.subText}</p>
              )}

              {/* Options based on type */}
              {(currentQ.type === 'multiple_choice' || currentQ.type === 'true_false' || currentQ.type === 'word_choice' || currentQ.type === 'reading_comprehension') && currentQ.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {currentQ.options.map((opt, i) => {
                    const isSelected = userAnswers[currentQ.id] === opt;
                    const isChecked = currentChecked?.isChecked;
                    const isOptCorrect =
                      isChecked &&
                      String(opt).trim().toLowerCase() ===
                        String(currentQ.correctAnswer).trim().toLowerCase();
                    const isOptWrong = isChecked && isSelected && !isOptCorrect;

                    let btnStyle = 'border-slate-200 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-slate-700';
                    if (isSelected && !isChecked) {
                      btnStyle = 'border-amber-500 bg-amber-100/70 text-amber-900 font-bold shadow-sm';
                    } else if (isOptCorrect) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-sm';
                    } else if (isOptWrong) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={currentChecked?.isChecked}
                        onClick={() => handleSelectAnswer(opt)}
                        className={`text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 text-base ${btnStyle}`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Math / text input type */}
              {(currentQ.type === 'math_input' || currentQ.type === 'fill_blank') && (
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    Nhập kết quả hoặc từ còn thiếu của em:
                  </label>
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      disabled={currentChecked?.isChecked}
                      value={userAnswers[currentQ.id] || ''}
                      onChange={(e) => setUserAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))}
                      placeholder="Gõ đáp án ở đây..."
                      className="w-full px-4 py-3 text-lg font-bold text-slate-800 border-2 border-amber-300 rounded-xl focus:outline-none focus:border-red-600 bg-amber-50/30"
                    />
                  </div>
                  {currentQ.options && currentQ.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 items-center">
                      <span className="text-xs text-slate-500">Gợi ý chọn nhanh:</span>
                      {currentQ.options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={currentChecked?.isChecked}
                          onClick={() => handleSelectAnswer(opt)}
                          className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Instant feedback area after checking */}
              {currentChecked?.isChecked && (
                <div
                  className={`mt-5 p-4 rounded-xl border flex items-start gap-3 transition-all ${
                    currentChecked.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  {currentChecked.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h5 className="font-bold text-base">
                      {currentChecked.isCorrect
                        ? '🎉 Hoan hô em! Em trả lời hoàn toàn chính xác!'
                        : '💡 Chưa đúng rồi! Đừng nản lòng nhé!'}
                    </h5>
                    <p className="text-sm mt-1 leading-relaxed">{currentQ.explanation}</p>
                    {!currentChecked.isCorrect && (
                      <div className="mt-2.5 flex items-center gap-3">
                        <button
                          onClick={handleRetryQuestion}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Thử làm lại câu này
                        </button>
                        {allowReviewAnswers && (
                          <span className="text-xs text-slate-600">
                            Đáp án đúng: <strong>{String(currentQ.correctAnswer)}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Question Nav Grid */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {questions.map((q, idx) => {
                  const isAns = userAnswers[q.id] !== undefined && userAnswers[q.id] !== '';
                  const checked = checkedState[q.id];
                  let btnBg = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                  if (idx === currentIndex) {
                    btnBg = 'ring-2 ring-red-600 ring-offset-1 font-extrabold';
                  }
                  if (checked?.isChecked) {
                    btnBg = checked.isCorrect
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-rose-500 text-white font-bold';
                  } else if (isAns) {
                    btnBg = 'bg-amber-400 text-amber-950 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-8 h-8 rounded-lg text-xs transition-all ${btnBg}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: KIỂM TRA – TIẾP THEO – NỘP BÀI */}
              <div className="flex items-center gap-2">
                {!currentChecked?.isChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={userAnswers[currentQ.id] === undefined || userAnswers[currentQ.id] === ''}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-amber-500 text-white font-bold text-sm shadow transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Kiểm tra
                  </button>
                ) : (
                  currentIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentIndex((prev) => prev + 1)}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow transition-all flex items-center gap-1.5"
                    >
                      Câu tiếp theo <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : null
                )}

                {currentIndex === totalQuestions - 1 && (
                  <button
                    onClick={handleSubmitQuiz}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-sm shadow-lg transition-all flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-amber-200" /> Nộp bài thi
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Quiz Results View */
          <div className="p-6 sm:p-8 text-center overflow-y-auto flex-1 bg-gradient-to-b from-amber-50/60 to-white">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center text-4xl shadow-lg border-4 border-amber-200">
              {finalScore >= 9 ? '👑' : finalScore >= 7 ? '⭐' : '📖'}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-1">
              {finalScore >= 9
                ? 'XUẤT SẮC! ĐẠT DANH HIỆU TRẠNG NGUYÊN!'
                : finalScore >= 7
                ? 'HOAN HÔ! KẾT QUẢ RẤT TỐT!'
                : 'CỐ GẮNG LÊN EM NHÉ, TIẾN BỘ MỖI NGÀY!'}
            </h3>

            <p className="text-slate-600 text-sm mb-6">
              Học sinh: <strong className="text-red-700">{currentStudent?.name || 'Học sinh'}</strong> • Lớp 2A
            </p>

            {/* Score Badges */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
              <div className="p-3 bg-white rounded-2xl border-2 border-amber-200 shadow-sm">
                <div className="text-2xl font-black text-red-600">{finalScore}/10</div>
                <div className="text-xs font-semibold text-slate-500">Điểm số</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm">
                <div className="text-2xl font-black text-emerald-600">
                  {Object.values(checkedState).filter((c) => c.isCorrect).length}/{totalQuestions}
                </div>
                <div className="text-xs font-semibold text-slate-500">Số câu đúng</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border-2 border-blue-200 shadow-sm">
                <div className="text-2xl font-black text-blue-600">{formatTime(elapsedSeconds)}</div>
                <div className="text-xs font-semibold text-slate-500">Thời gian làm</div>
              </div>
            </div>

            {/* Reward Notification */}
            <div className="max-w-md mx-auto bg-amber-100/70 border border-amber-300 rounded-2xl p-4 mb-6 text-sm text-amber-900 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
              <div className="text-left">
                <strong>Thưởng sao thi đua:</strong> Em đã được cộng thêm{' '}
                <span className="font-bold text-red-700">+{Math.round(finalScore * 2)} sao</span> vào bảng vàng
                tổ {currentStudent?.team || 'Rồng Vàng'}!
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setUserAnswers({});
                  setCheckedState({});
                  setIsCompleted(false);
                  setCurrentIndex(0);
                }}
                className="px-5 py-2.5 rounded-xl border-2 border-amber-400 text-amber-900 font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Làm lại bài này
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold shadow-md transition-colors flex items-center gap-1.5 text-sm"
              >
                Hoàn thành & Quay lại <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
