import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosInstance';
import toast from 'react-hot-toast';

const TaskBoard = () => {
  const { id } = useParams();
  const [tasks, setTasks] = useState({ Todo: [], 'In Progress': [], Done: [] });
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks/project/${id}`);
      const grouped = { Todo: [], 'In Progress': [], Done: [] };
      res.data.forEach(task => {
        if(grouped[task.status]) grouped[task.status].push(task);
      });
      setTasks(grouped);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, projectId: id });
      toast.success('Task created');
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      toast.error('Failed to create task. Are you the creator?');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const StatusColumn = ({ status, items }) => (
    <div className="bg-surface/50 rounded-xl p-4 min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">{status}</h3>
        <span className="bg-surface px-2 py-0.5 rounded text-xs text-gray-400">{items.length}</span>
      </div>
      <div className="space-y-3">
        {items.map(task => (
           <div key={task._id} className="glass-panel p-3 text-sm rounded cursor-pointer border border-gray-800 hover:border-primary/50 transition-colors">
              <h4 className="font-medium mb-1">{task.title}</h4>
              {task.description && <p className="text-gray-400 text-xs mb-3">{task.description}</p>}
              
              <div className="flex gap-2">
                {['Todo', 'In Progress', 'Done'].filter(s => s !== status).map(s => (
                  <button 
                    key={s} 
                    onClick={() => updateTaskStatus(task._id, s)}
                    className="text-[10px] bg-surface px-2 py-1 rounded text-gray-400 hover:text-white transition-colors"
                  >
                    Move to {s}
                  </button>
                ))}
              </div>
           </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Project Task Board</h1>
      
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="font-bold mb-4">Create New Task</h3>
        <form onSubmit={handleCreateTask} className="flex gap-4">
          <input 
            type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Task Title" required
            className="flex-1 bg-surface border border-gray-700 text-white rounded px-4 py-2"
          />
          <input 
            type="text" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} placeholder="Short description (optional)"
            className="flex-2 bg-surface border border-gray-700 text-white rounded px-4 py-2 w-1/3"
          />
          <button type="submit" className="bg-primary hover:bg-indigo-600 px-6 rounded font-medium">Add</button>
        </form>
      </div>

      {loading ? (
         <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusColumn status="Todo" items={tasks['Todo']} />
          <StatusColumn status="In Progress" items={tasks['In Progress']} />
          <StatusColumn status="Done" items={tasks['Done']} />
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
