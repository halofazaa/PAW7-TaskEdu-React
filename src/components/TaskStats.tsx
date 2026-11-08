import React, { useMemo } from 'react';
import { Task, TaskStatsData } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const stats: TaskStatsData = useMemo(() => {
    const total: number = tasks.length;
    const now: number = Date.now();

    let pending: number = 0;
    let completed: number = 0;
    let overdue: number = 0;
    let upcomingSoon: number = 0;

    const threeDaysMs: number = 3 * 24 * 60 * 60 * 1000;

    tasks.forEach((task: Task) => {
      if (task.isCompleted) {
        completed++;
      } else {
        pending++;
        const deadlineTime: number = new Date(task.deadline).getTime();
        if (deadlineTime < now) {
          overdue++;
        } else if (deadlineTime - now <= threeDaysMs) {
          upcomingSoon++;
        }
      }
    });

    const completionRate: number = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      pending,
      completed,
      overdue,
      upcomingSoon,
      completionRate
    };
  }, [tasks]);

  const uniqueCourses: number = useMemo(() => {
    const coursesSet: Set<string> = new Set(
      tasks.map((task: Task) => task.course.trim().toLowerCase())
    );
    return coursesSet.size;
  }, [tasks]);

  return (
    <section className="bento-stats-grid" aria-label="Statistik Tugas">
      {/* Bento 1: Progress Penyelesaian (Hero Card) */}
      <div className="bento-card bento-col-4 bento-hero">
        <div>
          <div className="bento-hero-header">
            <span className="stat-label">Progres Keseluruhan</span>
            <div className="bento-icon-tag tag-blue">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
          </div>
          <div className="stat-value">{stats.completionRate}%</div>
          <p className="stat-subtext">
            <strong>{stats.completed}</strong> dari <strong>{stats.total}</strong> tugas kuliah
            terselesaikan
          </p>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${stats.completionRate}%` }} />
        </div>
      </div>

      {/* Bento 2: Tugas Belum Selesai (Pending) */}
      <div className="bento-card bento-col-3">
        <div className="bento-hero-header">
          <span className="stat-label">Belum Selesai</span>
          <div className="bento-icon-tag tag-amber">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        </div>
        <div className="stat-value">{stats.pending}</div>
        <p className="stat-subtext">
          {stats.overdue > 0 ? (
            <span style={{ color: '#e11d48', fontWeight: 700 }}>
              ⚠️ {stats.overdue} terlewat deadline
            </span>
          ) : stats.upcomingSoon > 0 ? (
            <span style={{ color: '#d97706', fontWeight: 600 }}>
              🔥 {stats.upcomingSoon} deadline dekat
            </span>
          ) : (
            'Tersedia tugas aktif'
          )}
        </p>
      </div>

      {/* Bento 3: Tugas Selesai (Completed) */}
      <div className="bento-card bento-col-3">
        <div className="bento-hero-header">
          <span className="stat-label">Selesai</span>
          <div className="bento-icon-tag tag-emerald">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
        <div className="stat-value">{stats.completed}</div>
        <p className="stat-subtext">
          <span style={{ color: '#15803d', fontWeight: 600 }}>✨ Kinerja akademis baik</span>
        </p>
      </div>

      {/* Bento 4: Mata Kuliah Aktif */}
      <div className="bento-card bento-col-2">
        <div className="bento-hero-header">
          <span className="stat-label">Mata Kuliah</span>
          <div className="bento-icon-tag tag-blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            </svg>
          </div>
        </div>
        <div className="stat-value">{uniqueCourses}</div>
        <p className="stat-subtext">Mata kuliah aktif</p>
      </div>
    </section>
  );
};
