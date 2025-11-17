import React, { useState, useEffect, Suspense, lazy } from 'react';
import { WebhookIcon, SpinnerIcon } from './components/icons';
import { Entry } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';

const FormScreen = lazy(() => import('./components/FormScreen'));
const WebhookScreen = lazy(() => import('./components/WebhookScreen'));

const initialEntries: Entry[] = [
  {
    id: Date.now(),
    jobRole: 'Software Engineer',
    location: 'San Francisco, CA',
    experienceLevel: 'mid_senior',
    dateRange: 'week',
    linkedinUrl: 'https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer&location=San%20Francisco%2C%20CA',
  },
];

function App() {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [currentScreen, setCurrentScreen] = useState<'form' | 'webhook'>('form');
  const [theme] = useTheme();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentScreen(hash === '#/webhook' ? 'webhook' : 'form');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 min-h-screen font-sans transition-colors duration-300">
      <ThemeToggle />
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center bg-yellow-600/10 p-2 rounded-full mb-4 border border-yellow-700/50">
                <WebhookIcon className="w-12 h-12 text-yellow-500" />
            </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Lead Automation 
          </h1>
        
        </header>
        
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex justify-center items-center p-16">
              <SpinnerIcon className="w-12 h-12 text-yellow-500" />
            </div>
          }>
            {currentScreen === 'form' ? (
              <FormScreen entries={entries} setEntries={setEntries} />
            ) : (
              <WebhookScreen entries={entries} />
            )}
          </Suspense>
        </ErrorBoundary>

      </main>
      <footer className="text-center p-6 text-sm text-slate-500">
        <p>Built for testing webhook integrations.</p>
      </footer>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
};

export default App;