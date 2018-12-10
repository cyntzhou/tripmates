import React from "react";
import { DragSource } from 'react-dnd';
import { ITEM } from '../itemTypes';
import moment from 'moment';
import styles from "./activity-item.css";
import axios from "axios";

const source = {
	beginDrag(props) {
    return {};
	},
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return;
    }
    const { toggleCreateEventModal, activity } = props;
    toggleCreateEventModal("","", activity.id);
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

class ActivityItem extends React.Component {
  constructor() {
    super()
    this.state = {
      expand: false,
			isUpvoter: false,
			isDownvoter: false
    }
  }

	componentDidMount() {
		this.isUpvoter();
		this.isDownvoter();
	}

  toggleDetails = () => {
    this.setState({
      expand: !this.state.expand
    })
  }

  getOpenHours = () => {
    const hours = [];
    this.props.activity.openHours.forEach((timeSeg) => {
      const formatStart = moment([
        2018, 10, 20,
        parseInt(timeSeg.startTime.substring(0,2)),
        parseInt(timeSeg.startTime.substring(3))
      ]);
      const formatEnd = moment([
        2018, 10, 20,
        parseInt(timeSeg.endTime.substring(0,2)),
        parseInt(timeSeg.endTime.substring(3))
      ]);
      hours.push({
        resourceId: timeSeg.day,
        start: formatStart._d,
        end: formatEnd._d
      })
    })
    return hours
  }

	upvote = () => {
		const { activity, userId } = this.props;
		const bodyContent = {
				userId: userId
		};
		return axios.put(`/api/activities/${activity.id}/upvote`, bodyContent).then(res => {
      // this.setState({ activities: res.data });
			this.isUpvoter();
			this.isDownvoter();
		});
	}

	downvote = () => {
		const { activity, userId } = this.props;
		const bodyContent = {
				userId: userId
		};
		return axios.put(`/api/activities/${activity.id}/downvote`, bodyContent).then(res => {
      // this.setState({ activities: res.data });
			this.isUpvoter();
			this.isDownvoter();
		});
	}

	resetVotes = () => {
		const { activity, userId } = this.props;
		const bodyContent = {
				userId: userId
		};
		return axios.put(`/api/activities/${activity.id}/votes`, bodyContent).then(res => {
      // this.setState({ activities: res.data });
			this.isUpvoter();
			this.isDownvoter();
		});
	}

	isUpvoter = () => {
		const { activity } = this.props;
		axios.get(`/api/activities/${activity.id}/upvote`).then(res => {
      this.setState({ isUpvoter: res.data });
			// this.isUpvoter();
			// this.isDownvoter();
		});
	}

	isDownvoter = () => {
		const { activity } = this.props;
		axios.get(`/api/activities/${activity.id}/downvote`).then(res => {
      this.setState({ isDownvoter: res.data });
			// this.isUpvoter();
			// this.isDownvoter();
		});
	}


  render() {
		const {
			isUpvoter,
			isDownvoter
		} = this.state;
    const {
      activity,
      showEditModal,
      connectDragSource,
      isDragging
    } = this.props;
    const {
      name,
      category,
      suggestedDuration,
      address,
      placeName,
			votes,
			upvoters,
			downvoters
    } = activity;
		console.log(activity);

    const suggestedHours = Math.floor(suggestedDuration/60) || 0;
    const suggestedMin = suggestedDuration%60;
    activity['formatedHours'] = this.getOpenHours();

    return connectDragSource(
      <div
        className="activity-item-container"
        onClick={this.toggleDetails}
        style={{
          opacity: isDragging ? 0.25 : 1,
        }}
      >
        <h3>{name}</h3>
				{votes > 0 &&
					<p className="positive-vote">+{votes}</p>
				}
				{votes < 0 &&
					<p className="negative-vote">{votes}</p>
				}
				{votes == 0 &&
					<p>{votes}</p>
				}

        {this.state.expand &&
          <div className="details">
            {category && <p>Category: {category}</p>}
            {suggestedDuration !== 0 && <p>Suggested Duration: {suggestedHours} Hrs {suggestedMin} Min</p>}
            {placeName && <p>Place: {placeName}</p>}
            {address && <p>Address: {address}</p>}
						{isDownvoter &&
							<i
								className="fas fa-thumbs-down"
								onClick={this.resetVotes}
								title={downvoters}
							></i>
						}
						{!isDownvoter &&
							<i
								className="far fa-thumbs-down"
								onClick={this.downvote}
								title={downvoters}
							></i>
						}

						{isUpvoter &&
							<i
								className="fas fa-thumbs-up"
								onClick={this.resetVotes}
								title={upvoters}
							></i>
						}
						{!isUpvoter &&
							<i
								className="far fa-thumbs-up"
								onClick={this.upvote}
								title={upvoters}
							></i>
						}
            <i onClick={() => showEditModal(this.props.activity)} className="fa fa-edit"/>
          </div>
        }
      </div>
    )
  }
}

export default DragSource(ITEM, source, collect)(ActivityItem);
