'use client';

import { useState } from 'react';
import EnhancedFileInput from './EnhancedFileInput';

export interface TrackItemData {
  name: string;
  file: File | null;
  number?: number;
  id?: number | bigint;
  audioUrl?: string | null;
  downloadable?: boolean;
}

interface TrackItemProps {
  track: TrackItemData;
  index: number;
  onUpdate: (index: number, track: TrackItemData) => void;
  onDelete?: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  canDelete?: boolean;
  disabled?: boolean;
  mode?: 'create' | 'edit';
  showCollapse?: boolean;
}

export default function TrackItem({
  track,
  index,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  canDelete = true,
  disabled = false,
  mode = 'create',
  showCollapse = true,
}: TrackItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const trackNumber = track.number ?? index + 1;
  const hasNewFile = track.file !== null;
  const hasExistingFile = mode === 'edit' && track.audioUrl;

  return (
    <div className='border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow'>
      {/* Header */}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center space-x-3'>
          <span className='text-sm font-bold text-gray-500 w-6'>#{trackNumber}</span>
          {showCollapse && (
            <button
              type='button'
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-gray-600 hover:text-gray-800 text-xs font-bold'
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
              disabled={disabled}
            >
              {isExpanded ? '[-]' : '[+]'}
            </button>
          )}
          <span className='font-medium text-gray-700 truncate'>{track.name || `Track ${trackNumber}`}</span>
          {hasNewFile && <span className='text-xs text-green-600 font-medium'>[new file]</span>}
          {!hasNewFile && hasExistingFile && <span className='text-xs text-blue-600 font-medium'>[file]</span>}
        </div>

        {/* Track Controls */}
        <div className='flex items-center space-x-2'>
          <button
            type='button'
            onClick={() => onMoveUp(index)}
            disabled={!canMoveUp || disabled}
            className={`text-xs px-2 py-1 rounded font-medium ${
              !canMoveUp || disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label='Move up'
          >
            Up
          </button>
          <button
            type='button'
            onClick={() => onMoveDown(index)}
            disabled={!canMoveDown || disabled}
            className={`text-xs px-2 py-1 rounded font-medium ${
              !canMoveDown || disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label='Move down'
          >
            Down
          </button>
          {canDelete && onDelete && (
            <button
              type='button'
              onClick={() => onDelete(index)}
              disabled={disabled}
              className='text-sm px-3 py-1 rounded text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className='space-y-3 mt-3'>
          <input
            type='text'
            placeholder={`Track ${trackNumber} name`}
            value={track.name}
            onChange={(e) => {
              onUpdate(index, { ...track, name: e.target.value });
            }}
            className='border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
            disabled={disabled}
          />

          <EnhancedFileInput
            accept='audio/*'
            label={mode === 'edit' ? `Replace Track ${trackNumber} Audio` : `Upload Track ${trackNumber}`}
            type='audio'
            showPreview={true}
            value={track.file}
            onChange={(file) => {
              onUpdate(index, { ...track, file });
            }}
            required={mode === 'create'}
          />

          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id={`downloadable-${index}`}
              checked={track.downloadable !== false}
              onChange={(e) => {
                onUpdate(index, { ...track, downloadable: e.target.checked });
              }}
              className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              disabled={disabled}
            />
            <label htmlFor={`downloadable-${index}`} className='text-sm text-gray-700'>
              Allow downloads
            </label>
          </div>

          {mode === 'edit' && !hasNewFile && hasExistingFile && (
            <p className='text-xs text-gray-500'>Current audio will be kept if no new file is uploaded</p>
          )}
        </div>
      )}
    </div>
  );
}
