'use client';

import { useState } from 'react';
import EnhancedFileInput from './EnhancedFileInput';

export interface Track {
  name: string;
  file: File | null;
}

interface TrackUploadItemProps {
  track: Track;
  index: number;
  onUpdate: (index: number, track: Track) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export default function TrackUploadItem({
  track,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: TrackUploadItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className='border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow'>
      {/* Header */}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center space-x-3'>
          <span className='text-sm font-bold text-gray-500 w-6'>#{index + 1}</span>
          <button
            type='button'
            onClick={() => setIsExpanded(!isExpanded)}
            className='text-gray-600 hover:text-gray-800 text-xs font-bold'
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '[-]' : '[+]'}
          </button>
          <span className='font-medium text-gray-700 truncate'>{track.name || `Track ${index + 1}`}</span>
          {track.file && <span className='text-xs text-green-600 font-medium'>[file]</span>}
        </div>

        {/* Track Controls */}
        <div className='flex items-center space-x-2'>
          <button
            type='button'
            onClick={() => onMoveUp(index)}
            disabled={!canMoveUp}
            className={`text-xs px-2 py-1 rounded font-medium ${
              canMoveUp ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label='Move up'
          >
            Up
          </button>
          <button
            type='button'
            onClick={() => onMoveDown(index)}
            disabled={!canMoveDown}
            className={`text-xs px-2 py-1 rounded font-medium ${
              canMoveDown ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label='Move down'
          >
            Down
          </button>
          <button
            type='button'
            onClick={() => onDelete(index)}
            className='text-sm px-3 py-1 rounded text-red-600 hover:bg-red-50'
          >
            Delete
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className='space-y-3 mt-3'>
          <input
            type='text'
            placeholder={`Track ${index + 1} name`}
            value={track.name}
            onChange={(e) => {
              onUpdate(index, { ...track, name: e.target.value });
            }}
            className='border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />

          <EnhancedFileInput
            accept='audio/*'
            label={`Upload Track ${index + 1}`}
            type='audio'
            showPreview={true}
            value={track.file}
            onChange={(file) => {
              onUpdate(index, { ...track, file });
            }}
            required
          />
        </div>
      )}
    </div>
  );
}
