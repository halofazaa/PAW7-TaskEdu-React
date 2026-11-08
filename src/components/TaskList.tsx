import React from 'react';
import { FilterState, Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  filterState: FilterState;
  onAddTask: () => void;
  onToggleStatus: (id: string, isCompleted: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filterState,
  onAddTask,
  onToggleStatus,
  onEdit,
  onDelete
}) => {
  return (
    <main className="task-grid-section">
      <div id="task-grid-container" className="task-grid">
        {tasks.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="empty-title">Tidak Ada Tugas yang Ditemukan</h3>
            <p className="empty-text">
              {filterState.searchQuery
                ? `Tidak ditemukan tugas dengan kata kunci "${filterState.searchQuery}".`
                : filterState.status === 'completed'
                ? 'Belum ada tugas yang diselesaikan. Yuk selesaikan tugasmu!'
                : 'Semua tugas telah diselesaikan atau belum ada tugas yang ditambahkan.'}
            </p>
            <button
              type="button"
              className="btn-primary-action"
              id="btn-empty-add-task"
              onClick={onAddTask}
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
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Tambah Tugas Sekarang
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </main>
  );
};
