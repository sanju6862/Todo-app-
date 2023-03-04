
import React from 'react';
import ListsContext from '../../../context/lists-context';

import DayList from './DayList';
import {todayDate, todayLocalDate,
  weekLocalDate} from '../../../dateHelpers/dateHelpers';

const lists = (props) => {
  // Divide tasks according to their date and completed status.
  const lists = props.tasks.reduce((lists, task) => {
    let date = task.date;
    if (task.complete) {
      date = 'Complete';
    }
    if (task.date < todayDate && date !== null && date !== 'Complete') {
      date = 'Overdue';
    }
    if ( date !== null && date !== 'Overdue' && date !== 'Complete') {
      // To change dates to local time zone.
      const formatedDate = new Date(task.date).toLocaleDateString();
      date = formatedDate;// task.date.split('T')[0];
    }
    if (!lists[date]) {
      lists[date] = [];
    }
    lists[date].push(task);
    return lists;
  }, {});
  const listsGroups = Object.keys(lists).map((date) => {
    return {
      date,
      tasks: lists[date],
    };
  });
  console.log('lists/list', lists);

  let sortedAll = [];
  let sortedToday = [];
  let sorted7Days = [];
  const sortedCompleted = [];
  const withoutDate = listsGroups.find((list) => list.date === 'null');
  if (withoutDate) {
    sortedAll.push(withoutDate);
    sortedToday.push(withoutDate);
    sorted7Days.push(withoutDate);
    ;
  };
  const overdueDate = listsGroups.find((list) => list.date === 'Overdue');
  if (overdueDate) {
    sortedAll.push(overdueDate);
    sortedToday.push(overdueDate);
    sorted7Days.push(overdueDate);
    ;
  };
  const otherDate = listsGroups.filter((list) => list.date !== 'null' && list.date !== 'Overdue' && list.date !== 'Complete');
  otherDate.sort(function(a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  if (otherDate) {
    sortedAll = sortedAll.concat(otherDate)
    ;
  };
  const completeDate = listsGroups.find((list) => list.date === 'Complete');
  if (completeDate) {
    sortedAll = sortedAll.concat(completeDate);
    sortedCompleted.push(completeDate);
  };

  const todayDateList = listsGroups.filter((list) => list.date === todayLocalDate);
  if (todayDateList) {
    sortedToday = sortedToday.concat(todayDateList);
  }

  const weekDateList = listsGroups.filter((list) => list.date <= weekLocalDate);
  if (weekDateList) {
    sorted7Days = sorted7Days.concat(weekDateList);
  }

  const listsAll = sortedAll.map((task) => {
    return (
      <DayList
        key={task._id}
        date={task.date}
        tasks={task.tasks}
        authUserId={props.authUserIdMain}
        onViewDetail={props.onViewDetailMain}
        onDeleteTask={props.onDeleteTaskMain}
        onEditTask={props.onEditTaskMain}
        onCompleteTask={props.onCompleteTaskMain} />
    );
  });

  const listsToday = sortedToday.map((task)=>{
    return (
      <DayList
        key={task._id}
        date={task.date}
        tasks={task.tasks}
        authUserId={props.authUserIdMain}
        onViewDetail={props.onViewDetailMain}
        onDeleteTask={props.onDeleteTaskMain}
        onEditTask={props.onEditTaskMain}
        onCompleteTask={props.onCompleteTaskMain} />
    );
  });

  const lists7Days = sorted7Days.map((task)=>{
    return (
      <DayList
        key={task._id}
        date={task.date}
        tasks={task.tasks}
        authUserId={props.authUserIdMain}
        onViewDetail={props.onViewDetailMain}
        onDeleteTask={props.onDeleteTaskMain}
        onEditTask={props.onEditTaskMain}
        onCompleteTask={props.onCompleteTaskMain} />
    );
  });

  const listsCompleted = sortedCompleted.map((task)=>{
    return (
      <DayList
        key={task._id}
        date={task.date}
        tasks={task.tasks}
        authUserId={props.authUserIdMain}
        onViewDetail={props.onViewDetailMain}
        onDeleteTask={props.onDeleteTaskMain}
        onEditTask={props.onEditTaskMain}
        onCompleteTask={props.onCompleteTaskMain} />
    );
  });


  return (
    <ListsContext.Consumer>
      {(value) =>{
        let currectLists;
        switch (value.listsOption) {
          case 0:
            currectLists = listsAll;
            break;
          case 1:
            currectLists = listsToday;
            break;
          case 2:
            currectLists = lists7Days;
            break;
          case 4:
            currectLists = listsCompleted;
            break;
          default:
            currectLists = listsAll;
        }
        return (
          <div>
            {currectLists}
          </div>)
        ;
      }}
    </ListsContext.Consumer>);
};

export default lists;
