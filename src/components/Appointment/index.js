import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode";
import "./styles.scss"

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CANCELING = "CANCELING";
  const CONFIRM = "CONFIRM";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview)
    .then(() => transition(SHOW))
  }

  function cancel() {
    transition(CANCELING)
    props.cancelInterview(props.id)
    .then(() => transition(EMPTY))
  }

  return(
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show interview={props.interview} 
        onDelete={() => transition(CONFIRM)}/>
      )}
      {mode === CREATE && (
        <Form interviewer={props.interviewer} interviewers={props.interviewers} onCancel={() => back()} onSave={save} />
      )}
      {mode === SAVING && <Status message="Saving"/>}
      {mode === CONFIRM && (
        <Confirm
        onConfirm={cancel}
        onCancel={back}
        message="Are you sure you want to cancel?"
        />
      )}
      {mode === CANCELING && <Status message="Canceling"/>}

    </article>
  );
}