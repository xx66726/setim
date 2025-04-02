import { MessageSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface LoadingStateProps {
  message: string;
}

const LoadingState = ({ message }: LoadingStateProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
          <div className="mt-4 flex items-center">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
