import React from "react";
import styles from "./activities.css";
import ActivityItem from "./activity-item.jsx";
import AddButton from "../components/add-button.jsx";


class Activities extends React.Component {
  constructor() {
    super();
    this.state = {
      show: false
    }
  }

  render() {
    return (
      <div className="activities-container">
        <div className="activity-header">
          <h2>Activities</h2>
          <AddButton className="add-btn" onButtonClick={this.props.showModal}/>
        </div>
        <ActivityItem activityName="actName here"/>
        <ActivityItem activityName="actName2 here"/>
      </div>
    )
  }
}

export default Activities;