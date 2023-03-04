
import React from 'react';

import {localDates} from '../../dateHelpers/dateHelpers';

// (http://recharts.org/).
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// eslint-disable-next-line require-jsdoc
export default function Overview(props) {
  // Divide tasks according to their date and completed status.
  const lists = props.tasks.reduce((lists, task) => {
    let date = task.date;
    if ( date !== null) {
      // To change dates to local time zone.
      const formatedDate = new Date(task.date).toLocaleDateString();
      date = formatedDate;
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

  const areaData=[];
  for (let i = 0; i < 7; i++) {
    const tempTask = listsGroups.find((list) => list.date === localDates[i]);
    let date = new Date(localDates[i]).getDate();
    const signalDate = (date < 20) ? date : Number(('' + date).slice(-1));
    switch (signalDate) {
      case 1:
        date = date + 'st';
        break;
      case 2:
        date = date + 'nd';
        break;
      case 3:
        date = date + 'rd';
        break;
      default:
        date = date + 'th';
    }
    if (tempTask === undefined) {
      areaData.push({date: date, complete: 0, incomplete: 0});
    } else {
      const total = tempTask.tasks.length;
      const complete = tempTask.tasks.filter((task)=> task.complete === true).length;
      const incomplete = total-complete;
      areaData.push({date: date, complete: complete, incomplete: incomplete});
    }
  };

  return (
    <ResponsiveContainer width="95%" height={280}>
      <AreaChart
        data={areaData}
        margin={{
          top: 30,
          right: 0,
          left: 5,
          bottom: 30,
        }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3"/>
        <XAxis dataKey="date"/>
        <YAxis/>
        <Tooltip/>
        <Area
          type='monotoneX'
          dataKey="complete"
          stackId="1"
          stroke="#3B8BEB"
          fill="#3B8BEB"/>
        <Area
          type='monotoneX'
          dataKey="incomplete"
          stackId="1"
          stroke="#FC3C7B"
          fill="#FC3C7B"/>
      </AreaChart>
    </ResponsiveContainer>);
}
