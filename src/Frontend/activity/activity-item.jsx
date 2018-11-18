import React from "react";
import styles from "./activity-item.css";

class ActivityItem extends React.Component {
  constructor() {
    super()
    this.state = {
      expand: false
    }
  }

  toggleDetails() {
    this.setState({
      expand: !this.state.expand
    })
  }

  render() {
    const {
      activityName,
      category,
      suggestedDuration,
      votes
    } = this.props;
    return (
      <div className="activity-item-container" onClick={this.toggleDetails}>
        <h3>{activityName}</h3>
        <div className="details">

        </div>
      </div>
    )
  }
}

export default ActivityItem;