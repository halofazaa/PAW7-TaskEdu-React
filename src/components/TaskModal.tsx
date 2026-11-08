import React, { useEffect, useState, useRef } from 'react';
import { ModalMode, Task, TaskFormData, TaskPriority } from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  mode: ModalMode;
  task: Task | null;
  onClose: () => void;
  onSubmit: (data: TaskFormData, editingId?: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  mode,
  task,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [description, setDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    course?: string;
    deadline?: string;
  }>({});

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Helper to generate default deadline (3 days ahead at 23:59)
  const getDefaultDeadline = (): string => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    defaultDate.setHours(23, 59, 0, 0);
    const tzOffset = defaultDate.getTimezoneOffset() * 60000;
    return new Date(defaultDate.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  // Populate or reset form whenever modal opens or active task changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && task) {
        setTitle(task.title);
        setCourse(task.course);
        setDeadline(task.deadline.slice(0, 16));
        setPriority(task.priority);
        setDescription(task.description || '');
        setIsCompleted(task.isCompleted);
      } else {
        setTitle('');
        setCourse('');
        setDeadline(getDefaultDeadline());
        setPriority('medium');
        setDescription('');
        setIsCompleted(false);
      }
      setErrors({});

      // Lock body scroll
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, mode, task]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedCourse = course.trim();
    const newErrors: { title?: string; course?: string; deadline?: string } = {};

    if (!trimmedTitle) {
      newErrors.title = 'Judul tugas wajib diisi';
    }

    if (!trimmedCourse) {
      newErrors.course = 'Mata kuliah wajib diisi';
    }

    if (!deadline) {
      newErrors.deadline = 'Tenggat waktu wajib dipilih';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData: TaskFormData = {
      title: trimmedTitle,
      course: trimmedCourse,
      deadline,
      description: description.trim(),
      priority,
      isCompleted
    };

    onSubmit(formData, mode === 'edit' && task ? task.id : undefined);
    onClose();
  };

  return (
    <div
      id="task-modal"
      className="modal-overlay active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            <svg
              id="modal-title-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span id="modal-title-text">
              {mode === 'create' ? 'Tambah Tugas Kuliah' : 'Edit Tugas Kuliah'}
            </span>
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            id="btn-close-modal"
            aria-label="Tutup form"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form id="task-form" noValidate onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Judul Tugas */}
            <div className={`form-group ${errors.title ? 'has-error' : ''}`} id="group-title">
              <label className="form-label" htmlFor="task-title-input">
                <span>
                  Judul Tugas Kuliah <span className="required">*</span>
                </span>
              </label>
              <input
                ref={titleInputRef}
                type="text"
                id="task-title-input"
                className="form-input"
                placeholder="Contoh: Laporan Akhir Praktikum Jaringan"
                required
                maxLength={120}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
              />
              <span className="form-error-msg" id="error-title">
                {errors.title || 'Judul tugas tidak boleh kosong'}
              </span>
            </div>

            {/* Mata Kuliah */}
            <div className={`form-group ${errors.course ? 'has-error' : ''}`} id="group-course">
              <label className="form-label" htmlFor="task-course-input">
                <span>
                  Mata Kuliah <span className="required">*</span>
                </span>
              </label>
              <input
                type="text"
                id="task-course-input"
                className="form-input"
                placeholder="Contoh: Jaringan Komputer, Algoritma, Kalkulus"
                required
                maxLength={80}
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  if (errors.course) setErrors((prev) => ({ ...prev, course: undefined }));
                }}
              />
              <span className="form-error-msg" id="error-course">
                {errors.course || 'Nama mata kuliah wajib diisi'}
              </span>
            </div>

            {/* Tenggat Waktu & Prioritas (2 Kolom) */}
            <div className="form-row-2">
              <div
                className={`form-group ${errors.deadline ? 'has-error' : ''}`}
                id="group-deadline"
              >
                <label className="form-label" htmlFor="task-deadline-input">
                  <span>
                    Tenggat Waktu <span className="required">*</span>
                  </span>
                </label>
                <input
                  type="datetime-local"
                  id="task-deadline-input"
                  className="form-input"
                  required
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                  }}
                />
                <span className="form-error-msg" id="error-deadline">
                  {errors.deadline || 'Tenggat waktu wajib dipilih'}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-priority-select">
                  <span>Tingkat Prioritas</span>
                </label>
                <select
                  id="task-priority-select"
                  className="form-select custom-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <option value="low">🟢 Rendah</option>
                  <option value="medium">🟡 Sedang</option>
                  <option value="high">🔴 Tinggi</option>
                </select>
              </div>
            </div>

            {/* Deskripsi Tambahan */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc-input">
                <span>Catatan / Deskripsi Tambahan (Opsional)</span>
              </label>
              <textarea
                id="task-desc-input"
                className="form-textarea"
                placeholder="Catatan detail petunjuk tugas, format file (PDF/ZIP), link referensi, dll..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Status Penyelesaian */}
            <div className="form-group">
              <label className="status-toggle-label" style={{ marginTop: '0.25rem' }}>
                <input
                  type="checkbox"
                  id="task-status-input"
                  className="status-checkbox"
                  checked={isCompleted}
                  onChange={(e) => setIsCompleted(e.target.checked)}
                />
                <span>Tandai sebagai sudah selesai</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              id="btn-cancel-modal"
              onClick={onClose}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary-action" id="btn-submit-task">
              <span id="submit-btn-text">
                {mode === 'create' ? 'Tambah Tugas' : 'Perbarui Tugas'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
