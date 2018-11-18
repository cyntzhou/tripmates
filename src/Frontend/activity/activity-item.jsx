import React from "react";
import styles from "./activity-item.css";

class ActivityItem extends React.Component {
  constructor() {
    super()
    this.state = {
      expand: false
    }
  }

  render() {
    const {
      activityName,
      category,
      suggestedDuration,
      votes
    } = this.props;
    return (
      <div className="activity-item-container">
        <h3>{activityName}</h3>
        <div className="details">
          
        </div>
      </div>
    )
  }
}

export default ActivityItem;