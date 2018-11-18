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

  showModal = () => {
    this.setState({show: true});
  }

  hideModal = () => {
    this.setState({show: false});
  }

  render() {
    return (
      <div className="activities-container">
        <div className="activity-header">
          <h2>Activities</h2>
          <AddButton className="add-btn" onButtonClick={this.showModal}/>
        </div>
        <ActivityItem activityName="actName here"/>
        <ActivityItem activityName="actName2 here"/>
      </div>
    )
  }
}

export default Activities;