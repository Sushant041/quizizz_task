import React, { useState } from 'react';
import ListComponent from './components/ListComponent';
import { Sun, Moon } from 'lucide-react';

const App = () => {
  const [isDark, setIsDark] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([
    {
      title: " Complete project documentation",
      subtasks: [
        {
          title: " Write API documentation",
          subtasks: [
            {
              title: " Research best practices",
              subtasks: []
            }
          ]
        },
        {
          title: " Create user guide",
          subtasks: [
            {
              title: "Add screenshots",
              subtasks: []
            },
            {
              title: " Record demo videos",
              subtasks: []
            }
          ]
        }
      ]
    },
    {
      title: " Review code changes",
      subtasks: [
        {
          title: "Check unit tests",
          subtasks: []
        }
      ]
    },
    {
      title: "Plan next sprint",
      subtasks: []
    },
    {
      title: " Design system updates",
      subtasks: []
    }
  ]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 w-full ${
      isDark 
        ? 'bg-gradient-to-br from-zinc-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="max-w-5xl mx-auto p-6">
        <div className={`rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-500 ${
          isDark 
            ? 'bg-gray-800/30 border-gray-700/50' 
            : 'bg-white/70 border-white/50'
        }`}>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r ${
                  isDark 
                    ? 'from-cyan-400 to-purple-400 text-transparent bg-clip-text' 
                    : 'from-blue-600 to-purple-600 text-transparent bg-clip-text'
                }`}>
                  ✨ Task Management
                </h1>
                <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Organize your work with style
                </p>
              </div>
              
              <button
                onClick={toggleTheme}
                className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 ${
                  isDark 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                }`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
            
            <ListComponent 
              tasks={tasks} 
              onTasksUpdate={setTasks}
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
