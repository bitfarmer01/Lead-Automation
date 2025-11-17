import React, { useState, useCallback, useMemo } from 'react';
import { Entry, SavedSet } from '../types';
import { MemoizedFormEntry } from './FormEntry';
import useLocalStorage from '../hooks/useLocalStorage';
import { SaveIcon, TrashIcon } from './icons';

interface FormScreenProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

const initialEntry: Omit<Entry, 'id'> = {
  jobRole: '',
  location: '',
  experienceLevel: 'mid_senior',
  dateRange: 'day',
  linkedinUrl: '',
};

function FormScreen({ entries, setEntries }: FormScreenProps) {
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [savedSets, setSavedSets] = useLocalStorage<SavedSet[]>('savedEntrySets', []);
  const [selectedSetName, setSelectedSetName] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [newSetName, setNewSetName] = useState<string>('');
  
  const handleEntryChange = useCallback((index: number, field: keyof Omit<Entry, 'id'>, value: string) => {
    setEntries(prevEntries => {
      const newEntries = [...prevEntries];
      newEntries[index] = { ...newEntries[index], [field]: value };
      return newEntries;
    });

    if (validationErrors[index]?.includes(field)) {
      setValidationErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        newErrors[index] = newErrors[index].filter(f => f !== field);
        if (newErrors[index].length === 0) {
          delete newErrors[index];
        }
        if (Object.keys(newErrors).length === 0) {
          setErrorMessage(null);
        }
        return newErrors;
      });
    }
  }, [validationErrors, setEntries]);

  const addEntry = useCallback(() => {
    if (entries.length < 5) {
      setEntries(prev => [...prev, { ...initialEntry, id: Date.now(), jobRole: 'Technician', linkedinUrl: '' }]);
    }
  }, [entries.length, setEntries]);

  const removeEntry = useCallback((indexToRemove: number) => {
    setEntries(prev => prev.filter((_, i) => i !== indexToRemove));
    setValidationErrors(prev => {
        const newErrors: Record<number, string[]> = {};
        // Re-index the errors for entries that shifted
        Object.keys(prev).forEach(key => {
            const index = parseInt(key, 10);
            if (index < indexToRemove) {
                newErrors[index] = prev[index];
            } else if (index > indexToRemove) {
                newErrors[index - 1] = prev[index];
            }
        });

        if (Object.keys(newErrors).length === 0) {
            setErrorMessage(null);
        }
        return newErrors;
    });
  }, [setEntries]);

  const copyPreviousEntry = useCallback((index: number) => {
    if (index > 0) {
      setEntries(prev => {
        const previousEntry = prev[index - 1];
        const newEntries = [...prev];
        const currentId = newEntries[index].id;
        newEntries[index] = { ...previousEntry, id: currentId };
        return newEntries;
      });
    }
  }, [setEntries]);

  const handleSelectSet = useCallback((name: string) => {
    setSelectedSetName(name);
    if (name) {
      const setToLoad = savedSets.find(s => s.name === name);
      if (setToLoad) {
        setEntries(setToLoad.entries);
      }
    } else {
      setEntries([{ ...initialEntry, id: Date.now() }]);
    }
  }, [savedSets, setEntries]);

  const handleDeleteSet = useCallback(() => {
    if (!selectedSetName) return;
    setSavedSets(prev => prev.filter(s => s.name !== selectedSetName));
    setSelectedSetName('');
    setEntries([{ ...initialEntry, id: Date.now() }]);
  }, [selectedSetName, setSavedSets, setEntries]);

  const handleOpenSaveModal = useCallback(() => {
    setNewSetName(selectedSetName);
    setShowSaveModal(true);
  }, [selectedSetName]);

  const handleConfirmSave = useCallback(() => {
    if (!newSetName.trim()) return;
    const trimmedName = newSetName.trim();
    let newSavedSets = [...savedSets];
    const existingIndex = newSavedSets.findIndex(s => s.name === trimmedName);

    if (existingIndex > -1) {
      newSavedSets[existingIndex].entries = entries;
    } else {
      newSavedSets.push({ name: trimmedName, entries });
    }
    setSavedSets(newSavedSets);
    setSelectedSetName(trimmedName);
    setShowSaveModal(false);
    setNewSetName('');
  }, [newSetName, entries, savedSets, setSavedSets]);

  const validateAndProceed = useCallback(() => {
    const errors: Record<number, string[]> = {};
    entries.forEach((entry, index) => {
      const requiredFields: (keyof Omit<Entry, 'id' | 'experienceLevel' | 'dateRange'>)[] = ['jobRole', 'location', 'linkedinUrl'];
      const entryErrors: string[] = [];
      requiredFields.forEach(field => {
        if (!entry[field].trim()) {
          entryErrors.push(field);
        }
      });
      if (entryErrors.length > 0) {
        errors[index] = entryErrors;
      }
    });

    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setErrorMessage('Please fill out all required fields marked in red.');
      return;
    }
    
    setErrorMessage(null);
    window.location.hash = '#/webhook';
  }, [entries]);

  const isProceedDisabled = useMemo(() => 
    entries.some(entry => !entry.jobRole.trim() || !entry.location.trim() || !entry.linkedinUrl.trim()),
  [entries]);

  return (
    <div className="space-y-8">
      {errorMessage && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
          <p className="font-bold">Validation Error</p>
          <p>{errorMessage}</p>
        </div>
      )}

      <section className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 text-slate-100">Saved Configurations</h2>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
            <select 
              value={selectedSetName} 
              onChange={e => handleSelectSet(e.target.value)}
              className="w-full sm:w-auto flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200"
              aria-label="Load a saved configuration"
            >
              <option value="">Load a saved set...</option>
              {savedSets.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
            <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={handleOpenSaveModal} className="flex-grow flex items-center justify-center gap-2 p-3 bg-slate-700 text-yellow-400 rounded-md hover:bg-slate-600 transition" title="Save current entries">
                    <SaveIcon className="w-6 h-6" /> Save
                </button>
                {selectedSetName && (
                  <button onClick={handleDeleteSet} className="p-3 text-slate-400 bg-slate-700 rounded-md hover:bg-red-900/50 hover:text-red-400 transition" title="Delete selected set">
                    <TrashIcon className="w-6 h-6"/>
                  </button>
                )}
            </div>
          </div>
      </section>

      <section className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-slate-100">
          <span className="bg-yellow-600 text-slate-900 rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold">1</span>
          Configure Scraper Payload
        </h2>
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <MemoizedFormEntry
              key={entry.id}
              entry={entry}
              index={index}
              isOnlyEntry={entries.length === 1}
              validationErrors={validationErrors[index] || []}
              onEntryChange={handleEntryChange}
              onRemove={removeEntry}
              onCopyPrevious={copyPreviousEntry}
            />
          ))}
          {entries.length < 5 && (
            <div className="flex justify-center">
              <button onClick={addEntry} className="bg-slate-700 text-yellow-400 font-semibold px-4 py-2 rounded-md hover:bg-slate-600 transition duration-200">
                + Add Entry
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          onClick={handleOpenSaveModal}
          className="flex items-center gap-2 bg-slate-700 text-slate-200 font-semibold px-6 py-4 rounded-lg hover:bg-slate-600 transition duration-200"
          title="Save the current entries as a set"
        >
          <SaveIcon className="w-6 h-6" />
          Save Entries
        </button>
        <button
          onClick={validateAndProceed}
          className="bg-yellow-500 text-slate-900 font-bold text-lg px-8 py-4 rounded-lg hover:bg-yellow-600 transition transform hover:scale-105 duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          disabled={isProceedDisabled}
          title={isProceedDisabled ? "Please fill all required fields" : "Proceed to testing screen"}
        >
          Proceed to Test
        </button>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-w-md w-full p-6 text-slate-200">
                <h2 className="text-2xl font-bold mb-4 text-yellow-400">Save Entry Set</h2>
                <p className="text-slate-400 mb-4">Save the current set of <span className="font-bold text-yellow-500">{entries.length}</span> {entries.length === 1 ? 'entry' : 'entries'} for future use.</p>
                <label htmlFor="setName" className="block text-sm font-medium text-slate-400 mb-2">Save as:</label>
                <input id="setName" type="text" value={newSetName} onChange={(e) => setNewSetName(e.target.value)} placeholder="e.g., Senior Developer Searches" className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200" />
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition text-slate-200 font-semibold">Cancel</button>
                    <button onClick={handleConfirmSave} disabled={!newSetName.trim()} className="bg-yellow-500 text-slate-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50">
                      {savedSets.some(s => s.name === newSetName.trim()) ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FormScreen;