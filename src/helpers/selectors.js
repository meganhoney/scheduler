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
};

export function getInterview(state, interview) {
  if(!interview) return null;

  let interviewObj = {};
  interviewObj.student = interview.student;
  interviewObj.interviewer = state.interviewers[interview.interviewer];
  return interviewObj;

};

export function getInterviewersForDay(state, day) {
  let interviewersForDay = [];
  const selectedDay = state.days.filter(days => days.name === day);

  if(state.days.length === 0 || selectedDay.length === 0) {
    return interviewersForDay;
  }
  const selectedDayInterviewers = selectedDay[0].interviewers;
  
  for(let interviewer of selectedDayInterviewers) {
    interviewersForDay.push(state.interviewers[interviewer]);
  }
  
  return interviewersForDay;
  
};