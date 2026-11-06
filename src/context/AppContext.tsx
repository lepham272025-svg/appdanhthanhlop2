import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  ExerciseSet,
  Assignment,
  Submission,
  UserRole,
  SubjectType,
  Question,
} from '../types';
import { initialStudents, defaultClassConfig, ClassConfig } from '../data/initialClass';
import { initialMathExerciseSets } from '../data/mathCurriculum';
import { initialVietnameseExerciseSets } from '../data/vietnameseCurriculum';
import { sound } from '../utils/audio';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentStudentId: string;
  setCurrentStudentId: (id: string) => void;
  currentStudent: Student | undefined;
  classConfig: ClassConfig;
  updateClassConfig: (config: Partial<ClassConfig>) => void;
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'code' | 'points' | 'badges' | 'completedCount' | 'averageScore' | 'attendanceToday'>) => void;
  addMultipleStudents: (names: string[], defaultTeam?: string) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  clearAllStudents: () => void;
  rewardStudentPoint: (id: string, amount: number, reason?: string) => void;
  
  exerciseSets: ExerciseSet[];
  addExerciseSet: (set: ExerciseSet) => void;
  deleteExerciseSet: (id: string) => void;

  assignments: Assignment[];
  createAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'status'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  submissions: Submission[];
  recordSubmission: (submission: Omit<Submission, 'id' | 'submittedTime'>) => void;

  // Active quiz modal state
  activeQuizSet: ExerciseSet | null;
  activeAssignmentId: string | null;
  startQuiz: (set: ExerciseSet, assignmentId?: string) => void;
  closeQuiz: () => void;

  // Sound & Preview
  isMuted: boolean;
  toggleMute: () => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (preview: boolean) => void;

  // Navigation
  currentView: string;
  setCurrentView: (view: string) => void;
  
  // Notification toast
  notification: string | null;
  showToast: (msg: string) => void;

  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'trang_nguyen_2_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('teacher');
  const [currentView, setCurrentView] = useState<string>('home');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Active Quiz Modal
  const [activeQuizSet, setActiveQuizSet] = useState<ExerciseSet | null>(null);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(null);

  // Class config
  const [classConfig, setClassConfig] = useState<ClassConfig>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}class_config`);
    return saved ? JSON.parse(saved) : defaultClassConfig;
  });

  // Students roster (starts empty as requested: mock students removed)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}students`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialStudents;
      }
    }
    return initialStudents;
  });

  // Currently logged-in student in student mode
  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    return students[0]?.id || '';
  });

  // Exercise sets (Math + Vietnamese + AI custom)
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}exercise_sets`);
    if (saved) return JSON.parse(saved);
    return [...initialMathExerciseSets, ...initialVietnameseExerciseSets];
  });

  // Assignments
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}assignments`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'assign-1',
        title: 'Bài tập tuần 1: Ôn tập các số đến 100',
        exerciseSetId: 'math-ex-1',
        subject: 'math',
        lessonTitle: 'Ôn tập các số đến 100',
        questionCount: 10,
        assignedTo: 'all',
        dueDate: '2026-11-20',
        allowReviewAnswers: true,
        shuffleQuestions: false,
        createdAt: '2026-11-01',
        status: 'active',
      },
      {
        id: 'assign-2',
        title: 'Luyện đọc & Từ chỉ sự vật: Tôi là học sinh lớp 2',
        exerciseSetId: 'tv-ex-1',
        subject: 'vietnamese',
        lessonTitle: 'Tôi là học sinh lớp 2',
        questionCount: 10,
        assignedTo: 'all',
        dueDate: '2026-11-22',
        allowReviewAnswers: true,
        shuffleQuestions: false,
        createdAt: '2026-11-02',
        status: 'active',
      },
    ];
  });

  // Submissions history
  const [submissions, setSubmissions] = useState<Submission[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}submissions`);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sub-1',
        assignmentId: 'assign-1',
        exerciseSetId: 'math-ex-1',
        studentId: 'hs-01',
        studentName: 'Nguyễn Văn An',
        subject: 'math',
        lessonTitle: 'Ôn tập các số đến 100',
        startTime: '2026-11-03 14:00',
        submittedTime: '2026-11-03 14:15',
        score: 10,
        correctCount: 10,
        wrongCount: 0,
        totalQuestions: 10,
        answers: {},
        attemptNumber: 1,
        status: 'completed',
      },
      {
        id: 'sub-2',
        assignmentId: 'assign-1',
        exerciseSetId: 'math-ex-1',
        studentId: 'hs-02',
        studentName: 'Trần Thị Mai Anh',
        subject: 'math',
        lessonTitle: 'Ôn tập các số đến 100',
        startTime: '2026-11-03 15:10',
        submittedTime: '2026-11-03 15:24',
        score: 10,
        correctCount: 10,
        wrongCount: 0,
        totalQuestions: 10,
        answers: {},
        attemptNumber: 1,
        status: 'completed',
      },
      {
        id: 'sub-3',
        assignmentId: 'assign-1',
        exerciseSetId: 'math-ex-1',
        studentId: 'hs-06',
        studentName: 'Đặng Thùy Dương',
        subject: 'math',
        lessonTitle: 'Ôn tập các số đến 100',
        startTime: '2026-11-03 16:00',
        submittedTime: '2026-11-03 16:12',
        score: 10,
        correctCount: 10,
        wrongCount: 0,
        totalQuestions: 10,
        answers: {},
        attemptNumber: 1,
        status: 'completed',
      },
      {
        id: 'sub-4',
        assignmentId: 'assign-2',
        exerciseSetId: 'tv-ex-1',
        studentId: 'hs-01',
        studentName: 'Nguyễn Văn An',
        subject: 'vietnamese',
        lessonTitle: 'Tôi là học sinh lớp 2',
        startTime: '2026-11-04 19:00',
        submittedTime: '2026-11-04 19:16',
        score: 9,
        correctCount: 9,
        wrongCount: 1,
        totalQuestions: 10,
        answers: {},
        attemptNumber: 1,
        status: 'completed',
      },
    ];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}class_config`, JSON.stringify(classConfig));
  }, [classConfig]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}students`, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}exercise_sets`, JSON.stringify(exerciseSets));
  }, [exerciseSets]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}assignments`, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}submissions`, JSON.stringify(submissions));
  }, [submissions]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    showToast(next ? 'Đã tắt âm thanh' : 'Đã bật âm thanh');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    sound.playClick();
    if (newRole === 'student') {
      showToast(`Chào mừng em ${currentStudent?.name || 'học sinh'} đến với Lớp học kiến tạo!`);
    } else {
      showToast('Đã chuyển sang quyền Giáo viên chủ nhiệm');
    }
  };

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];

  const updateClassConfig = (updates: Partial<ClassConfig>) => {
    setClassConfig((prev) => ({ ...prev, ...updates }));
    showToast('Đã lưu cấu hình lớp học');
  };

  const addStudent = (data: Omit<Student, 'id' | 'code' | 'points' | 'badges' | 'completedCount' | 'averageScore' | 'attendanceToday'>) => {
    const count = students.length + 1;
    const code = `HS${count < 10 ? '0' : ''}${count}`;
    const newStudent: Student = {
      id: `hs-${Date.now()}`,
      code,
      ...data,
      points: 50,
      badges: ['Thành viên mới'],
      completedCount: 0,
      averageScore: 0,
      attendanceToday: 'present',
    };
    setStudents((prev) => {
      const updated = [...prev, newStudent];
      if (!currentStudentId) {
        setCurrentStudentId(newStudent.id);
      }
      return updated;
    });
    sound.playCorrect();
    showToast(`Đã thêm học sinh ${newStudent.name}`);
  };

  const addMultipleStudents = (names: string[], defaultTeam?: string) => {
    const validNames = names.map((n) => n.trim()).filter((n) => n.length > 0);
    if (validNames.length === 0) return;

    const teams = classConfig.teams;
    const newStudents: Student[] = validNames.map((name, i) => {
      const count = students.length + i + 1;
      const code = `HS${count < 10 ? '0' : ''}${count}`;
      const assignedTeam = (defaultTeam && defaultTeam !== 'auto' ? defaultTeam : teams[i % teams.length]) as any;
      return {
        id: `hs-${Date.now()}-${i}`,
        code,
        name,
        gender: i % 2 === 0 ? 'nam' : 'nu',
        team: assignedTeam,
        avatar: i % 2 === 0 ? '👦' : '👧',
        points: 50,
        badges: ['Trạng Nguyên Mới'],
        completedCount: 0,
        averageScore: 0,
        attendanceToday: 'present',
      };
    });

    setStudents((prev) => {
      const updated = [...prev, ...newStudents];
      if (!currentStudentId && updated.length > 0) {
        setCurrentStudentId(updated[0].id);
      }
      return updated;
    });

    sound.playCorrect();
    showToast(`Đã thêm thành công ${newStudents.length} học sinh vào lớp!`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Đã cập nhật thông tin học sinh');
  };

  const deleteStudent = (id: string) => {
    const s = students.find((item) => item.id === id);
    if (confirm(`Bạn có chắc muốn xóa học sinh "${s?.name || ''}" khỏi lớp?`)) {
      setStudents((prev) => {
        const next = prev.filter((item) => item.id !== id);
        if (currentStudentId === id) {
          setCurrentStudentId(next[0]?.id || '');
        }
        return next;
      });
      sound.playClick();
      showToast(`Đã xóa học sinh thành công`);
    }
  };

  const clearAllStudents = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ học sinh hiện tại để tạo danh sách học sinh mới?')) {
      setStudents([]);
      setCurrentStudentId('');
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}students`);
      localStorage.removeItem('trang_nguyen_2_students');
      sound.playClick();
      showToast('Đã xóa tất cả học sinh. Danh sách hiện đang trống.');
    }
  };

  const rewardStudentPoint = (id: string, amount: number, reason?: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newPts = Math.max(0, s.points + amount);
          return { ...s, points: newPts };
        }
        return s;
      })
    );
    sound.playCorrect();
    showToast(`Đã ${amount > 0 ? 'thưởng' : 'trừ'} ${Math.abs(amount)} sao cho học sinh ${reason ? `(${reason})` : ''}`);
  };

  const addExerciseSet = (set: ExerciseSet) => {
    setExerciseSets((prev) => [set, ...prev]);
    showToast(`Đã thêm bộ bài tập "${set.title}" vào kho học liệu`);
  };

  const deleteExerciseSet = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bộ bài tập này?')) {
      setExerciseSets((prev) => prev.filter((s) => s.id !== id));
      showToast('Đã xóa bộ bài tập');
    }
  };

  const createAssignment = (data: Omit<Assignment, 'id' | 'createdAt' | 'status'>) => {
    const newAssign: Assignment = {
      ...data,
      id: `assign-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setAssignments((prev) => [newAssign, ...prev]);
    sound.playCorrect();
    showToast(`Đã giao bài tập thành công cho học sinh!`);
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Đã cập nhật bài tập đã giao');
  };

  const deleteAssignment = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa bài tập đã giao này?')) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      showToast('Đã xóa bài giao');
    }
  };

  const recordSubmission = (subData: Omit<Submission, 'id' | 'submittedTime'>) => {
    const newSub: Submission = {
      ...subData,
      id: `sub-${Date.now()}`,
      submittedTime: new Date().toLocaleString('vi-VN'),
    };
    setSubmissions((prev) => [newSub, ...prev]);

    // Update student's completedCount and points and averageScore
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === subData.studentId) {
          const newCompleted = s.completedCount + 1;
          const pointBonus = Math.round(subData.score * 2);
          const currentTotal = s.averageScore * s.completedCount;
          const newAvg = Number(((currentTotal + subData.score) / newCompleted).toFixed(1));
          return {
            ...s,
            completedCount: newCompleted,
            points: s.points + pointBonus,
            averageScore: newAvg,
          };
        }
        return s;
      })
    );

    showToast(`Đã lưu kết quả bài làm: ${subData.score}/10 điểm!`);
  };

  const startQuiz = (set: ExerciseSet, assignmentId?: string) => {
    setActiveQuizSet(set);
    setActiveAssignmentId(assignmentId || null);
    sound.playClick();
  };

  const closeQuiz = () => {
    setActiveQuizSet(null);
    setActiveAssignmentId(null);
  };

  const resetToDefaults = () => {
    if (confirm('Khôi phục toàn bộ dữ liệu ban đầu của Trạng Nguyên AI 2.0?')) {
      localStorage.clear();
      setClassConfig(defaultClassConfig);
      setStudents(initialStudents);
      setExerciseSets([...initialMathExerciseSets, ...initialVietnameseExerciseSets]);
      setRoleState('teacher');
      setCurrentView('home');
      showToast('Đã khôi phục dữ liệu ban đầu');
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentStudentId,
        setCurrentStudentId,
        currentStudent,
        classConfig,
        updateClassConfig,
        students,
        addStudent,
        addMultipleStudents,
        updateStudent,
        deleteStudent,
        clearAllStudents,
        rewardStudentPoint,
        exerciseSets,
        addExerciseSet,
        deleteExerciseSet,
        assignments,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        submissions,
        recordSubmission,
        activeQuizSet,
        activeAssignmentId,
        startQuiz,
        closeQuiz,
        isMuted,
        toggleMute,
        isMobilePreview,
        setIsMobilePreview,
        currentView,
        setCurrentView,
        notification,
        showToast,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
