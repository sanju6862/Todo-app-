
import React from 'react';

import {localDates} from '../../dateHelpers/dateHelpers';

// (http://recharts.org/).
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// eslint-disable-next-line require-jsdoc
export default function Overview(props) {
  console.log('barChart', props.tasks);
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

  const barData=[];
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
      barData.push({date: date, complete: 0});
    } else {
      const total = parseInt(tempTask.tasks.length);
      const completeNum = parseInt(tempTask.tasks.filter((task)=>
        task.complete === true).length);
      const complete = ((100/total)*completeNum);
      console.log(total, typeof total, completeNum, typeof completeNum);
      barData.push({date: date, complete: Math.floor(complete)});
    }
  };
  console.log('barData', barData);

  return (
    <ResponsiveContainer width="95%" height={280}>
      <BarChart
        data={barData}
        barGap={2}
        margin={{
          top: 30,
          right: 0,
          left: 5,
          bottom: 30,
        }}
        barSize={30}>
        <XAxis
          dataKey="date"
          scale="point"
          padding={{
            left: 10,
            right: 10,
          }}/>
        <YAxis label="%"/>
        <Tooltip/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Bar
          dataKey="complete"
          fill="#82b5f2"
          background={{
            fill: '#fd76a2',
          }}/>
      </BarChart>
    </ResponsiveContainer>);
}
