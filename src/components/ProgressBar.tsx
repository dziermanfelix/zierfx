'use client';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export default function ProgressBar({ progress, label, showPercentage = true, className = '' }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={className}>
      {label && (
        <div className='flex justify-between items-center mb-1'>
          <span className='text-sm font-medium text-gray-700'>{label}</span>
          {showPercentage && <span className='text-sm text-gray-500'>{Math.round(clampedProgress)}%</span>}
        </div>
      )}
      <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
        <div
          className='bg-blue-500 h-full rounded-full transition-all duration-300 ease-out'
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
