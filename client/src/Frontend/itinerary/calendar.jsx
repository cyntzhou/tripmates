import React from "react";
import axios from "axios";
import moment from 'moment';
import styles from "./calendar.css";
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { DropTarget } from 'react-dnd';
import { ITEM } from '../itemTypes';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { formatDate } from "../utils.js";

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

const target = {
  drop(props) {
    return ({
    });
  }
}

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

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
    const {
      connectDropTarget, 
      isOver,
      defaultDate
    } = this.props;
    
    return connectDropTarget(
      <div className='calendar'>
        {isOver &&
          <div style={{
            position: 'relative',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            zIndex: 1,
            opacity: 0.5,
            backgroundColor: 'white',
            textAlign: 'center',
            fontSize: '1.3em'
          }}>
            <br/>
            Drop activity here to create an event
          </div>
        }
        {!isOver &&
          <DragAndDropCalendar
            selectable
            localizer={localizer}
            events={this.state.events}
            onEventDrop={this.moveEvent}
            resizable
            onEventResize={this.resizeEvent}
            onSelectSlot={this.createEvent}
            onSelectEvent={event => {
              return this.props.handleSelectEvent(event)
            }}
            defaultView={BigCalendar.Views.MONTH}
            defaultDate={new Date(defaultDate)}
          />
        }
      </div>
    )
  }
}

export default DropTarget(ITEM, target, collect)(Calendar)
