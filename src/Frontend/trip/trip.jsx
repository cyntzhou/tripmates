import React from "react";
import styles from "./trip.css";
import Activities from "../activity/activities.jsx";
import CreateActivityModal from "../activity/create-activity-modal.jsx";

class Trip extends React.Component {
  constructor() {
    super();
    this.state = {
      showCreateActivity: false
    }
  }

  showModal = () => {
    this.setState({showCreateActivity: true});
  }

  hideModal = () => {
    this.setState({showCreateActivity: false});
  }

  render() {
    var tripId = this.props.match.params.id;
    return (
      <div>
        {this.state.showCreateActivity? (<CreateActivityModal hideModal={this.hideModal}/>) : (
          <React.Fragment>
            <Activities showModal={this.showModal}/>
            <div>Itineraries go here</div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

export default Trip;