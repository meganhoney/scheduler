import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (nextMode, replace = false) => {
    setMode(nextMode);
    if(!replace) {
      setHistory((prev) => [...prev,nextMode]);
    }
  }

  const back = () => {
    if(history.length > 1) {
      history.pop();
      setMode(history[history.length - 1]);
    }
  }

  return { mode, transition, back };
};