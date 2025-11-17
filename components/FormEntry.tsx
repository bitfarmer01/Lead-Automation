import React, { memo } from 'react';
import { Entry } from '../types';
import { CopyIcon, TrashIcon } from './icons';

interface FormEntryProps {
  entry: Entry;
  index: number;
  isOnlyEntry: boolean;
  validationErrors: string[];
  onEntryChange: (index: number, field: keyof Omit<Entry, 'id'>, value: string) => void;
  onRemove: (index: number) => void;
  onCopyPrevious: (index: number) => void;
}

function FormEntry({ entry, index, isOnlyEntry, validationErrors, onEntryChange, onRemove, onCopyPrevious }: FormEntryProps) {
  return (
    <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/30 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-yellow-400">Entry #{index + 1}</h3>
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button onClick={() => onCopyPrevious(index)} className="flex items-center gap-1 text-sm text-slate-400 hover:text-yellow-400 transition" title="Copy from previous entry">
              <CopyIcon className="w-4 h-4" /> Copy
            </button>
          )}
          {!isOnlyEntry && (
            <button onClick={() => onRemove(index)} className="text-slate-400 hover:text-red-400 transition" title="Remove entry">
              <TrashIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`jobRole-${index}`} className="block text-sm font-medium text-slate-400 mb-2">Job Role</label>
            <input id={`jobRole-${index}`} type="text" value={entry.jobRole} onChange={e => onEntryChange(index, 'jobRole', e.target.value)} className={`w-full bg-slate-900 border rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200 ${validationErrors.includes('jobRole') ? 'border-red-500' : 'border-slate-600'}`} />
          </div>
          <div>
            <label htmlFor={`location-${index}`} className="block text-sm font-medium text-slate-400 mb-2">Location</label>
            <input id={`location-${index}`} type="text" value={entry.location} onChange={e => onEntryChange(index, 'location', e.target.value)} className={`w-full bg-slate-900 border rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200 ${validationErrors.includes('location') ? 'border-red-500' : 'border-slate-600'}`} />
          </div>
          <div>
            <label htmlFor={`experienceLevel-${index}`} className="block text-sm font-medium text-slate-400 mb-2">Experience Level</label>
            <select id={`experienceLevel-${index}`} value={entry.experienceLevel} onChange={e => onEntryChange(index, 'experienceLevel', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200">
              <option value="internship">Internship</option>
              <option value="entry_level">Entry Level</option>
              <option value="associate">Associate</option>
              <option value="mid_senior">Mid-Senior Level</option>
              <option value="director">Director</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <div>
            <label htmlFor={`dateRange-${index}`} className="block text-sm font-medium text-slate-400 mb-2">Date Range</label>
            <select id={`dateRange-${index}`} value={entry.dateRange} onChange={e => onEntryChange(index, 'dateRange', e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200">
              <option value="any">Any Time</option>
              <option value="day">Past 24 hours</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={`linkedinUrl-${index}`} className="block text-sm font-medium text-slate-400 mb-2">LinkedIn URL</label>
          <input id={`linkedinUrl-${index}`} type="url" value={entry.linkedinUrl} onChange={e => onEntryChange(index, 'linkedinUrl', e.target.value)} placeholder="https://www.linkedin.com/jobs/search/..." className={`w-full bg-slate-900 border rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200 ${validationErrors.includes('linkedinUrl') ? 'border-red-500' : 'border-slate-600'}`} />
        </div>
      </div>
    </div>
  );
}

export const MemoizedFormEntry = memo(FormEntry);
