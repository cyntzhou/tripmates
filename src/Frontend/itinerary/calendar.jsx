import React from "react";
import axios from "axios";
import moment from 'moment';
import styles from "./calendar.css";
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { formatDate } from "../utils.js";

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

class Calendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: props.existingEvents,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ events: nextProps.existingEvents });
  }

  saveEvent = (event, start, end) => {
    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);

    const bodyContent = {
      newStart: formattedStart,
      newEnd: formattedEnd
    };
    axios
      .put(`/api/events/${event.id}`, bodyContent)
      .then(res => {
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 403) {
          alert("You cannot edit this event since another user has deleted this trip.");
          // TODO lead back to trips page
        }
        if (err.response.status === 404) {
          alert("You cannot edit this event since another user has deleted it.");
        }
      });
  }

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state

    const idx = events.indexOf(event)
    let allDay = event.allDay

    // TODO: all day
    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    });
    this.saveEvent(event, start, end);
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state;

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    });

    this.setState({
      events: nextEvents,
    });

    this.saveEvent(event, start, end);
  }

  createEvent = ({ start, end }) => {
    const startDateTime = new Date(start).toISOString().slice(0,16);
    const endDateTime = new Date(start).toISOString().slice(0,16);
    this.props.toggleCreateEventModal(startDateTime, endDateTime);
  }

  render() {
    return (
      <DragAndDropCalendar
        selectable
        localizer={localizer}
        events={this.state.events}
        // events={this.events}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        onSelectSlot={this.createEvent}
        onSelectEvent={event => {
          console.log(event);
          return this.props.handleSelectEvent(event)
        }}
        defaultView={BigCalendar.Views.MONTH}
        // defaultDate={new Date(2015, 3, 12)}
        defaultDate={new Date(2018, 10, 20)}
      />
    )
  }
}

export default Calendar
