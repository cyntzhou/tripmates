import React from "react";
import axios from "axios";
import moment from 'moment';
import Button from "../components/button.jsx";
import OpenHoursCalendar from './hours-calender.jsx';
import styles from "./edit-activity.css";

class EditActivityModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newName: null,
      newCategory: null,
      suggestedHours: null,
      suggestedMins: null,
      newPlaceName: null,
      newAddress: null,
      openHours: [],
      currHours: Math.floor(this.props.activity.suggestedDuration/60),
      currMins: this.props.activity.suggestedDuration%60,
      errors: []
    }
  }

  updateOpenHours = (newHours) => {
    this.setState({
      openHours: newHours
    })
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSave = () => {
    const {
      newName,
      newCategory,
      suggestedHours,
      suggestedMins,
      newAddress,
      newPlaceName
    } = this.state
    let name, category, suggestedDuration, address

    const errors = [];

    if(newName) {
      name = newName;
    } else {
      name = this.props.activity.name;
    }

    if(newCategory) {
      category = newCategory;
    } else {
      category = this.props.activity.category;
    }

    if (suggestedHours || suggestedMins) {
      const hours = (suggestedHours * 60 || 0) ;
      suggestedDuration = parseInt(hours) + parseInt(suggestedMins || 0);
    } else {
      suggestedDuration = this.props.activity.suggestedDuration
    }

    const bodyContext = {
      name,
      tripId: this.props.tripId,
      suggestedDuration,
      placeId: null,
      category
    }

    if(newAddress || newPlaceName) {
      let placeBody = {}

      if (newAddress) {
        placeBody['address'] = newAddress;
      } else if (newPlaceName) {
        placeBody['name'] = newPlaceName;
      }

      if (this.props.activity.placeId) {
        axios.put(`/api/places/${this.props.activity.placeId}`, placeBody)
          .then(res => {
            bodyContext['placeId'] = res.data.insertId;
            axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
            .then(() => {
              this.props.hideEditModal(null);
            }).catch(err => console.log(err));
          })
      } else {
        axios.post('/api/places', placeBody).then(res => {
          bodyContext['placeId'] = res.data.insertId;
          axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
          .then(() => {
            this.props.hideEditModal(null);
          }).catch(err => {
            console.log(err);
            }
          );
        }).catch(err => {
          console.log(err);
        });
      }
    } else {
      bodyContext['placeId'] = this.props.activity.placeId;
      axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
      .then(() => {
        this.props.hideEditModal(null);
      }).catch(err => {
        console.log(err);
        if (err.response.status === 404) {
          this.props.hideEditModal(null);
          alert("This activity has been deleted since a user has deleted this activity.");
        }
        // console.log(err.response.status);
        // console.log(err.response.data.error);

        if (errors.length > 0) {
          this.setState({
            errors: errors
          });
        }
      });
    }
  }

  onDelete = () => {
    axios.delete(`/api/activities/${this.props.activity.id}`).then(() => {
      this.props.hideEditModal(null);
    }).catch(err => console.log(err))
  }

  render() {
    const {
      errors,
      openHours
    } = this.state;
    console.log(errors);
    this.props.activity.openHours.forEach((timeSeg) => {
      const formatStart = moment([
        2018, 10, 20,
        parseInt(timeSeg.startTime.substring(0,2)),
        parseInt(timeSeg.startTime.substring(3))
      ]);
      openHours.push({
        resourceId: timeSeg.day,
        start: formatStart._d,
        end: moment(formatStart).add(timeSeg.duration, 'm')._d
      })
    })

    return (
      <div className="modal-container">
        <h3>Edit Activity</h3>
        <form>
          <label>Activity Name:
            <input
              type="text" name="newName"
              onChange={this.onChange}
              placeholder={this.props.activity.name}
            />
          </label>
          <h4>Optional Details</h4>
          <label>Category:
            <input
              type="text"
              name="newCategory"
              onChange={this.onChange}
              placeholder={this.props.activity.category?
                this.props.activity.category : 'category'}
            />
          </label>
          <label>Suggested Duration:
            <input
              type="number" min="0"
              name="suggestedHours"
              placeholder={`${this.state.currHours? this.state.currHours : ''} hours`}
              onChange={this.onChange}
            />
            <input
              type="number" min="0"
              name="suggestedMins"
              placeholder={`${this.state.currMins? this.state.currMins : ''} mins`}
              onChange={this.onChange}
            />
          </label>
          <p>Place:</p>
          <label>Name:
            <input
              type="text"
              name="newPlaceName"
              placeholder={this.props.address? this.props.address : 'address'}
              onChange={this.onChange}/>
          </label>
          <label>Address:
            <input
              type="text"
              name="newAddress"
              placeholder={this.props.address? this.props.address : 'address'}
              onChange={this.onChange}/>
          </label>
          <p>Open Hours:</p>
          <div>
            <OpenHoursCalendar openHours={openHours} updateHours={this.updateOpenHours} />
          </div>
        </form>
        <div className="btns-container">
          <Button label="Cancel" onButtonClick={this.props.hideEditModal}/>
          <Button label="Save" onButtonClick={this.onSave}/>
          <Button label="Delete" onButtonClick={this.onDelete}/>
        </div>
        {errors.length > 0 &&
          <div className="login-error-message">
            <ul>
              {errors.map((error, i) => {
                  return <li key={i}>{error}</li>;
              })}
            </ul>
          </div>
        }
      </div>
    )
  }
}

export default EditActivityModal;
