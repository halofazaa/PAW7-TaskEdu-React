import React from 'react';
import { Task, TaskPriority } from '../types/task';
import { formatIndonesianDate, getDeadlineInfo } from '../utils/storage';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function getPriorityBadge(priority: TaskPriority): { label: string; className: string } {
  switch (priority) {
    case 'high':
      return { label: 'Tinggi', className: 'priority-high' };
    case 'medium':
      return { label: 'Sedang', className: 'priority-medium' };
    case 'low':
    default:
      return { label: 'Rendah', className: 'priority-low' };
  }
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  const priorityInfo = getPriorityBadge(task.priority);
  const deadlineInfo = getDeadlineInfo(task.deadline, task.isCompleted);
  const formattedDeadline = formatIndonesianDate(task.deadline);

  return (
    <article
      className={`task-card ${task.isCompleted ? 'is-completed' : ''}`}
      data-task-id={task.id}
    >
      {/* Header Kartu: Mata Kuliah & Badge Prioritas */}
      <div className="task-card-header">
        <span className="course-badge" title={`Mata Kuliah: ${task.course}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          {task.course}
        </span>
        <span className={`priority-badge ${priorityInfo.className}`}>
          ● {priorityInfo.label}
        </span>
      </div>

      {/* Body Kartu: Judul & Deskripsi Tugas */}
      <div className="task-card-body">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
      </div>

      {/* Deadline & Countdown Bar */}
      <div className="task-deadline-bar">
        <div className="deadline-time" title={`Tenggat Waktu: ${formattedDeadline}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{formattedDeadline}</span>
        </div>
        <span className={`deadline-badge ${deadlineInfo.bgClass}`}>
          {deadlineInfo.label}
        </span>
      </div>

      {/* Footer Kartu: Toggle Status Selesai, Tombol Edit, Tombol Hapus */}
      <div className="task-card-footer">
        <label className="status-toggle-label" title="Tandai Selesai / Belum Selesai">
          <input
            type="checkbox"
            className="status-checkbox task-status-toggle"
            checked={task.isCompleted}
            onChange={(e) => onToggleStatus(task.id, e.target.checked)}
          />
          <span>{task.isCompleted ? 'Selesai' : 'Belum Selesai'}</span>
        </label>

        <div className="task-action-btns">
          <button
            type="button"
            className="btn-icon btn-edit-task"
            title="Edit Tugas Kuliah"
            aria-label="Edit Tugas"
            onClick={() => onEdit(task)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
          <button
            type="button"
            className="btn-icon btn-icon-danger btn-delete-task"
            title="Hapus Tugas"
            aria-label="Hapus Tugas"
            onClick={() => onDelete(task.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};
