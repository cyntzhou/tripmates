
// import React from "react";
// import styles from "./itinerary.css";
// import BigCalendar from 'react-big-calendar'
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

// import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'

// const DragAndDropCalendar = withDragAndDrop(BigCalendar)

// class Itinerary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       events: events,
//     }

//     this.moveEvent = this.moveEvent.bind(this)
//     this.newEvent = this.newEvent.bind(this)
//   }

//   moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
//     const { events } = this.state

//     const idx = events.indexOf(event)
//     let allDay = event.allDay

//     if (!event.allDay && droppedOnAllDaySlot) {
//       allDay = true
//     } else if (event.allDay && !droppedOnAllDaySlot) {
//       allDay = false
//     }

//     const updatedEvent = { ...event, start, end, allDay }

//     const nextEvents = [...events]
//     nextEvents.splice(idx, 1, updatedEvent)

//     this.setState({
//       events: nextEvents,
//     })

//     // alert(`${event.title} was dropped onto ${updatedEvent.start}`)
//   }

//   resizeEvent = ({ event, start, end }) => {
//     const { events } = this.state

//     const nextEvents = events.map(existingEvent => {
//       return existingEvent.id == event.id
//         ? { ...existingEvent, start, end }
//         : existingEvent
//     })

//     this.setState({
//       events: nextEvents,
//     })

//     //alert(`${event.title} was resized to ${start}-${end}`)
//   }

//   newEvent(event) {
//     // let idList = this.state.events.map(a => a.id)
//     // let newId = Math.max(...idList) + 1
//     // let hour = {
//     //   id: newId,
//     //   title: 'New Event',
//     //   allDay: event.slots.length == 1,
//     //   start: event.start,
//     //   end: event.end,
//     // }
//     // this.setState({
//     //   events: this.state.events.concat([hour]),
//     // })
//   }

//   render() {
//     return (
//       <DragAndDropCalendar
//         selectable
//         localizer={this.props.localizer}
//         events={this.state.events}
//         onEventDrop={this.moveEvent}
//         resizable
//         onEventResize={this.resizeEvent}
//         onSelectSlot={this.newEvent}
//         defaultView={BigCalendar.Views.MONTH}
//         defaultDate={new Date(2015, 3, 12)}
//       />
//     )
//   }
// }

// export default Itinerary


import React from "react";
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

const myEventsList = [
  {
    title: "Dim sum",
    start: Date.now(),
    end: Date.now(),
    allDay: true
  }
]

const Itinerary = props => (
  <div className="itinerary-container">
    <div className="itinerary-header">
      <h2>Itinerary</h2>
    </div>
    <BigCalendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
    />
  </div>
)
export default Itinerary
