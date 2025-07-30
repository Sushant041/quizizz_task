import { useState } from 'react';
import ListComponent from './components/ListComponent';
import { Sun, Moon } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks: Task[];
  isExpanded?: boolean;
}

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project documentation',
      completed: false,
      isExpanded: true,
      subtasks: [
        {
          id: '1-1',
          title: 'Write API documentation',
          completed: true,
          isExpanded: true,
          subtasks: [
            {
              id: '1-1-1',
              title: 'Research best practices',
              completed: true,
              subtasks: []
            }
          ]
        },
        {
          id: '1-2',
          title: 'Create user guide',
          completed: false,
          isExpanded: true,
          subtasks: [
            {
              id: '1-2-1',
              title: 'Add screenshots',
              completed: true,
              subtasks: []
            },
            {
              id: '1-2-2',
              title: 'Record demo videos',
              completed: false,
              subtasks: []
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Review code changes',
      completed: false,
      isExpanded: false,
      subtasks: [
        {
          id: '2-1',
          title: 'Check unit tests',
          completed: false,
          subtasks: []
        }
      ]
    },
    {
      id: '3',
      title: 'Plan next sprint',
      completed: true,
      subtasks: []
    },
    {
      id: '4',
      title: 'Design system updates',
      completed: false,
      subtasks: []
    }
  ]);

  const toggleTheme = (): void => {
    setIsDark(!isDark);
  };

  const completedTasks: number = tasks.filter(task => task.completed).length;
  const totalTasks: number = tasks.length;
  const overallProgress: number = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

 return (
  <div className={`min-h-screen transition-all duration-700 w-full ${
    isDark 
      ? 'bg-gradient-to-br from-slate-900 via-cyan-900 to-violet-900' 
      : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
  }`}>
    {/* Background decorative elements */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute -top-1/2 -right-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20 ${
        isDark ? 'bg-cyan-400' : 'bg-blue-400'
      }`} />
      <div className={`absolute -bottom-1/2 -left-1/2 w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20 ${
        isDark ? 'bg-purple-400' : 'bg-purple-400'
      }`} />
    </div>

    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className={`rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-xl border transition-all duration-700 ${
        isDark 
          ? 'bg-gray-900/40 border-gray-700/30' 
          : 'bg-white/60 border-white/40'
      }`}>
        <div className="p-4 sm:p-6 md:p-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
            <div className="text-center sm:text-left space-y-3 w-full">
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${
                isDark 
                  ? 'from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text' 
                  : 'from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text'
              }`}>
                ✨ Task Manager Pro
              </h1>
              <p className={`text-sm sm:text-base md:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Organize, track, and conquer your goals
              </p>

              {/* Progress Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Progress: {completedTasks}/{totalTasks} tasks
                </span>
                <div className="flex items-center gap-2 w-full sm:max-w-sm">
                  <div className={`flex-1 h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <span className={`text-xs sm:text-sm font-bold ${
                    isDark ? 'text-cyan-400' : 'text-blue-600'
                  }`}>
                    {Math.round(overallProgress)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <div className="self-center sm:self-start">
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-110 hover:rotate-12 ${
                  isDark 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                }`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={26} /> : <Moon size={26} />}
              </button>
            </div>
          </div>

          {/* Responsive ListComponent with Scroll */}
          <div className="w-full max-w-full overflow-x-hidden">
            <div className="overflow-auto">
              <ListComponent 
                tasks={tasks} 
                onTasksUpdate={setTasks}
                isDark={isDark}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);

};

export default App;