'use client';

import ProgressBar from './ProgressBar';
import { FileProgress } from '@/hooks/useUploadProgress';

interface UploadProgressSectionProps {
  fileProgresses: FileProgress[];
  overallProgress: number;
  title?: string;
}

export default function UploadProgressSection({
  fileProgresses,
  overallProgress,
  title = 'Upload Progress',
}: UploadProgressSectionProps) {
  if (fileProgresses.length === 0) return null;

  return (
    <div className='bg-white rounded-lg shadow-sm p-6 space-y-4'>
      <h2 className='text-lg font-semibold'>{title}</h2>
      <ProgressBar progress={overallProgress} label='Overall Progress' />
      <div className='space-y-2'>
        {fileProgresses.map((file) => (
          <div key={file.name} className='flex items-center space-x-3'>
            <div className='flex-1'>
              <ProgressBar progress={file.progress} label={file.name} showPercentage={false} />
            </div>
            <span className='text-xs text-gray-500 w-20 text-right'>
              {file.status === 'complete' && 'Complete'}
              {file.status === 'uploading' && `${Math.round(file.progress)}%`}
              {file.status === 'pending' && 'Pending'}
              {file.status === 'error' && 'Error'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
