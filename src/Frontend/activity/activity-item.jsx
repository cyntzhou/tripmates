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
    console.log('expand')
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
        {this.state.expand && 
          <div className="details">
            <p>Category</p>
            <i onClick={this.showEdit} className="fa fa-edit"/>
          </div>
        }
      </div>
    )
  }
}

export default ActivityItem;