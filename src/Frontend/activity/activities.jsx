import React from "react";
import axios from "axios";
import styles from "./activities.css";
import ActivityItem from "./activity-item.jsx";
import AddButton from "../components/add-button.jsx";


class Activities extends React.Component {
  constructor() {
    super()
    this.state = {
      activitiesList: []
    }
  }

  componentDidMount() {
    this.getActivities();
  }

  getActivities = () => {
    axios.get(`/api/activities/trip/${this.props.tripId}`).then(res => {
      this.setState({activitiesList: res.data})
    })
  }

  render() {
    return (
      <div className="activities-container">
        <div className="activity-header">
          <h2>Activities</h2>
          <AddButton 
            className="add-btn" 
            onButtonClick={this.props.showCreateModal}
          />
        </div>
          {this.state.activitiesList.map(function(act, index){
            return <ActivityItem 
              key={index}
              showEditModal={this.props.showEditModal} 
              activityName={act.name}/>
          })}
      </div>
    )
  }
}

export default Activities;