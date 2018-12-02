import React from "react";
import moment from 'moment';
import BigCalendar from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DragAndDropCalendar = withDragAndDrop(BigCalendar)
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

class OpenHoursCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openHours: props.openHours,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ openHours: nextProps.openHours });
  }

  moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    const { events } = this.state

    const idx = events.indexOf(event)
    let allDay = event.allDay

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false
    }

    const updatedEvent = { ...event, start, end, allDay }

    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)

    this.setState({
      events: nextEvents,
    })
  }

  resizeEvent = ({ event, start, end }) => {
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })
  }

  createEvent = ({ start, end }) => {
    const startDateTime = new Date(start).toISOString().slice(0,16);
    const endDateTime = new Date(start).toISOString().slice(0,16);
    // this.props.toggleCreateEventModal(startDateTime, endDateTime);
  }

  render() {

    const dayMap = [
      { resourceId: 1, resourceTitle: 'Sunday' },
      { resourceId: 2, resourceTitle: 'Monday' },
      { resourceId: 3, resourceTitle: 'Tuesday' },
      { resourceId: 4, resourceTitle: 'Wednesday' },
      { resourceId: 5, resourceTitle: 'Thursday' },
      { resourceId: 6, resourceTitle: 'Friday' },
      { resourceId: 7, resourceTitle: 'Saturday' },
    ]

    return (
      <DragAndDropCalendar
        selectable
        localizer={localizer}
        events={this.state.openHours}
        onEventDrop={this.moveEvent}
        resizable
        onEventResize={this.resizeEvent}
        onSelectSlot={this.createEvent}
        defaultView={BigCalendar.Views.DAY}
        defaultDate={new Date(2018, 10, 20)}
        resources={dayMap}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
      />
    )
  }
}

export default OpenHoursCalendar