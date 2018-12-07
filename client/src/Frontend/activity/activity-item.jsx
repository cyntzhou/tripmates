import React from "react";
import { DragSource } from 'react-dnd';
import { ITEM } from '../itemTypes';
import moment from 'moment';
import styles from "./activity-item.css";

const source = {
	beginDrag(props) {
    return {};
	},
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    const { toggleCreateEventModal, activity } = props;
    toggleCreateEventModal("","", activity.id);
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

class ActivityItem extends React.Component {
  constructor() {
    super()
    this.state = {
      expand: false
    }
  }

  toggleDetails = () => {
    this.setState({
      expand: !this.state.expand
    })
  }

  getOpenHours = () => {
    const hours = [];
    this.props.activity.openHours.forEach((timeSeg) => {
      const formatStart = moment([
        2018, 10, 20,
        parseInt(timeSeg.startTime.substring(0,2)),
        parseInt(timeSeg.startTime.substring(3))
      ]);
      const formatEnd = moment([
        2018, 10, 20,
        parseInt(timeSeg.endTime.substring(0,2)),
        parseInt(timeSeg.endTime.substring(3))
      ]);
      hours.push({
        resourceId: timeSeg.day,
        start: formatStart._d,
        end: formatEnd._d
      })
    })
    return hours
  }

  render() {
    const {
      activity,
      showEditModal,
      connectDragSource, 
      isDragging
    } = this.props;
    const {
      name,
      category,
      suggestedDuration,
      address,
      placeName
    } = activity;

    const suggestedHours = Math.floor(suggestedDuration/60) || 0;
    const suggestedMin = suggestedDuration%60;
    activity['formatedHours'] = this.getOpenHours();

    return connectDragSource(
      <div 
        className="activity-item-container" 
        onClick={this.toggleDetails}
        style={{ 
          opacity: isDragging ? 0.25 : 1,
        }}
      >
        <h3>{name}</h3>
        {this.state.expand && 
          <div className="details">
            {category && <p>Category: {category}</p>}
            {suggestedDuration !== 0 && <p>Suggested Duration: {suggestedHours} Hrs {suggestedMin} Min</p>}
            {placeName && <p>Place: {placeName}</p>}
            {address && <p>Address: {address}</p>}
            <i onClick={() => showEditModal(this.props.activity)} className="fa fa-edit"/>
          </div>
        }
      </div>
    )
  }
}

export default DragSource(ITEM, source, collect)(ActivityItem);