import { useState } from 'react';
import { Plus, CheckCircle2, Circle, ChevronDown, ChevronRight, Trash2, Edit3 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks: Task[];
  isExpanded?: boolean;
}

interface ListComponentProps {
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
  isDark: boolean;
}

const generateId = (): string => Math.random().toString(36).substr(2, 9);

const ListComponent: React.FC<ListComponentProps> = ({ tasks, onTasksUpdate, isDark }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const updateTask = (taskId: string, updates: Partial<Task>, taskList: Task[] = tasks): Task[] => {
    return taskList.map(task => {
      if (task.id === taskId) {
        return { ...task, ...updates };
      }
      if (task.subtasks.length > 0) {
        return { ...task, subtasks: updateTask(taskId, updates, task.subtasks) };
      }
      return task;
    });
  };

  const addSubtask = (parentId: string): void => {
    const newTask = {
      id: generateId(),
      title: 'New subtask',
      completed: false,
      subtasks: [],
      isExpanded: false
    };

    const addToParent = (taskList: Task[]): Task[] => {
      return taskList.map(task => {
        if (task.id === parentId) {
          return { 
            ...task, 
            subtasks: [...task.subtasks, newTask],
            isExpanded: true
          };
        }
        if (task.subtasks.length > 0) {
          return { ...task, subtasks: addToParent(task.subtasks) };
        }
        return task;
      });
    };

    onTasksUpdate(addToParent(tasks));
    setEditingId(newTask.id);
    setEditText('New subtask');
  };

  const deleteTask = (taskId: string): void => {
    const removeFromList = (taskList: Task[]): Task[] => {
      return taskList.filter(task => task.id !== taskId).map(task => ({
        ...task,
        subtasks: removeFromList(task.subtasks)
      }));
    };
    onTasksUpdate(removeFromList(tasks));
  };

  const startEditing = (task: Task): void => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const saveEdit = (taskId: string): void => {
    if (editText.trim()) {
      onTasksUpdate(updateTask(taskId, { title: editText.trim() }));
    }
    setEditingId(null);
    setEditText('');
  };

  interface TaskItemProps {
    task: Task;
    depth?: number;
  }

  const TaskItem: React.FC<TaskItemProps> = ({ task, depth = 0 }) => {
    const hasSubtasks = task.subtasks.length > 0;
    const completedSubtasks = task.subtasks.filter(st => st.completed).length;
    const progressPercentage = hasSubtasks ? (completedSubtasks / task.subtasks.length) * 100 : 0;

    return (
      <div className={`group transition-all duration-300 ${depth > 0 ? 'ml-6' : ''}`}>
        <div className={`relative rounded-xl p-4 mb-3 border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
          isDark 
            ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/70' 
            : 'bg-white/80 border-gray-200/50 hover:bg-white/90 hover:border-gray-300/70'
        } ${task.completed ? 'opacity-75' : ''}`}>
          
          {/* Progress bar for tasks with subtasks */}
          {hasSubtasks && (
            <div className={`absolute top-0 left-0 h-1 rounded-t-xl transition-all duration-500 ${
              isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }`} style={{ width: `${progressPercentage}%` }} />
          )}

          <div className="flex items-center gap-3">
            {/* Expand/Collapse button */}
            {hasSubtasks && (
              <button
                onClick={() => onTasksUpdate(updateTask(task.id, { isExpanded: !task.isExpanded }))}
                className={`p-1 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDark ? 'hover:bg-gray-700/50 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                {task.isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
            )}

            {/* Completion checkbox */}
            <button
              onClick={() => onTasksUpdate(updateTask(task.id, { completed: !task.completed }))}
              className={`transition-all duration-200 hover:scale-110 ${
                task.completed 
                  ? (isDark ? 'text-cyan-400' : 'text-blue-500')
                  : (isDark ? 'text-gray-500 hover:text-cyan-400' : 'text-gray-400 hover:text-blue-500')
              }`}
            >
              {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
            </button>

            {/* Task title */}
            <div className="flex-1">
              {editingId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(task.id)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') saveEdit(task.id);
                    if (e.key === 'Escape') {
                      setEditingId(null);
                      setEditText('');
                    }
                  }}
                  className={`w-full px-2 py-1 rounded-lg border-2 focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-gray-700 border-cyan-400/50 focus:border-cyan-400 text-white' 
                      : 'bg-white border-blue-400/50 focus:border-blue-500 text-gray-900'
                  }`}
                  autoFocus
                />
              ) : (
                <span 
                  className={`text-lg font-medium transition-colors cursor-pointer hover:opacity-80 ${
                    task.completed 
                      ? `line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}` 
                      : (isDark ? 'text-gray-100' : 'text-gray-800')
                  }`}
                  onClick={() => startEditing(task)}
                >
                  {task.title}
                </span>
              )}
              
              {/* Subtask progress indicator */}
              {hasSubtasks && (
                <div className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {completedSubtasks}/{task.subtasks.length} subtasks completed
                  <div className={`mt-1 w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDark ? 'bg-gradient-to-r from-cyan-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 opacity-100 transition-opacity duration-200">
              <button
                onClick={() => addSubtask(task.id)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-blue-500'
                }`}
                title="Add subtask"
              >
                <Plus size={16} />
              </button>
              
              <button
                onClick={() => startEditing(task)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-gray-700/50 text-gray-400 hover:text-yellow-400' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-yellow-500'
                }`}
                title="Edit task"
              >
                <Edit3 size={16} />
              </button>
              
              <button
                onClick={() => deleteTask(task.id)}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                  isDark 
                    ? 'hover:bg-gray-700/50 text-gray-400 hover:text-red-400' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-red-500'
                }`}
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Subtasks */}
        {hasSubtasks && task.isExpanded && (
          <div className="ml-4 space-y-2 animate-in slide-in-from-top-1 duration-300">
            {task.subtasks.map(subtask => (
              <TaskItem key={subtask.id} task={subtask} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const addNewTask = (): void => {
    const newTask = {
      id: generateId(),
      title: 'New task',
      completed: false,
      subtasks: [],
      isExpanded: false
    };
    onTasksUpdate([...tasks, newTask]);
    setEditingId(newTask.id);
    setEditText('New task');
  };

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
      
      <button
        onClick={addNewTask}
        className={`w-full p-4 rounded-xl border-2 border-dashed transition-all duration-300 hover:scale-[1.02] group ${
          isDark 
            ? 'border-gray-600 hover:border-cyan-400/50 hover:bg-gray-800/30 text-gray-400 hover:text-cyan-400' 
            : 'border-gray-300 hover:border-blue-400/50 hover:bg-blue-50/50 text-gray-500 hover:text-blue-500'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <Plus size={20} className="transition-transform duration-200 group-hover:rotate-90" />
          <span className="font-medium">Add New Task</span>
        </div>
      </button>
    </div>
  );
};

export default ListComponent;