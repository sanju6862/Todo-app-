 
const DataLoader = require('dataloader'); // to prevent duplicate requests

const Task = require('../../models/task');
const User = require('../../models/user');
const {
  dateToString,
} = require('../../helpers/date');

const taskLoader = new DataLoader((taskIds) => {
  return tasks(taskIds);
});

const userLoader = new DataLoader((userIds) => {
  return User.find({
    _id: {
      $in: userIds,
    },
  });
});

// tasks() and user() help to avoid infinite loop.

// $in is the special operator in mongoDB syntax to find all tasks with id.
const tasks = async (taskIds) => {
  try {
    const tasks = await Task.find({
      _id: {
        $in: taskIds,
      },
    });
    // to sort the tasks to the same order with taskIds
    tasks.sort((a, b) => {
      return taskIds.indexOf(a._id.toString()) -
      taskIds.indexOf(b._id.toString());
    });
    return tasks.map((task) => {
      return transformTask(task);
    });
  } catch (err) {
    throw err;
  }
};

// This function acts like .population(), mongoose's method that adds relation
// In this case - add user's(creator's) info to the task
const user = async (userId) => {
  try {
    // instead of using User.findById(userId) we use the dataloader
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdTasks: () => taskLoader.loadMany(user._doc.createdTasks),
      password: null,
    };
  } catch (err) {
    throw err;
  }
};

// The function which transforms the task
// into the object with the needed format.
// This function was created to replace repeated code.
const transformTask = (task) => {
  return {
    ...task._doc,
    _id: task.id,
    date: dateToString(task._doc.date),
    creator: user.bind(this, task.creator),
  };
};

exports.transformTask = transformTask;
