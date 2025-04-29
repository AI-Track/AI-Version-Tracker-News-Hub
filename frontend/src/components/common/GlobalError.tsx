import { useStore } from '@/store';
import { useEffect } from 'react';
import { AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const GlobalError = () => {
  const { globalError, clearGlobalError } = useStore();

  useEffect(() => {
    if (globalError) {
      const timer = setTimeout(clearGlobalError, 5000);
      return () => clearTimeout(timer);
    }
  }, [globalError, clearGlobalError]);

  if (!globalError) return null;

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    error: 'bg-red-50 dark:bg-red-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    info: 'bg-blue-50 dark:bg-blue-900/20',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`${bgColors[globalError.type || 'error']} p-4 rounded-lg shadow-lg max-w-md flex items-start gap-3`}>
        {icons[globalError.type || 'error']}
        <p className="flex-1 text-sm text-gray-900 dark:text-gray-100">
          {globalError.message}
        </p>
        <button
          onClick={clearGlobalError}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}; 