import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Calculator,
  Layers,
  Gamepad2,
  Sparkles,
  Send,
  Users,
  Trophy,
  Bot,
  Library,
  BarChart3,
  Home,
  Volume2,
  VolumeX,
  Smartphone,
  UserCheck,
  GraduationCap,
  Menu,
  X,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    currentStudent,
    setCurrentStudentId,
    students,
    isMuted,
    toggleMute,
    isMobilePreview,
    setIsMobilePreview,
    currentView,
    setCurrentView,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home, color: 'text-amber-800' },
    { id: 'math', label: 'Toán học 2', icon: Calculator, color: 'text-blue-600' },
    { id: 'vietnamese', label: 'Tiếng Việt 2', icon: BookOpen, color: 'text-purple-600' },
    { id: 'exercises', label: 'Kho bài tập', icon: Layers, color: 'text-emerald-600' },
    { id: 'games', label: 'Kho trò chơi', icon: Gamepad2, color: 'text-pink-600' },
    { id: 'ai-gen', label: 'AI tạo bài tập', icon: Sparkles, color: 'text-amber-600' },
    { id: 'assign', label: 'Giao bài tập', icon: Send, color: 'text-indigo-600' },
    { id: 'class-manage', label: 'Quản lý lớp', icon: Users, color: 'text-teal-600' },
    { id: 'honor-roll', label: 'Bảng vàng', icon: Trophy, color: 'text-yellow-600' },
    { id: 'chatbot', label: 'Bạn Học AI', icon: Bot, color: 'text-cyan-600' },
    { id: 'library', label: 'Thư viện', icon: Library, color: 'text-rose-600' },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3, color: 'text-slate-700' },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-md border-b-2 border-amber-300">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-red-800 via-amber-600 to-red-800 text-white px-3 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-center md:text-left flex-wrap justify-center">
            <span className="bg-amber-400 text-red-900 font-extrabold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
              Năm học 2026–2027
            </span>
            <span className="font-semibold text-amber-100">
              Tác giả: <strong>DANH THANH</strong> • Trường TH-THCS Vĩnh Điều – An Giang
            </span>
            <span className="hidden lg:inline text-amber-300">• Bộ sách Kết nối tri thức với cuộc sống</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="italic font-bold text-amber-200 text-xs hidden sm:inline">
              "HỌC VUI – CHƠI HAY – TIẾN BỘ MỖI NGÀY"
            </span>
            
            {/* Quick Action Toggles */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                className="p-1 rounded-full bg-amber-900/60 hover:bg-amber-900 text-amber-200 transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsMobilePreview(!isMobilePreview)}
                title="Xem thử giao diện điện thoại của học sinh"
                className={`p-1 rounded-full transition-colors ${
                  isMobilePreview ? 'bg-amber-300 text-red-950 font-bold' : 'bg-amber-900/60 hover:bg-amber-900 text-amber-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-700 via-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <span className="text-2xl">🏮</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl text-red-800 tracking-tight font-display">
                TRẠNG NGUYÊN AI 2.0
              </span>
              <span className="bg-red-100 text-red-800 border border-red-300 text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase">
                Lớp 2
              </span>
            </div>
            <p className="text-[11px] text-amber-800 font-bold hidden sm:block">
              Hệ sinh thái học tập tương tác Toán & Tiếng Việt Lớp 2
            </p>
          </div>
        </div>

        {/* Role Switcher & Student Selector */}
        <div className="flex items-center gap-2">
          {role === 'student' && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-base">{currentStudent?.avatar || '👦'}</span>
              <select
                value={currentStudent?.id || ''}
                onChange={(e) => setCurrentStudentId(e.target.value)}
                className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {students.length > 0 ? (
                  students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.team})
                    </option>
                  ))
                ) : (
                  <option value="">(Chưa có học sinh)</option>
                )}
              </select>
            </div>
          )}

          {/* Teacher / Student Role Toggle Pill */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-300 shadow-inner">
            <button
              onClick={() => setRole('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                role === 'teacher'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Giáo viên</span>
            </button>
            <button
              onClick={() => setRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                role === 'student'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Học sinh</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-amber-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop 12 Navigation Items Bar */}
      <nav className="hidden lg:block border-t border-amber-200/80 bg-amber-50/60 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-amber-200/70 hover:text-red-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-amber-200 px-4 py-3 shadow-xl max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-red-700 text-white shadow'
                      : 'bg-amber-50/80 text-slate-800 hover:bg-amber-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : item.color}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
