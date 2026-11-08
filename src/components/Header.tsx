import React from 'react';
import { AppConfig } from '../types/task';

interface HeaderProps {
  onAddTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddTask }) => {
  const config: AppConfig = {
    appName: import.meta.env.VITE_APP_NAME || 'Taskaedu',
    appVersion: import.meta.env.VITE_APP_VERSION || 'v1.0.0',
    appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Pengelola Tugas Kuliah Modern',
    collegeName: import.meta.env.VITE_COLLEGE_NAME || 'Portal Akademik Mahasiswa'
  };

  const todayFormatted: string = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="bento-header">
      <div className="header-brand">
        <div className="brand-icon-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h10" />
            <path d="m9 16 2 2 4-4" />
          </svg>
        </div>
        <div className="brand-info">
          <h1>
            {config.appName}
            <span className="app-version-badge">{config.appVersion}</span>
          </h1>
          <p className="brand-subtitle">
            {config.appDescription} • {config.collegeName}
          </p>
        </div>
      </div>

      <div className="header-meta">
        <div className="meta-pill" title="Tanggal Hari Ini">
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
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>{todayFormatted}</span>
        </div>

        <button
          id="btn-open-add-task"
          className="btn-primary-action"
          type="button"
          onClick={onAddTask}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Tambah Tugas</span>
        </button>
      </div>
    </header>
  );
};
