import React from "react";
import styles from "./activity-item.css";

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
      showEditModal
    } = this.props;
    const {
      name,
      category,
      suggestedDuration,
      address,
      placeName
    } = this.props.activity

    const suggestedHours = Math.floor(suggestedDuration/60) || 0;
    const suggestedMin = suggestedDuration%60;

    return (
      <div className="activity-item-container" onClick={this.toggleDetails}>
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

export default ActivityItem;