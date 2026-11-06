export type SubjectType = 'math' | 'vietnamese';
export type SemesterType = 1 | 2;
export type CognitiveLevel = 'nhan_biet' | 'thong_hieu' | 'van_dung';

export type QuestionType =
  | 'multiple_choice'    // Trắc nghiệm 4 đáp án
  | 'true_false'          // Đúng - sai
  | 'fill_blank'          // Điền khuyết
  | 'drag_drop'           // Kéo thả / Sắp xếp thứ tự
  | 'match_pair'          // Nối cặp
  | 'visual_choice'       // Chọn hình ảnh / biểu tượng đúng
  | 'math_input'          // Nhập kết quả phép tính
  | 'word_choice'         // Chọn từ thích hợp
  | 'reading_comprehension'; // Đọc hiểu và trả lời câu hỏi

export interface Question {
  id: string;
  subject: SubjectType;
  semester: SemesterType;
  topicId: string;
  topicName: string;
  lessonId: string;
  lessonTitle: string;
  level: CognitiveLevel;
  type: QuestionType;
  question: string;
  subText?: string;
  options?: string[]; // 4 options for multiple choice or true/false
  correctAnswer: string | number | string[];
  explanation: string;
  hint?: string;
  sgkRef: string; // e.g. "Toán 2 - Tập 1, Trang 8 (Bộ KNTT)"
  isVerified: boolean;
  pairs?: { left: string; right: string }[];
  itemsToOrder?: string[];
  readingPassage?: string;
}

export interface ExerciseSet {
  id: string;
  title: string;
  subject: SubjectType;
  semester: SemesterType;
  topicId: string;
  topicName: string;
  lessonId: string;
  lessonTitle: string;
  type: 'basic' | 'reinforce' | 'game_review';
  questionCount: number; // 7, 8, 9, or 10
  questions: Question[];
  sgkRef: string;
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  topicId: string;
  topicName: string;
  semester: SemesterType;
  subject: SubjectType;
  pageNumber?: number;
  hasExercises: boolean;
  exerciseSetCount: number;
  summary: string;
  sgkRef: string;
}

export interface Topic {
  id: string;
  number: number;
  title: string;
  semester: SemesterType;
  subject: SubjectType;
  lessons: Lesson[];
  theme?: string;
}

export interface Student {
  id: string;
  name: string;
  code: string;
  gender: 'nam' | 'nu';
  team: 'Rồng Vàng' | 'Phượng Hoàng' | 'Kỳ Lân' | 'Rùa Thần';
  avatar: string;
  points: number;
  badges: string[];
  completedCount: number;
  averageScore: number;
  notes?: string;
  attendanceToday: 'present' | 'absent' | 'excused';
}

export interface Assignment {
  id: string;
  title: string;
  exerciseSetId: string;
  subject: SubjectType;
  lessonTitle: string;
  questionCount: number;
  assignedTo: 'all' | 'team' | 'individual';
  targetTeam?: string;
  targetStudentIds?: string[];
  dueDate: string;
  allowReviewAnswers: boolean;
  shuffleQuestions: boolean;
  createdAt: string;
  status: 'active' | 'completed' | 'expired';
}

export interface Submission {
  id: string;
  assignmentId: string;
  exerciseSetId: string;
  studentId: string;
  studentName: string;
  subject: SubjectType;
  lessonTitle: string;
  startTime: string;
  submittedTime: string;
  score: number; // 0 - 10
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  answers: Record<string, any>;
  attemptNumber: number;
  status: 'completed' | 'in_progress';
}

export type UserRole = 'teacher' | 'student';
