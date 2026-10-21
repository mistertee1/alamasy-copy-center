import React from 'react';

interface BrandLogoProps {
  inverse?: boolean;
  compact?: boolean;
  className?: string;
}

/** Candidate master brand mark; printer pictogram is deliberately not reused. */
export function BrandLogo({ inverse = false, compact = false, className = '' }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="الاماسي">
      <svg viewBox="0 0 144 144" className="h-11 w-11 shrink-0" role="img" aria-label="رمز الاماسي">
        <rect width="144" height="144" rx="31" fill="#1D4ED8" />
        <path d="M35 40h53l24 24v44H35z" fill="none" stroke="white" strokeWidth="8" strokeLinejoin="round" />
        <path d="M88 40v24h24" fill="none" stroke="white" strokeWidth="8" strokeLinejoin="round" />
        <path d="M49 80h48M49 95h36" stroke="white" strokeWidth="7" strokeLinecap="round" />
        <circle cx="112" cy="112" r="9" fill="#FBBF24" />
      </svg>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <strong className={`text-xl font-extrabold ${inverse ? 'text-white' : 'text-[#0F172A]'}`}>الاماسي</strong>
          <span className={`text-[10px] font-semibold ${inverse ? 'text-slate-300' : 'text-slate-600'}`}>خدمات الطباعة والنسخ والطلبات المخصصة</span>
        </span>
      )}
    </span>
  );
}
