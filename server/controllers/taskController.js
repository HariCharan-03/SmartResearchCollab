const Task = require('../models/Task');
const Idea = require('../models/Idea');

exports.createTask = async (req, res) => {
  try {
    const { projectId, title, description, assignedTo, deadline } = req.body;
    
    // Auth check
    const idea = await Idea.findById(projectId);
    if (!idea) return res.status(404).json({ message: 'Project not found' });

    // Only project creator or admin can create tasks
    if (idea.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to create tasks' });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      assignedTo,
      deadline
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasksForProject = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = req.body.status || task.status;
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.assignedTo = req.body.assignedTo || task.assignedTo;
    task.deadline = req.body.deadline || task.deadline;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const idea = await Idea.findById(task.projectId);
    if (idea && idea.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
