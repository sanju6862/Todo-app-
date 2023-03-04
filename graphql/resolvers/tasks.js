 
const Task = require('../../models/task');
const User = require('../../models/user');
const {transformTask} = require('../../graphql/resolvers/merge');

module.exports = {
  tasks: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      // to find only tasks for creator-user
      const tasks = await Task.find({creator: req.userId});
      return tasks.map((task) => {
        return transformTask(task);
      });
    } catch (err) {
      throw err;
    }
  },
  createTask: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    const task = new Task({
      title: args.taskInput.title,
      priority: +args.taskInput.priority,
      date: args.taskInput.date,
      complete: args.taskInput.complete,
      start: args.taskInput.start,
      end: args.taskInput.end,
      intervalK: +args.taskInput.intervalK,
      intervalN: args.taskInput.intervalN,
      creator: req.userId,
    });
    let createdTask;
    try {
      const result = await task.save();
      createdTask = transformTask(result);
      const creator = await User.findById(req.userId);

      // Checking whether the user who is creating this task exists in the
      // database.
      // If yes, we push this task to user's data and update it
      if (!creator) {
        throw new Error('User not found');
      }
      creator
          .createdTasks
          .push(task); // createdTasks from user.js/userSchema
      await creator.save();

      return createdTask;
    } catch (err) {
      console.log(err);
      throw err;
    };
  },
  updateTask: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const task = await Task.findById(args.taskId);
      if (args.taskInput.title) {
        task.title = args.taskInput.title;
      }
      if (args.taskInput.priority) {
        task.priority = args.taskInput.priority;
      }
      if (args.taskInput.date) {
        task.date = args.taskInput.date;
      }
      if (args.taskInput.start) {
        task.start = args.taskInput.start;
        task.end = args.taskInput.end;
        task.intervalK = args.taskInput.intervalK;
        task.intervalN = args.taskInput.intervalN;
      }
      await Task
          .findByIdAndUpdate(args.taskId, {
            $set: {
              title: task.title,
              priority: +task.priority,
              date: task.date,
              start: task.start,
              end: task.end,
              intervalK: +task.intervalK,
              intervalN: task.intervalN,
            },
          })
          .exec();
      return await Task.findById(args.taskId);
    } catch (err) {
      throw err;
    };
  },
  completeTask: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const task = await Task.findById(args.taskId);
      // To check if the task with repeat feature.
      if (task.end !== null) {
        let newTaskDate;
        const dt = new Date(task.date);
        switch (task.intervalN) {
          case 'year':
            newTaskDate = dt.setFullYear(dt.getFullYear() + task.intervalK);
            break;
          case 'month':
            newTaskDate = dt.setMonth(dt.getMonth() + task.intervalK);
            break;
          case 'week':
            newTaskDate = dt.setDate(dt.getDate() + (7 * task.intervalK));
            break;
          default:
            newTaskDate = dt.setDate(dt.getDate() + task.intervalK);
        }
        if (newTaskDate > task.end) {
          task.date = task.end;
          task.complete = true;
        } else {
          // To assign the new date to this repeated task according
          // to parameters intervalN and intervalK (see above).
          task.date = newTaskDate;
          task.complete = false;
        }
        await Task
            .findByIdAndUpdate(args.taskId, {
              $set: {
                date: task.date,
                complete: task.complete,
              },
            })
            .exec();
        return await Task.findById(args.taskId);
      } else {
        // This case if the task without repeat feature.
        // To allow a user to mark task like done and undone.
        if (task.complete === false) {
          task.complete = true;
        } else {
          task.complete = false;
        }
        await Task
            .findByIdAndUpdate(args.taskId, {
              $set: {
                complete: task.complete,
              },
            })
            .exec();
        return await Task.findById(args.taskId);
      }
    } catch (err) {
      throw err;
    };
  },
  deleteTask: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated');
    }
    try {
      const task = await Task.findById(args.taskId);
      await Task.deleteOne({_id: args.taskId});
      return task;
    } catch (err) {
      throw err;
    };
  },
};
