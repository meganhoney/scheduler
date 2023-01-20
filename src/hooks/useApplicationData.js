import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  // Set day to display
  const setDay = day => setState({ ...state, day });

  // retrieve server data
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("api/interviewers")
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
    .catch((error) => {
      console.log(error);
    })
  }, [])

  // book interview appointment with http request & update local state
  function bookInterview(id, interview) {
    console.log(state);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`,{interview})
    .then(() => {
      setState({
        ...state,
        appointments
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  // cancel appointment with http request & update local state
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`, appointment)
    .then(() => {
      setState({
        ...state,
        appointments
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}