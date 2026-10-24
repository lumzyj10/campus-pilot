import React from 'react';

export function CampusLogo({ size = 38, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        {/* Main Blue-to-Emerald Gradient */}
        <linearGradient id="cpGradMain" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* AI Sparkle Golden/Cyan Glow */}
        <linearGradient id="cpGradSparkle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        {/* Soft Shadow Filter */}
        <filter id="cpShadow" x="-10%" y="-10%" width="125%" height="125%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0284c7" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Rounded Container Tile */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        fill="url(#cpGradMain)"
        filter="url(#cpShadow)"
      />

      {/* Subtle Inner Day Orbital Arc (Daily Schedule Cycle) */}
      <circle
        cx="24"
        cy="24"
        r="17"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />

      {/* Small Time Clock Ticks at 12, 3, 6, 9 */}
      <circle cx="24" cy="7" r="1.2" fill="rgba(255, 255, 255, 0.7)" />
      <circle cx="41" cy="24" r="1.2" fill="rgba(255, 255, 255, 0.7)" />
      <circle cx="24" cy="41" r="1.2" fill="rgba(255, 255, 255, 0.7)" />
      <circle cx="7" cy="24" r="1.2" fill="rgba(255, 255, 255, 0.7)" />

      {/* 1. Academic Graduation Mortarboard (Fresher/Student Symbol) */}
      {/* Top Diamond of Graduation Cap */}
      <path
        d="M24 13L37 19.5L24 26L11 19.5L24 13Z"
        fill="#ffffff"
        opacity="0.95"
      />

      {/* Cap Skull/Base underneath */}
      <path
        d="M16 23.2V28.5C16 31.8 19.6 34 24 34C28.4 34 32 31.8 32 28.5V23.2L24 27.2L16 23.2Z"
        fill="#ffffff"
        opacity="0.85"
      />

      {/* Cap Tassel Cord & Bead */}
      <path
        d="M13 20.5V26.5"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="13" cy="27" r="1.5" fill="#fef08a" />

      {/* 2. AI Intelligence Sparkle (AI-Powered Guidance) */}
      {/* Radiant 4-point star rising from the student cap */}
      <path
        d="M35 11C35 13.2 36.8 15 39 15C36.8 15 35 16.8 35 19C35 16.8 33.2 15 31 15C33.2 15 35 13.2 35 11Z"
        fill="url(#cpGradSparkle)"
      />

      {/* Secondary mini spark for AI neural energy */}
      <path
        d="M13 11C13 12.1 13.9 13 15 13C13.9 13 13 13.9 13 15C13 13.9 12.1 13 11 13C12.1 13 13 12.1 13 11Z"
        fill="#ffffff"
        opacity="0.85"
      />
    </svg>
  );
}
