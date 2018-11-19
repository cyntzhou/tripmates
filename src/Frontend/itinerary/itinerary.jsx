import React from "react";
import moment from 'moment';
import styles from "./itinerary.css";
import Calendar from './calendar.jsx';

const existingEvents = [
  {
    title: "Dim sum",
    start: new Date(2018, 10, 19, 10, 30),
    end: new Date(2018, 10, 19, 12, 30),
    allDay: false
  }
]

class Itinerary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      existingEvents: existingEvents,
    }
  }

  render() {
    const {
      existingEvents
    } = this.state;
    return (
      <div className="itinerary-container">
        <div className="itinerary-header">
          <span className="center-vertically">
            <h2>Itinerary</h2>
          </span>
          <span className="center-vertically">
            <button className="itinerary-dropdown-button">
              <i className="fa fa-caret-down" aria-hidden="true"/>
            </button>
          </span>
        </div>
        <Calendar
          existingEvents={existingEvents}
        />
      </div>
    )
  }
}

export default Itinerary
