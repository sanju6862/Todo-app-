

const today = new Date().toISOString();

const todayDate = today.split('T')[0];

const todayLocalDate = new Date().toLocaleDateString();

const draftTomorrow = new Date(today);
const formatedTomorrow = draftTomorrow.setDate(draftTomorrow.getDate() + 1);
const formatedWeek = draftTomorrow.setDate(draftTomorrow.getDate() + 7);


const tomorrow = new Date(formatedTomorrow).toISOString();


const tomorrowDate = tomorrow.split('T')[0];

const tomorrowLocalDate = new Date(formatedTomorrow).toLocaleDateString();

const week = new Date(formatedWeek).toISOString();


const weekDate = week.split('T')[0];

 
const weekLocalDate = new Date(formatedWeek).toLocaleDateString();

const localDate = [todayLocalDate];
const draftLocal = new Date(today);
for (let i=0; i<6; i++) {
  const nextLocalDay = draftLocal.setDate(draftLocal.getDate() - 1);
  localDate.push(new Date(nextLocalDay).toLocaleDateString());
}
const localDates = localDate.reverse();

export {today, todayDate, todayLocalDate, tomorrow,
  tomorrowDate, tomorrowLocalDate, week, weekDate, weekLocalDate,
  localDates};
