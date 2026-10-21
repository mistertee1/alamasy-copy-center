import React from 'react';

interface BrandLogoProps {
  inverse?: boolean;
  className?: string;
}

/** Approved owner-supplied artwork, shown without redrawing or recoloring. */
export function BrandLogo({ inverse = false, className = '' }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-label="مكتبة الأماسي">
      <span className="relative block h-[94px] w-[190px] shrink-0 overflow-hidden rounded-lg bg-[#0F172A] sm:h-[106px] sm:w-[208px]">
        <img
          src="/alamasy-approved-logo.png"
          alt="مكتبة الأماسي — الشعار المعتمد بكتاب مفتوح"
          className="absolute left-0 top-0 h-auto w-full max-w-none -translate-y-[30%]"
          decoding="async"
        />
      </span>
      <span className="sr-only">{inverse ? 'الاماسي' : 'مكتبة الأماسي'}</span>
    </span>
  );
}
