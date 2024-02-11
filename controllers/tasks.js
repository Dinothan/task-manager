const Task = require("../models/Task");
const { BadRequest, NotFound } = require("http-errors");

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    const task = new Task({ title, description, priority, user: req.user._id });
    await task.save();
    res.status(201).send({ task });
  } catch (error) {
    next(error);
  }
};

const GetAllTask = async (req, res, next) => {
  try {
    const task = await Task.find({ user: req.user._id }).exec();

    res.status(201).send({ task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description", "priority"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      throw new BadRequest("Invalid updates");
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      throw new NotFound("Task not found");
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send({ task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      throw new NotFound("Task not found");
    }

    res.send({ message: "Task deleted successfully", task });
  } catch (error) {
    next(error);
  }
};

const prioritizeTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (!["low", "medium", "high"].includes(priority)) {
      throw new BadRequest("Invalid priority");
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { priority },
      { new: true }
    );

    if (!task) {
      throw new NotFound("Task not found");
    }

    res.send({ task });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  GetAllTask,
  updateTask,
  deleteTask,
  prioritizeTask,
};
