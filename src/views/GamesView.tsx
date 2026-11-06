import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Trophy,
  Sparkles,
  HelpCircle,
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Play,
  Heart,
  Award,
  Flame,
  ArrowRight,
  Shield,
  Key,
} from 'lucide-react';

interface GameItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  badge: string;
  description: string;
}

export const GamesView: React.FC = () => {
  const { exerciseSets, currentStudent, rewardStudentPoint } = useApp();

  const gamesList: GameItem[] = [
    {
      id: 'game-1',
      name: '1. Ai là Trạng Nguyên?',
      icon: '👑',
      color: 'from-amber-600 to-red-700',
      badge: 'Trạng Nguyên Nhí',
      description: 'Chinh phục 8 nấc thang tri thức, sử dụng 2 quyền trợ giúp để giành mũ cánh chuồn Trạng Nguyên!',
    },
    {
      id: 'game-2',
      name: '2. Vòng quay may mắn',
      icon: '🎡',
      color: 'from-pink-500 to-rose-700',
      badge: 'Vòng Quay Trạng Nguyên',
      description: 'Quay vòng quay để nhận điểm số bất ngờ và trả lời câu hỏi thử thách của cụ Rùa!',
    },
    {
      id: 'game-3',
      name: '3. Rồng Vàng vượt ải',
      icon: '🐉',
      color: 'from-yellow-500 to-amber-700',
      badge: 'Chiến Binh Rồng Vàng',
      description: 'Dẫn dắt chú Rồng Vàng vượt qua 5 cửa ải Toán học và Tiếng Việt đầy cam go!',
    },
    {
      id: 'game-4',
      name: '4. Giải cứu vương quốc Toán học',
      icon: '🏰',
      color: 'from-blue-600 to-indigo-800',
      badge: 'Hiệp Sĩ Toán Học',
      description: 'Giải các phép tính nhanh để tích lũy năng lượng phép thuật đẩy lùi quái vật!',
    },
    {
      id: 'game-5',
      name: '5. Ô chữ Tiếng Việt',
      icon: '📝',
      color: 'from-purple-600 to-pink-700',
      badge: 'Bậc Thầy Từ Vựng',
      description: 'Giải các gợi ý để tìm ra các từ khóa Tiếng Việt kỳ diệu trong bảng chữ cái!',
    },
    {
      id: 'game-6',
      name: '6. Ghép cặp thông minh',
      icon: '🧩',
      color: 'from-teal-600 to-emerald-800',
      badge: 'Siêu Trí Nhớ',
      description: 'Ghi nhớ và lật các thẻ bài để ghép đúng phép tính với kết quả hoặc từ ngữ tương ứng!',
    },
    {
      id: 'game-7',
      name: '7. Ai nhanh hơn? (Tia chớp)',
      icon: '⚡',
      color: 'from-orange-500 to-red-600',
      badge: 'Tia Chớp Nhanh Trí',
      description: 'Mỗi câu hỏi có 15 giây đếm ngược. Trả lời thật nhanh để đạt điểm tối đa!',
    },
    {
      id: 'game-8',
      name: '8. Săn kho báu tri thức',
      icon: '💎',
      color: 'from-emerald-500 to-cyan-700',
      badge: 'Nhà Thám Hiểm Trạng Nguyên',
      description: 'Mở 7 hòm kho báu bí ẩn bằng các chìa khóa tri thức chính xác!',
    },
  ];

  // Active game state
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  // Pool of all questions from exercise sets
  const allPoolQuestions = exerciseSets.flatMap((s) => s.questions);
  const gameQuestions = allPoolQuestions.slice(0, 8);

  // Common gameplay state
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [wheelAngle, setWheelAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelReward, setWheelReward] = useState<string | null>(null);
  const [selectedPairLeft, setSelectedPairLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [quickTimer, setQuickTimer] = useState(15);

  const activeQuestion = gameQuestions[qIndex] || gameQuestions[0];

  // Timer for game 7: Ai nhanh hơn
  useEffect(() => {
    if (selectedGameId === 'game-7' && !gameOver && !gameWon) {
      const interval = setInterval(() => {
        setQuickTimer((prev) => {
          if (prev <= 1) {
            handleAnswerChoice('TIME_OUT');
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedGameId, qIndex, gameOver, gameWon]);

  const handleStartGame = (gameId: string) => {
    sound.playClick();
    setSelectedGameId(gameId);
    setQIndex(0);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setWheelReward(null);
    setSelectedPairLeft(null);
    setMatchedPairs([]);
    setQuickTimer(15);
  };

  const handleAnswerChoice = (choice: string) => {
    const isCorrect =
      String(choice).trim().toLowerCase() ===
      String(activeQuestion.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      sound.playCorrect();
      const newScore = score + 10;
      setScore(newScore);

      if (qIndex + 1 >= Math.min(gameQuestions.length, 8)) {
        // Won the game!
        setGameWon(true);
        sound.playFanfare();
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
        if (currentStudent) {
          rewardStudentPoint(currentStudent.id, 20, 'Chiến thắng trò chơi');
        }
      } else {
        setQIndex((prev) => prev + 1);
        setQuickTimer(15);
      }
    } else {
      sound.playWrong();
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameOver(true);
      } else {
        if (qIndex + 1 < gameQuestions.length) {
          setQIndex((prev) => prev + 1);
          setQuickTimer(15);
        } else {
          setGameOver(true);
        }
      }
    }
  };

  // Wheel spin logic for Game 2
  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    sound.playTick();
    const extraRotations = 1440 + Math.floor(Math.random() * 360);
    setWheelAngle((prev) => prev + extraRotations);

    const rewards = ['+20 Sao', '+50 Sao', 'Trợ giúp 50:50', '+1 Mạng sống', 'Nhân đôi điểm', '+100 Sao'];
    const chosen = rewards[Math.floor(Math.random() * rewards.length)];

    setTimeout(() => {
      setIsSpinning(false);
      setWheelReward(chosen);
      sound.playFanfare();
      if (currentStudent && chosen.includes('Sao')) {
        rewardStudentPoint(currentStudent.id, 10, 'Vòng quay may mắn');
      }
    }, 3000);
  };

  // Matching game items
  const matchingPairs = [
    { left: '2 × 5', right: '10' },
    { left: '8 + 7', right: '15' },
    { left: '1 dm', right: '10 cm' },
    { left: '20 l - 8 l', right: '12 l' },
  ];

  const handlePairClick = (item: string, side: 'left' | 'right') => {
    sound.playClick();
    if (side === 'left') {
      setSelectedPairLeft(item);
    } else if (side === 'right' && selectedPairLeft) {
      const match = matchingPairs.find((p) => p.left === selectedPairLeft && p.right === item);
      if (match) {
        sound.playCorrect();
        setMatchedPairs((prev) => [...prev, selectedPairLeft, item]);
        setSelectedPairLeft(null);
        setScore((prev) => prev + 25);
        if (matchedPairs.length + 2 >= matchingPairs.length * 2) {
          setGameWon(true);
          sound.playFanfare();
        }
      } else {
        sound.playWrong();
        setSelectedPairLeft(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Games Header */}
      <div className="rounded-3xl bg-gradient-to-r from-pink-600 via-rose-600 to-red-700 text-white p-6 sm:p-8 shadow-lg border-2 border-pink-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner">
              🎮
            </div>
            <div>
              <span className="bg-amber-300 text-rose-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                Học vui – Chơi hay – Tiến bộ mỗi ngày
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">KHO 8 TRÒ CHƠI HỌC TẬP TƯƠNG TÁC</h1>
              <p className="text-xs sm:text-sm text-pink-100 max-w-2xl mt-1">
                Tích hợp câu hỏi chuẩn SGK Toán 2 và Tiếng Việt 2. Có âm thanh sống động, tính điểm, mạng chơi và bảng vàng vinh danh!
              </p>
            </div>
          </div>

          {selectedGameId && (
            <button
              onClick={() => setSelectedGameId(null)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs sm:text-sm font-bold border border-white/30 transition-colors self-start md:self-auto"
            >
              ← Chọn trò chơi khác
            </button>
          )}
        </div>
      </div>

      {/* Main Game Playing Screen */}
      {selectedGameId ? (
        <div className="bg-white rounded-3xl border-4 border-amber-300 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto">
          {/* Game Top Bar: Score & Lives */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {gamesList.find((g) => g.id === selectedGameId)?.icon}
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-800">
                {gamesList.find((g) => g.id === selectedGameId)?.name}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              {/* Hearts / Lives */}
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((heart) => (
                  <Heart
                    key={heart}
                    className={`w-5 h-5 ${
                      heart <= lives
                        ? 'text-red-500 fill-red-500'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Score */}
              <div className="px-3 py-1 bg-amber-100 text-amber-900 font-black rounded-xl text-sm border border-amber-300 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>{score} điểm</span>
              </div>
            </div>
          </div>

          {/* Gameplay Content Area */}
          {!gameOver && !gameWon ? (
            <div>
              {/* Special Game 2: Lucky Wheel */}
              {selectedGameId === 'game-2' && (
                <div className="text-center py-6">
                  <div className="relative w-56 h-56 mx-auto mb-6">
                    <div
                      className="w-full h-full rounded-full border-8 border-amber-400 shadow-2xl bg-gradient-to-tr from-rose-500 via-amber-400 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl transition-all duration-3000"
                      style={{
                        transform: `rotate(${wheelAngle}deg)`,
                        transitionTimingFunction: 'cubic-bezier(0.1, 0.7, 0.1, 1)',
                      }}
                    >
                      <div className="grid grid-cols-2 w-full h-full p-3 text-center text-xs font-bold text-white drop-shadow">
                        <div className="flex items-center justify-center">⭐ +50 Sao</div>
                        <div className="flex items-center justify-center">🏮 Trạng Nguyên</div>
                        <div className="flex items-center justify-center">💎 +100 Sao</div>
                        <div className="flex items-center justify-center">❤️ +1 Mạng</div>
                      </div>
                    </div>
                    {/* Wheel Pointer */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-8 bg-red-700 clip-triangle shadow-md">
                      ▼
                    </div>
                  </div>

                  <button
                    onClick={handleSpinWheel}
                    disabled={isSpinning}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black text-base shadow-lg disabled:opacity-50 transition-all transform hover:scale-105"
                  >
                    {isSpinning ? 'Đang quay may mắn...' : 'QUAY NGAY! 🎡'}
                  </button>

                  {wheelReward && (
                    <div className="mt-5 p-4 bg-amber-50 border border-amber-300 rounded-2xl max-w-sm mx-auto text-amber-900 font-bold text-sm">
                      🎉 Chúc mừng em đã quay trúng: <span className="text-red-700 font-black">{wheelReward}</span>!
                    </div>
                  )}
                </div>
              )}

              {/* Special Game 6: Matching Cards */}
              {selectedGameId === 'game-6' && (
                <div className="py-4">
                  <p className="text-xs text-slate-500 text-center mb-4">
                    Nhấp vào ô phép tính bên trái, rồi nhấp vào ô kết quả tương ứng bên phải!
                  </p>
                  <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    {/* Left Column */}
                    <div className="space-y-3">
                      {matchingPairs.map((p, idx) => {
                        const isMatched = matchedPairs.includes(p.left);
                        const isSelected = selectedPairLeft === p.left;
                        return (
                          <button
                            key={idx}
                            disabled={isMatched}
                            onClick={() => handlePairClick(p.left, 'left')}
                            className={`w-full p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                              isMatched
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 opacity-60'
                                : isSelected
                                ? 'bg-amber-200 border-amber-500 text-amber-900 shadow-md'
                                : 'bg-white border-slate-200 hover:border-amber-400 text-slate-800'
                            }`}
                          >
                            {p.left} {isMatched && '✓'}
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column (shuffled) */}
                    <div className="space-y-3">
                      {['15', '10', '12 l', '10 cm'].map((item, idx) => {
                        const isMatched = matchedPairs.includes(item);
                        return (
                          <button
                            key={idx}
                            disabled={isMatched}
                            onClick={() => handlePairClick(item, 'right')}
                            className={`w-full p-4 rounded-xl border-2 font-bold text-sm transition-all ${
                              isMatched
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 opacity-60'
                                : 'bg-white border-slate-200 hover:border-amber-400 text-slate-800'
                            }`}
                          >
                            {item} {isMatched && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Standard Question Runner for other games */}
              {selectedGameId !== 'game-2' && selectedGameId !== 'game-6' && (
                <div>
                  {/* Timer for speed game */}
                  {selectedGameId === 'game-7' && (
                    <div className="flex items-center justify-center gap-2 mb-4 text-rose-600 font-extrabold text-sm">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Thời gian còn: {quickTimer} giây!</span>
                    </div>
                  )}

                  <div className="text-xs font-bold text-slate-500 mb-2">
                    CÂU HỎI THỬ THÁCH {qIndex + 1} / 8 • {activeQuestion.lessonTitle}
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-slate-800 mb-6 leading-snug">
                    {activeQuestion.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeQuestion.options || ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D']).map(
                      (opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswerChoice(opt)}
                          className="p-4 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:bg-amber-50/50 text-slate-800 text-left font-semibold text-sm transition-all flex items-center gap-3 shadow-sm"
                        >
                          <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : gameWon ? (
            /* Victory Screen */
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-red-600 flex items-center justify-center text-4xl shadow-lg border-4 border-amber-200 animate-bounce">
                👑
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
                CHIẾN THẮNG TRẠNG NGUYÊN!
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Em đã vượt qua tất cả các thử thách xuất sắc và giành được{' '}
                <strong className="text-red-700">{score} điểm</strong>!
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleStartGame(selectedGameId)}
                  className="px-5 py-2.5 rounded-xl border-2 border-amber-400 text-amber-900 font-bold hover:bg-amber-100 transition-colors flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Chơi lại trò này
                </button>
                <button
                  onClick={() => setSelectedGameId(null)}
                  className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold shadow-md transition-colors text-sm"
                >
                  Chọn trò chơi khác
                </button>
              </div>
            </div>
          ) : (
            /* Game Over Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                🛡️
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-1">CỐ GẮNG LẦN SAU NHÉ!</h3>
              <p className="text-sm text-slate-600 mb-6">
                Em đã đạt được <strong className="text-red-700">{score} điểm</strong>. Hãy thử lại để giành mũ Trạng Nguyên!
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleStartGame(selectedGameId)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Thử sức lại
                </button>
                <button
                  onClick={() => setSelectedGameId(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition-colors text-sm"
                >
                  Trò chơi khác
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Games Directory Grid (8 Games) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gamesList.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-pink-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-50 to-amber-50 border border-pink-200 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {g.icon}
                </div>
                <div className="inline-block px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-bold uppercase mb-2">
                  {g.badge}
                </div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-pink-600 transition-colors leading-snug">
                  {g.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {g.description}
                </p>
              </div>

              <button
                onClick={() => handleStartGame(g.id)}
                className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Bắt đầu chơi ngay</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
