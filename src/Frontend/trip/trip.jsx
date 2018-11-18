import React from "react";

class Trip extends React.Component {
  render() {
    var tripId = this.props.match.params.id;
    return (
      <div>
        <div>Activities go here</div>
        <div>Itineraries go here</div>
      </div>
    )
  }
}

export default Trip;