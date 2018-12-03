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
      openHours: this.props.openHours
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ openHours: nextProps.openHours });
  }

  moveEvent = (slotInfo) => {
    const { openHours } = this.state
    const { event, start, end, resourceId } = slotInfo

    const idx = openHours.indexOf(event)

    event.resourceId = resourceId
    const updatedEvent = { ...event, start, end }

    const nextOpenHours = [...openHours]
    nextOpenHours.splice(idx, 1, updatedEvent)

    this.props.updateHours(nextOpenHours)
  }

  resizeEvent = ({ event, start, end }) => {
    const { openHours } = this.state

    const nextEvents = openHours.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      openHours: nextEvents,
    })
  }

  createEvent = (slotInfo) => {
    const { openHours } = this.state
    const nextOpenHours = [...openHours]
    nextOpenHours.push({
      resourceId: slotInfo.resourceId, 
      start: slotInfo.start, 
      end: slotInfo.end
    })
    this.props.updateHours(nextOpenHours)
  }

  // removes event
  selectEvent = (event) => {
    const { openHours } = this.state
    const idx = openHours.indexOf(event)

    const nextOpenHours = [...openHours]
    nextOpenHours.splice(idx, 1)

    this.props.updateHours(nextOpenHours)
  }

  render() {
    
    const dayMap = [
      { resourceId: 0, resourceTitle: 'Sunday' },
      { resourceId: 1, resourceTitle: 'Monday' },
      { resourceId: 2, resourceTitle: 'Tuesday' },
      { resourceId: 3, resourceTitle: 'Wednesday' },
      { resourceId: 4, resourceTitle: 'Thursday' },
      { resourceId: 5, resourceTitle: 'Friday' },
      { resourceId: 6, resourceTitle: 'Saturday' },
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
        onSelectEvent={this.selectEvent}
        defaultView={BigCalendar.Views.DAY}
        views={['day']}
        defaultDate={new Date(2018, 10, 20)}
        resources={dayMap}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
      />
    )
  }
}

export default OpenHoursCalendar