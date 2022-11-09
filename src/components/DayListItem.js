import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss"

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", { "day-list__item--selected": props.selected }, { "day-list__item--full": !props.spots });

  const formatSpots = function() {
    if(props.spots === 0) {
      return "no spots remaining";
    } else if (props.spots === 1) {
      return `${props.spots} spot remaining`;
    } else {
      return `${props.spots} spots remaining`;
    }
  };

  return (
    <li onClick={() => props.setDay(props.name)} className={dayClass}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}

// this component takes in three attributes (name, spots, selected) and one action (setDay) as props
// the li represents the entire day item
// the h2 should display the day name
// the h3 should display the spots remaining for the day