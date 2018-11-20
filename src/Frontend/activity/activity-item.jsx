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
      address
    } = this.props.activity
    return (
      <div className="activity-item-container" onClick={this.toggleDetails}>
        <h3>{name}</h3>
        {this.state.expand && 
          <div className="details">
            {(category != "null") && <p>Category: {category}</p>}
            {suggestedDuration && <p>Suggested Duration: {suggestedDuration} min</p>}
            {/* {address && <p>Address: {address}</p>} */}
            <i onClick={() => showEditModal(this.props.activity)} className="fa fa-edit"/>
          </div>
        }
      </div>
    )
  }
}

export default ActivityItem;