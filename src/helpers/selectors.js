export function getAppointmentsForDay(state, day) {
  let appointmentsForDay = [];
  const selectedDay = state.days.filter(days => days.name === day);
  if(state.days.length === 0 || selectedDay.length === 0) {
    return appointmentsForDay;
  }
  const selectedDayAppointments = selectedDay[0].appointments;
  
  for(let appointment of selectedDayAppointments) {
    appointmentsForDay.push(state.appointments[appointment]);
  }

  return appointmentsForDay;
}