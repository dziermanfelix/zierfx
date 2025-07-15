'use client';

import React, { useState } from 'react';

interface FileInputProps {
  onChange?: (file: File | null) => void;
  accept?: string;
  widthClass?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export default function FileInput({
  onChange,
  accept = '*/*',
  widthClass = 'w-64',
  className = '',
  label = 'Choose File',
  required = false,
}: FileInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onChange?.(file);
  };

  return (
    <div className={`flex items-center space-x-3 ${widthClass} ${className}`}>
      <label className='p-1 rounded border border-white cursor-pointer hover:border-blue-300 transition whitespace-nowrap'>
        {label}
        <input type='file' accept={accept} onChange={handleFileChange} className='hidden' required={required} />
      </label>
      <span className='text-sm text-gray-600 truncate'>{selectedFile ? selectedFile.name : 'No file chosen'}</span>
    </div>
  );
}
