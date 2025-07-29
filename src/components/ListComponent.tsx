import React, { useState } from "react";
import { Plus} from "lucide-react";

interface Task {
  title: string;
  subtasks: Task[];
}

interface ListComponentProps {
  tasks: Task[];
  onTasksUpdate?: (updatedTasks: Task[]) => void;
  level?: number;
  isDark?: boolean;
}

const ListComponent: React.FC<ListComponentProps> = ({
  tasks,
  onTasksUpdate,
  level = 0,
  isDark = false,
}) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [inputVisible, setInputVisible] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [newSubtaskTitles, setNewSubtaskTitles] = useState<{
    [key: number]: string;
  }>({});

  const handleAddSubtask = (index: number) => {
    setInputVisible((prev) => ({ ...prev, [index]: true }));
  };

  const handleSubtaskChange = (index: number, value: string) => {
    setNewSubtaskTitles((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmitSubtask = (index: number) => {
    const updatedTasks = [...localTasks];
    const newSubtaskTitle = newSubtaskTitles[index];

    if (newSubtaskTitle.trim() === "") return;

    updatedTasks[index].subtasks.push({
      title: newSubtaskTitle.trim(),
      subtasks: [],
    });

    setLocalTasks(updatedTasks);
    setInputVisible((prev) => ({ ...prev, [index]: false }));
    setNewSubtaskTitles((prev) => ({ ...prev, [index]: "" }));

    if (onTasksUpdate) {
      onTasksUpdate(updatedTasks);
    }
  };

  const handleCancelSubtask = (index: number) => {
    setInputVisible((prev) => ({ ...prev, [index]: false }));
    setNewSubtaskTitles((prev) => ({ ...prev, [index]: "" }));
  };

  const handleKeyPress = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitSubtask(index);
    } else if (e.key === 'Escape') {
      handleCancelSubtask(index);
    }
  };

  const getIndentClass = () => {
    switch (level) {
      case 0: return "pl-0";
      case 1: return "pl-6";
      case 2: return "pl-4";
      default: return "pl-3";
    }
  };

  const getBulletColor = () => {
    if (isDark) {
      const darkColors = ["text-cyan-400", "text-emerald-400", "text-violet-400", "text-orange-400", "text-pink-400"];
      return darkColors[level % darkColors.length];
    } else {
      const lightColors = ["text-blue-600", "text-emerald-600", "text-violet-600", "text-orange-600", "text-pink-600"];
      return lightColors[level % lightColors.length];
    }
  };

  const getHoverClass = () => {
    return isDark ? "hover:bg-gray-800/50" : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50";
  };

  const getInputBg = () => {
    return isDark ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300";
  };

  const getInputFocus = () => {
    return isDark ? "focus:ring-cyan-500 focus:border-cyan-500" : "focus:ring-blue-500 focus:border-blue-500";
  };

  return (
    <div className="space-y-3 w-full flex flex-col">
      {localTasks.map((task, index) => (
        <div key={index} className={`${getIndentClass()}`}>
          <div className={`group flex items-start gap-4 p-4 rounded-xl ${getHoverClass()} transition-all duration-300 border ${isDark ? 'border-gray-700/50' : 'border-transparent hover:border-purple-200'}`}>
            <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getBulletColor()} shadow-lg`} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`font-medium leading-relaxed break-words ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                  {task.title}
                </span>
                
                <button
                  onClick={() => handleAddSubtask(index)}
                  className={`opacity-0 group-hover:opacity-100 flex items-center justify-center w-4 h-4 rounded-full transition-all duration-300 flex-shrink-0 ml-3 ${
                    isDark 
                      ? 'hover:bg-cyan-500/20 text-white-400 hover:text-cyan-300' 
                      : 'hover:bg-blue-100 text-white-600 hover:text-green-700 hover:shadow-md'
                  }`}
                  title="Add Subtask"
                >
                  <Plus className="bg-white-500" size={18} />+
                </button>
              </div>

              {inputVisible[index] && (
                <div className={`mt-4 p-4 rounded-xl shadow-lg border ${
                  isDark 
                    ? 'bg-gray-800/80 border-gray-600 backdrop-blur-sm' 
                    : 'bg-white/90 border-gray-200 backdrop-blur-sm'
                }`}>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter subtask title..."
                      value={newSubtaskTitles[index] || ""}
                      onChange={(e) => handleSubtaskChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyPress(index, e)}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${getInputBg()} ${getInputFocus()}`}
                      autoFocus
                    />
                    <button
                      onClick={() => handleSubmitSubtask(index)}
                      disabled={!newSubtaskTitles[index]?.trim()}
                      className="flex items-center justify-center w-11 h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Add subtask (Enter)"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => handleCancelSubtask(index)}
                      className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        isDark
                          ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                          : 'bg-gray-400 hover:bg-gray-500 text-white'
                      }`}
                      title="Cancel (Esc)"
                    >
                     
                    </button>
                  </div>
                  <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Press <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>Enter</kbd> to add • Press <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>Esc</kbd> to cancel
                  </p>
                </div>
              )}

              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-4">
                  <ListComponent
                    tasks={task.subtasks}
                    level={level + 1}
                    isDark={isDark}
                    onTasksUpdate={(updatedSubtasks) => {
                      const updated = [...localTasks];
                      updated[index].subtasks = updatedSubtasks;
                      setLocalTasks(updated);
                      if (onTasksUpdate) onTasksUpdate(updated);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListComponent;