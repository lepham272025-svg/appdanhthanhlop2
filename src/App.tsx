import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuizRunnerModal } from './components/QuizRunnerModal';
import { HomeView } from './views/HomeView';
import { MathView } from './views/MathView';
import { VietnameseView } from './views/VietnameseView';
import { InteractiveExercisesView } from './views/InteractiveExercisesView';
import { GamesView } from './views/GamesView';
import { AIGeneratorView } from './views/AIGeneratorView';
import { AssignExerciseView } from './views/AssignExerciseView';
import { ClassManagementView } from './views/ClassManagementView';
import { HonorRollView } from './views/HonorRollView';
import { ChatbotView } from './views/ChatbotView';
import { LearningLibraryView } from './views/LearningLibraryView';
import { ReportsView } from './views/ReportsView';
import { StudentPortalView } from './views/StudentPortalView';
import { Bot, Smartphone, RotateCcw } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    role,
    currentView,
    setCurrentView,
    activeQuizSet,
    activeAssignmentId,
    closeQuiz,
    isMobilePreview,
    setIsMobilePreview,
    notification,
    resetToDefaults,
  } = useApp();

  const renderCurrentView = () => {
    // If student role is active and user didn't explicitly pick another view, default to student-portal
    if (role === 'student' && currentView === 'home') {
      return <StudentPortalView />;
    }

    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'math':
        return <MathView />;
      case 'vietnamese':
        return <VietnameseView />;
      case 'exercises':
        return <InteractiveExercisesView />;
      case 'games':
        return <GamesView />;
      case 'ai-gen':
        return <AIGeneratorView />;
      case 'assign':
        return <AssignExerciseView />;
      case 'class-manage':
        return <ClassManagementView />;
      case 'honor-roll':
        return <HonorRollView />;
      case 'chatbot':
        return <ChatbotView />;
      case 'library':
        return <LearningLibraryView />;
      case 'reports':
        return <ReportsView />;
      case 'student-portal':
        return <StudentPortalView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800">
      <Header />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-6">
        {isMobilePreview ? (
          /* Mobile Phone Frame Simulator for Teacher */
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-500">
              <Smartphone className="w-4 h-4 text-red-700" />
              <span>Chế độ mô phỏng màn hình điện thoại học sinh (iPhone / Android)</span>
              <button
                onClick={() => setIsMobilePreview(false)}
                className="ml-2 text-xs text-red-700 underline font-semibold hover:text-red-900"
              >
                Tắt xem thử
              </button>
            </div>
            <div className="w-[380px] max-w-full h-[760px] bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col overflow-hidden">
              {/* Phone Notch */}
              <div className="w-32 h-5 bg-slate-900 rounded-b-2xl mx-auto z-20 shrink-0"></div>
              {/* Screen Body */}
              <div className="flex-1 bg-amber-50/50 rounded-[32px] overflow-y-auto p-3 text-slate-800">
                {renderCurrentView()}
              </div>
            </div>
          </div>
        ) : (
          renderCurrentView()
        )}
      </main>

      {/* Active Quiz Runner Modal */}
      {activeQuizSet && (
        <QuizRunnerModal
          exerciseSet={activeQuizSet}
          assignmentId={activeAssignmentId}
          onClose={closeQuiz}
        />
      )}

      {/* Floating Chatbot Shortcut Button */}
      {currentView !== 'chatbot' && (
        <button
          onClick={() => setCurrentView('chatbot')}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-extrabold shadow-xl flex items-center gap-2 transform hover:scale-105 transition-all text-xs sm:text-sm border-2 border-white"
        >
          <span className="text-xl animate-bounce">🤖</span>
          <span className="hidden sm:inline">Hỏi Bạn Học AI</span>
        </button>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-amber-200 font-bold text-xs sm:text-sm shadow-2xl border-2 border-amber-400 flex items-center gap-2 animate-float">
          <span>🏮</span>
          <span>{notification}</span>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
