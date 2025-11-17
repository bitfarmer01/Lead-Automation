import React, { useState, useEffect } from 'react';
import { Entry } from '../types';
import { CodeBlock } from './CodeBlock';
import { SpinnerIcon, TrashIcon, SaveIcon, ArrowLeftIcon, ChevronDownIcon, ChevronUpIcon } from './icons';
import { useWebhookTester } from '../hooks/useWebhookTester';

interface WebhookScreenProps {
  entries: Entry[];
}

const formatResponseBody = (body: string): string => {
  try { return JSON.stringify(JSON.parse(body), null, 2); } catch { return body; }
};

const getStatusColor = (status: number): string => {
  if (status >= 200 && status < 300) return 'bg-green-600 text-white';
  if (status >= 300 && status < 400) return 'bg-yellow-600 text-slate-900';
  if (status >= 400 && status < 500) return 'bg-orange-600 text-white';
  if (status >= 500) return 'bg-red-600 text-white';
  return 'bg-slate-600 text-slate-200';
};

function WebhookScreen({ entries }: WebhookScreenProps) {
  const {
    webhookUrl,
    jsonPayload,
    isTesting,
    error,
    response,
    showConfirmation,
    setShowConfirmation,
    savedWebhooks,
    selectedWebhookName,
    showSaveModal,
    setShowSaveModal,
    newWebhookName,
    setNewWebhookName,
    handleWebhookUrlChange,
    handleOpenConfirmation,
    handleTestWebhook,
    handleOpenSaveModal,
    handleConfirmSave,
    handleSelectWebhook,
    handleDeleteSelectedWebhook,
  } = useWebhookTester({ entries });

  const [isResponseExpanded, setIsResponseExpanded] = useState(false);

  useEffect(() => {
    // When a new response comes in, start with it collapsed.
    if (response) {
      setIsResponseExpanded(false);
    }
  }, [response]);

  return (
    <div className="space-y-8 relative">
       <button 
          onClick={() => window.location.hash = '#/'} 
          className="absolute -top-8 -left-4 flex items-center gap-2 text-slate-500 hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400 transition-colors"
       >
         <ArrowLeftIcon className="w-5 h-5" />
         Back to Form
       </button>

       {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <section className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-slate-900 dark:text-slate-100">
          <span className="bg-yellow-500 dark:bg-yellow-600 text-slate-900 rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold">2</span>
          Your Webhook URL
        </h2>
        <div className="space-y-4">
          <div className="flex gap-2 items-center">
            <select 
              value={selectedWebhookName} 
              onChange={e => handleSelectWebhook(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200"
            >
              <option value="">Load a saved URL...</option>
              {savedWebhooks.map(w => <option key={w.name} value={w.name}>{w.name}</option>)}
            </select>
            {selectedWebhookName && (
              <button onClick={handleDeleteSelectedWebhook} className="p-3 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition" title="Delete selected webhook">
                <TrashIcon className="w-6 h-6"/>
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => handleWebhookUrlChange(e.target.value)}
              placeholder="https://your-service.com/api/webhook"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200"
            />
            <button onClick={handleOpenSaveModal} className="p-3 bg-slate-200 text-yellow-600 dark:bg-slate-700 dark:text-yellow-400 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition" title="Save this URL">
                <SaveIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
      
      <section className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-slate-900 dark:text-slate-100">
          <span className="bg-yellow-500 dark:bg-yellow-600 text-slate-900 rounded-full h-8 w-8 flex items-center justify-center mr-3 font-bold">3</span>
          Review Payload
        </h2>
        <CodeBlock code={jsonPayload} />
      </section>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleOpenConfirmation}
          className="flex items-center justify-center bg-yellow-500 text-slate-900 font-bold text-lg px-8 py-4 rounded-lg hover:bg-yellow-600 transition transform hover:scale-105 duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
          disabled={!webhookUrl || isTesting}
        >
          Test Webhook
        </button>
      </div>
      
      {response && (
        <section className="bg-white dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Response</h2>
            <button 
                onClick={() => setIsResponseExpanded(!isResponseExpanded)}
                className="flex items-center gap-2 text-slate-600 hover:text-yellow-600 dark:text-slate-400 dark:hover:text-yellow-400 transition-colors"
            >
                {isResponseExpanded ? 'Collapse' : 'Expand Details'}
                {isResponseExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
            </button>
          </div>
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300">Status:</span>
            <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(response.status)}`}>
              {response.status} {response.statusText}
            </span>
          </div>
          {isResponseExpanded && (
            <>
              <div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Headers</h3>
                <CodeBlock code={JSON.stringify(response.headers, null, 2)} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Body</h3>
                <CodeBlock code={formatResponseBody(response.body)} />
              </div>
            </>
          )}
        </section>
      )}

      {showConfirmation && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-w-lg w-full p-6 text-slate-900 dark:text-slate-200">
              <h2 className="text-2xl font-bold mb-4 text-yellow-500 dark:text-yellow-400">Confirm Payload</h2>
              <p className="mb-2 text-slate-600 dark:text-slate-400">You are about to send <span className="font-bold text-yellow-600 dark:text-yellow-500">{entries.length}</span> {entries.length === 1 ? 'request' : 'requests'} to:</p>
              <p className="font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded-md text-sm text-slate-800 dark:text-slate-300 break-all mb-6">{webhookUrl}</p>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-6">
                {entries.map((entry, index) => (
                   <div key={entry.id} className="p-3 bg-slate-100 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700/50 text-sm">
                     <p className="font-bold text-slate-800 dark:text-slate-300 mb-1">Request #{index+1}</p>
                     <p className="text-slate-600 dark:text-slate-400">Find <span className="text-yellow-600 dark:text-yellow-400 font-semibold">'{entry.jobRole}'</span> jobs in <span className="text-yellow-600 dark:text-yellow-400 font-semibold">'{entry.location}'</span> for <span className="text-yellow-600 dark:text-yellow-400 font-semibold">{entry.experienceLevel.replace(/_/g, ' ')}</span> level.</p>
                   </div>
                ))}
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 font-semibold">Cancel</button>
                <button onClick={handleTestWebhook} className="flex items-center justify-center bg-yellow-500 text-slate-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-70" disabled={isTesting}>
                  {isTesting ? (<><SpinnerIcon className="w-5 h-5 mr-2" /><span>Sending...</span></>) : ('Confirm & Send')}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSaveModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" aria-modal="true" role="dialog">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-w-md w-full p-6 text-slate-900 dark:text-slate-200">
                    <h2 className="text-2xl font-bold mb-4 text-yellow-500 dark:text-yellow-400">Save Webhook URL</h2>
                    <p className="font-mono bg-slate-100 dark:bg-slate-900 p-2 rounded-md text-sm text-slate-800 dark:text-slate-300 break-all mb-4">{webhookUrl}</p>
                    <label htmlFor="webhookName" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Save as:</label>
                    <input id="webhookName" type="text" value={newWebhookName} onChange={(e) => setNewWebhookName(e.target.value)} placeholder="e.g., Staging API" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition duration-200" />
                    <div className="flex justify-end gap-4 mt-6">
                        <button onClick={() => setShowSaveModal(false)} className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-slate-200 font-semibold">Cancel</button>
                        <button onClick={handleConfirmSave} disabled={!newWebhookName.trim()} className="bg-yellow-500 text-slate-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50">Save</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default WebhookScreen;