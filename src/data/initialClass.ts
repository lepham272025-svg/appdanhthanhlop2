import { Student } from '../types';

export interface ClassConfig {
  className: string;
  grade: number;
  schoolYear: string;
  schoolName: string;
  teacherName: string;
  location: string;
  teams: string[];
}

export const defaultClassConfig: ClassConfig = {
  className: 'Lớp 2A',
  grade: 2,
  schoolYear: '2026–2027',
  schoolName: 'Trường TH-THCS Vĩnh Điều',
  teacherName: 'Danh Thanh',
  location: 'An Giang',
  teams: ['Rồng Vàng', 'Phượng Hoàng', 'Kỳ Lân', 'Rùa Thần'],
};

// Initial student roster: Empty list so the teacher can enter their real classroom students
export const initialStudents: Student[] = [];
