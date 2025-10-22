'use client';

import { useState } from 'react';

export interface FileProgress {
  name: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
}

export function useUploadProgress() {
  const [fileProgresses, setFileProgresses] = useState<FileProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  const initializeFiles = (fileNames: string[]) => {
    const progresses = fileNames.map((name) => ({
      name,
      progress: 0,
      status: 'pending' as const,
    }));
    setFileProgresses(progresses);
    setOverallProgress(0);
  };

  const updateFileProgress = (fileName: string, progress: number, status?: FileProgress['status']) => {
    setFileProgresses((prev) => {
      const updated = prev.map((file) =>
        file.name === fileName ? { ...file, progress, status: status || file.status } : file
      );

      // Calculate overall progress
      const total = updated.reduce((sum, file) => sum + file.progress, 0);
      setOverallProgress(updated.length > 0 ? total / updated.length : 0);

      return updated;
    });
  };

  const reset = () => {
    setFileProgresses([]);
    setOverallProgress(0);
  };

  return {
    fileProgresses,
    overallProgress,
    initializeFiles,
    updateFileProgress,
    reset,
  };
}
