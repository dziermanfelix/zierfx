'use client';

import { ReactNode } from 'react';

interface FormSectionProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function FormSection({ children, title, subtitle, className = '' }: FormSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {(title || subtitle) && (
        <div className='mb-4'>
          {title && <h2 className='text-lg font-semibold text-gray-900'>{title}</h2>}
          {subtitle && <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
