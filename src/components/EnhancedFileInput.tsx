'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface EnhancedFileInputProps {
  onChange?: (file: File | null) => void;
  accept?: string;
  className?: string;
  label?: string;
  required?: boolean;
  showPreview?: boolean;
  type?: 'image' | 'audio' | 'file';
  value?: File | null;
}

export default function EnhancedFileInput({
  onChange,
  accept = '*/*',
  className = '',
  label = 'Choose File',
  required = false,
  showPreview = true,
  type = 'file',
  value,
}: EnhancedFileInputProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(value || null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedFile && type === 'image' && showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else if (selectedFile && type === 'audio' && showPreview) {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(selectedFile);
      audio.src = objectUrl;
      audio.addEventListener('loadedmetadata', () => {
        setAudioDuration(audio.duration);
        URL.revokeObjectURL(objectUrl);
      });
    } else {
      setPreview(null);
      setAudioDuration(null);
    }
  }, [selectedFile, type, showPreview]);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    onChange?.(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={`${className}`}>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-4 cursor-pointer
          transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${selectedFile ? 'border-green-500' : ''}
        `}
      >
        <input
          ref={inputRef}
          type='file'
          accept={accept}
          onChange={handleInputChange}
          className='hidden'
          required={required}
        />

        {/* Preview Section */}
        {selectedFile && showPreview && type === 'image' && preview && (
          <div className='mb-3 flex justify-center'>
            <div className='relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200'>
              <Image src={preview} alt='Preview' fill className='object-cover' />
            </div>
          </div>
        )}

        {/* Content */}
        <div className='text-center'>
          <p className='text-sm font-medium text-gray-700 mb-1'>{selectedFile ? selectedFile.name : label}</p>
          {selectedFile && (
            <div className='text-xs text-gray-500 space-y-1'>
              <p>{formatFileSize(selectedFile.size)}</p>
              {audioDuration && <p>Duration: {formatDuration(audioDuration)}</p>}
            </div>
          )}
          {!selectedFile && <p className='text-xs text-gray-500 mt-1'>Click or drag and drop</p>}
        </div>
      </div>

      {/* Clear Button */}
      {selectedFile && (
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            handleFileChange(null);
            if (inputRef.current) inputRef.current.value = '';
          }}
          className='mt-2 text-xs text-red-600 hover:text-red-800 underline'
        >
          Clear file
        </button>
      )}
    </div>
  );
}
