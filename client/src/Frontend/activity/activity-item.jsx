import React from "react";
import { DragSource } from 'react-dnd';
import { ITEM } from '../itemTypes';
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