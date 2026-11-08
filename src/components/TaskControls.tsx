import React from 'react';
import { FilterState, TaskPriority, TaskSortOption, TaskStatusFilter } from '../types/task';

interface TaskControlsProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  visibleCount: number;
}

export const TaskControls: React.FC<TaskControlsProps> = ({
  filterState,
  onFilterChange,
  totalCount,
  pendingCount,
  completedCount,
  visibleCount
}) => {
  return (
    <section className="bento-controls-card" aria-label="Filter dan Kontrol Tugas">
      <div className="controls-top-row">
        {/* Search Bar */}
        <div className="search-box-wrapper">
          <svg
            className="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            id="search-task-input"
            className="search-input"
            placeholder="Cari judul tugas atau mata kuliah..."
            value={filterState.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          />
        </div>

        {/* Filter Status Tabs (Semua / Belum Selesai / Selesai) */}
        <nav className="filter-tabs" role="tablist" aria-label="Filter Status Tugas">
          <button
            type="button"
            className={`filter-tab-btn ${filterState.status === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange({ status: 'all' as TaskStatusFilter })}
          >
            <span>Semua</span>
            <span className="tab-count" id="count-all">
              {totalCount}
            </span>
          </button>
          <button
            type="button"
            className={`filter-tab-btn ${filterState.status === 'pending' ? 'active' : ''}`}
            onClick={() => onFilterChange({ status: 'pending' as TaskStatusFilter })}
          >
            <span>Belum Selesai</span>
            <span className="tab-count" id="count-pending">
              {pendingCount}
            </span>
          </button>
          <button
            type="button"
            className={`filter-tab-btn ${filterState.status === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange({ status: 'completed' as TaskStatusFilter })}
          >
            <span>Selesai</span>
            <span className="tab-count" id="count-completed">
              {completedCount}
            </span>
          </button>
        </nav>
      </div>

      {/* Secondary Filters: Urutkan & Filter Prioritas */}
      <div className="controls-bottom-row">
        <div className="filter-group">
          <span className="filter-label">Prioritas:</span>
          <select
            id="select-filter-priority"
            className="custom-select"
            value={filterState.priority}
            onChange={(e) =>
              onFilterChange({ priority: e.target.value as TaskPriority | 'all' })
            }
          >
            <option value="all">Semua Tingkat</option>
            <option value="high">🔴 Prioritas Tinggi</option>
            <option value="medium">🟡 Prioritas Sedang</option>
            <option value="low">🟢 Prioritas Rendah</option>
          </select>

          <span className="filter-label" style={{ marginLeft: '0.5rem' }}>
            Urutkan:
          </span>
          <select
            id="select-sort-by"
            className="custom-select"
            value={filterState.sortBy}
            onChange={(e) =>
              onFilterChange({ sortBy: e.target.value as TaskSortOption })
            }
          >
            <option value="deadline-asc">📅 Tenggat Terdekat</option>
            <option value="deadline-desc">📅 Tenggat Terjauh</option>
            <option value="created-desc">🕒 Terbaru Ditambahkan</option>
            <option value="title-asc">🔤 Judul (A - Z)</option>
            <option value="course-asc">📚 Mata Kuliah (A - Z)</option>
          </select>
        </div>

        <div className="active-count-text">
          Menampilkan <strong id="visible-task-count">{visibleCount}</strong> tugas
        </div>
      </div>
    </section>
  );
};
