import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { sound } from '../utils/audio';
import {
  Users,
  Plus,
  Star,
  UserCheck,
  UserX,
  Award,
  Edit2,
  Trash2,
  Check,
  Shield,
  Settings,
  Flame,
  Search,
  FileSpreadsheet,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';

export const ClassManagementView: React.FC = () => {
  const {
    students,
    addStudent,
    addMultipleStudents,
    updateStudent,
    deleteStudent,
    clearAllStudents,
    rewardStudentPoint,
    classConfig,
    updateClassConfig,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Single Student Form State
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'nam' | 'nu'>('nam');
  const [newTeam, setNewTeam] = useState<'Rồng Vàng' | 'Phượng Hoàng' | 'Kỳ Lân' | 'Rùa Thần'>('Rồng Vàng');
  const [newNotes, setNewNotes] = useState('');

  // Bulk Add Form State
  const [bulkNamesText, setBulkNamesText] = useState('');
  const [bulkTeamChoice, setBulkTeamChoice] = useState<string>('auto'); // 'auto' or specific team

  // Class Config Edit State
  const [editClassName, setEditClassName] = useState(classConfig.className);
  const [editSchoolName, setEditSchoolName] = useState(classConfig.schoolName);
  const [editTeacherName, setEditTeacherName] = useState(classConfig.teacherName);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeamFilter === 'all' || s.team === selectedTeamFilter;
    return matchesSearch && matchesTeam;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addStudent({
      name: newName.trim(),
      gender: newGender,
      team: newTeam,
      avatar: newGender === 'nam' ? '👦' : '👧',
      notes: newNotes,
    });

    setNewName('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleBulkAddStudents = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkNamesText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      showToast('Vui lòng nhập ít nhất một họ tên học sinh');
      return;
    }

    addMultipleStudents(lines, bulkTeamChoice);
    setBulkNamesText('');
    setShowBulkAddModal(false);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateClassConfig({
      className: editClassName,
      schoolName: editSchoolName,
      teacherName: editTeacherName,
    });
    setShowConfigModal(false);
  };

  const toggleAttendance = (id: string, current: 'present' | 'absent' | 'excused') => {
    sound.playClick();
    const nextStatus = current === 'present' ? 'absent' : current === 'absent' ? 'excused' : 'present';
    updateStudent(id, { attendanceToday: nextStatus });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedStudentIds.length === 0) return;
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa ${selectedStudentIds.length} học sinh đã chọn khỏi danh sách lớp?`
      )
    ) {
      selectedStudentIds.forEach((id) => deleteStudent(id));
      setSelectedStudentIds([]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Class Management Header */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-cyan-700 to-teal-900 text-white p-6 sm:p-8 shadow-lg border-2 border-teal-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur text-white flex items-center justify-center font-black text-3xl shadow-inner">
              🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-300 text-teal-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                  {classConfig.className} • Năm học {classConfig.schoolYear}
                </span>
                <span className="text-xs text-teal-200">{classConfig.schoolName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">QUẢN LÝ LỚP HỌC &amp; HỌC SINH</h1>
              <p className="text-xs sm:text-sm text-teal-100 max-w-2xl mt-1">
                Giáo viên chủ nhiệm: <strong>{classConfig.teacherName}</strong>. Sĩ số lớp hiện tại:{' '}
                <strong className="text-amber-300 font-extrabold">{students.length} học sinh</strong>. Thầy/Cô có thể tự do thêm từng học sinh, dán danh sách nhanh hoặc xóa học sinh theo thực tế lớp.
              </p>
            </div>
          </div>

          {/* Action Buttons Top Bar */}
          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            {/* Nút Thêm học sinh */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>

            {/* Nút Nhập danh sách nhanh (Excel/Word) */}
            <button
              onClick={() => setShowBulkAddModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Nhập từ Excel/Word</span>
            </button>

            {/* Nút Xóa tất cả học sinh (nếu danh sách có người) */}
            {students.length > 0 && (
              <button
                onClick={clearAllStudents}
                title="Xóa tất cả học sinh để tạo danh sách lớp mới"
                className="px-3 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Xóa tất cả</span>
              </button>
            )}

            {/* Cấu hình lớp */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs border border-white/30 transition-colors flex items-center gap-1"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Teams Quick Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {classConfig.teams.map((teamName) => {
          const teamStudents = students.filter((s) => s.team === teamName);
          const totalPoints = teamStudents.reduce((acc, s) => acc + s.points, 0);
          const presentCount = teamStudents.filter((s) => s.attendanceToday === 'present').length;

          let badgeIcon = '🐉';
          let borderCol = 'border-amber-300';
          if (teamName === 'Phượng Hoàng') {
            badgeIcon = '🦅';
            borderCol = 'border-rose-300';
          } else if (teamName === 'Kỳ Lân') {
            badgeIcon = '🦄';
            borderCol = 'border-purple-300';
          } else if (teamName === 'Rùa Thần') {
            badgeIcon = '🐢';
            borderCol = 'border-emerald-300';
          }

          return (
            <div
              key={teamName}
              onClick={() => setSelectedTeamFilter(selectedTeamFilter === teamName ? 'all' : teamName)}
              className={`p-4 rounded-2xl bg-white border-2 ${borderCol} shadow-sm hover:shadow-md transition-all cursor-pointer ${
                selectedTeamFilter === teamName ? 'ring-2 ring-teal-600' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{badgeIcon}</span>
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {totalPoints} ⭐
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-800">Tổ: {teamName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {teamStudents.length} học sinh • {presentCount} có mặt
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter, Search & Batch Actions Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          <button
            onClick={() => setSelectedTeamFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedTeamFilter === 'all'
                ? 'bg-teal-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả ({students.length})
          </button>
          {classConfig.teams.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTeamFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedTeamFilter === t
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t} ({students.filter((s) => s.team === t).length})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {selectedStudentIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa {selectedStudentIds.length} em đã chọn</span>
            </button>
          )}

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên học sinh, mã số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Empty State when no students are in the class */}
      {students.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-teal-300 p-8 sm:p-12 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-teal-50 border-2 border-teal-200 text-teal-700 flex items-center justify-center text-4xl shadow-inner">
            👨‍🏫
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
            Danh sách lớp chưa có học sinh
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-6 leading-relaxed">
            Thầy/Cô hãy thêm danh sách học sinh thực tế của lớp {classConfig.className} ({classConfig.schoolYear}) để bắt đầu giao bài tập, tổ chức trò chơi và vinh danh Trạng Nguyên!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-teal-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Thêm từng học sinh</span>
            </button>

            <button
              onClick={() => setShowBulkAddModal(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Dán danh sách từ Excel/Word</span>
            </button>
          </div>
        </div>
      ) : (
        /* Students Table */
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredStudents.length > 0 &&
                        selectedStudentIds.length === filteredStudents.length
                      }
                      onChange={handleSelectAll}
                      title="Chọn tất cả"
                    />
                  </th>
                  <th className="p-3.5">Học sinh</th>
                  <th className="p-3.5">Mã số</th>
                  <th className="p-3.5">Tổ thi đua</th>
                  <th className="p-3.5 text-center">Điểm danh</th>
                  <th className="p-3.5 text-center">Sao tích lũy</th>
                  <th className="p-3.5 text-center">Bài đã làm</th>
                  <th className="p-3.5 text-center">Điểm TB</th>
                  <th className="p-3.5 text-right">Xóa / Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(st.id)}
                        onChange={() => handleToggleSelectStudent(st.id)}
                      />
                    </td>
                    <td className="p-3.5 flex items-center gap-2.5">
                      <span className="text-xl">{st.avatar}</span>
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{st.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {st.gender === 'nam' ? 'Nam' : 'Nữ'} {st.notes ? `• ${st.notes}` : ''}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-500 font-bold">{st.code}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold">
                        {st.team}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => toggleAttendance(st.id, st.attendanceToday)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          st.attendanceToday === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : st.attendanceToday === 'absent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {st.attendanceToday === 'present'
                          ? '✓ Có mặt'
                          : st.attendanceToday === 'absent'
                          ? '✗ Vắng'
                          : '○ Có phép'}
                      </button>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-extrabold text-amber-700">{st.points}</span>
                        <span className="text-amber-500">⭐</span>
                        <button
                          onClick={() => rewardStudentPoint(st.id, 5, 'Phát biểu tốt')}
                          title="Thưởng thêm 5 sao"
                          className="ml-1 px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-[10px]"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-bold">{st.completedCount} bài</td>
                    <td className="p-3.5 text-center font-bold text-red-700">{st.averageScore}/10</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => deleteStudent(st.id)}
                        title="Xóa học sinh này"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg font-bold text-xs transition-colors shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Thêm 1 học sinh mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border-4 border-amber-300 max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-600" /> Thêm học sinh vào lớp {classConfig.className}
            </h3>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-600">Họ và tên học sinh (*):</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="VD: Nguyễn Gia Bảo"
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-600">Giới tính:</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                  >
                    <option value="nam">Nam 👦</option>
                    <option value="nu">Nữ 👧</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-600">Tổ thi đua:</label>
                  <select
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                  >
                    {classConfig.teams.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-600">Ghi chú sư phạm (nếu có):</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="VD: Hăng hái phát biểu, đọc diễn cảm..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 text-xs font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Thêm vào lớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nhập danh sách nhanh từ Excel / Word */}
      {showBulkAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border-4 border-emerald-400 max-w-lg w-full p-6 shadow-2xl">
            <h3 className="font-black text-lg text-slate-800 mb-2 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Nhập danh sách nhanh học sinh
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Thầy/Cô chỉ cần sao chép cột họ tên từ Excel hoặc danh sách Word và dán vào ô bên dưới (mỗi dòng một em).
            </p>

            <form onSubmit={handleBulkAddStudents} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-600">
                  Dán danh sách họ tên (mỗi em 1 dòng):
                </label>
                <textarea
                  rows={8}
                  required
                  value={bulkNamesText}
                  onChange={(e) => setBulkNamesText(e.target.value)}
                  placeholder={`Nguyễn Văn An\nTrần Thị Mai Anh\nLê Hoàng Bách\nPhạm Ngọc Châu\nVõ Minh Đăng`}
                  className="w-full p-3 border border-slate-300 rounded-xl bg-slate-50 text-xs font-medium font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
                />
                <div className="mt-1 text-right text-[11px] text-slate-400">
                  Số em dự kiến:{' '}
                  <strong className="text-emerald-700 font-bold">
                    {
                      bulkNamesText
                        .split('\n')
                        .map((l) => l.trim())
                        .filter((l) => l.length > 0).length
                    }
                  </strong>{' '}
                  học sinh
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-600">Phân chia tổ thi đua:</label>
                <select
                  value={bulkTeamChoice}
                  onChange={(e) => setBulkTeamChoice(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                >
                  <option value="auto">Tự động chia đều vào 4 tổ (Rồng Vàng, Phượng Hoàng, Kỳ Lân, Rùa Thần)</option>
                  {classConfig.teams.map((t) => (
                    <option key={t} value={t}>
                      Cho tất cả vào tổ: {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-slate-50"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Nhập danh sách ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cấu hình thông tin lớp */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border-4 border-amber-300 max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-teal-600" /> Cấu hình lớp học
            </h3>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-600">Tên lớp học:</label>
                <input
                  type="text"
                  value={editClassName}
                  onChange={(e) => setEditClassName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-600">Trường:</label>
                <input
                  type="text"
                  value={editSchoolName}
                  onChange={(e) => setEditSchoolName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-600">Giáo viên chủ nhiệm:</label>
                <input
                  type="text"
                  value={editTeacherName}
                  onChange={(e) => setEditTeacherName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-bold"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black shadow"
                >
                  Lưu cấu hình
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
