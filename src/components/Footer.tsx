import React from 'react';
import { AppConfig } from '../types/task';

export const Footer: React.FC = () => {
  const config: AppConfig = {
    appName: import.meta.env.VITE_APP_NAME || 'Taskademik',
    appVersion: import.meta.env.VITE_APP_VERSION || 'v1.0.0',
    appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Pengelola Tugas Kuliah',
    collegeName: import.meta.env.VITE_COLLEGE_NAME || 'Portal Akademik'
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bento-footer">
      <div className="footer-left">
        <div className="footer-badge">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
          <span>
            {config.appName} <strong>{config.appVersion}</strong>
          </span>
        </div>
        <span>&copy; {currentYear} • Sistem Manajemen Tugas Kuliah Mahasiswa</span>
      </div>

      <div className="footer-right">
        <span title="Penyimpanan lokal di browser aktif">💾 LocalStorage Sinkron</span>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
          {config.collegeName}
        </span>
      </div>
    </footer>
  );
};
