import React from "react";
import axios from "axios";
import styles from "./activities.css";
import ActivityItem from "./activity-item.jsx";
import AddButton from "../components/add-button.jsx";


class Activities extends React.Component {
  constructor() {
    super()
    // this.state = {
    //   activitiesList: []
    // }
  }

  componentDidMount() {
    this.getActivities();
  }

  getActivities = () => {
    // axios.get(`/api/trips/${this.props.tripId}/activities`).then(res => {
    //   this.setState({activitiesList: res.data})
    // })
  }

  render() {
    const {
      showEditModal,
      showCreateModal,
      toggleCreateEventModal,
      activitiesList,
      userId
    } = this.props
    return (
      <div className="activities-container">
        <div className="activity-header">
          <h2>Activities</h2>
          <AddButton
            className="add-btn"
            onButtonClick={showCreateModal}
          />
        </div>
          {activitiesList.map(function(act, index){
            return (<ActivityItem
              key={index}
              showEditModal={showEditModal}
              activity={act}
              toggleCreateEventModal={toggleCreateEventModal}
              userId={userId}
            />)
          })}
      </div>
    )
  }
}

export default Activities;
