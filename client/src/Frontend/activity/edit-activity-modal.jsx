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
      openHours: props.activity.formatedHours,
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
      newPlaceName,
      openHours
    } = this.state
    let name, category, suggestedDuration, address

    const errors = [];

    if (newName) {
      name = newName;
    } else {
      name = this.props.activity.name;
    }

    if (newCategory) {
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

    if(newAddress || newPlaceName || openHours) {
      let placeBody = {}

      if (newAddress) {
        placeBody['address'] = newAddress;
      }
      if (newPlaceName) {
        placeBody['name'] = newPlaceName;
      }

      if (this.props.activity.placeId) {
        axios.put(`/api/places/${this.props.activity.placeId}`, placeBody)
          .then(res => {
            bodyContext['placeId'] = res.data.insertId;
            axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
            .then(() => {
              this.props.hideEditModal(null);
            }).catch(err => {
              console.log(err);
              if (err.response.status === 404) {
                this.props.hideEditModal(null);
                alert("Another user has deleted this activity.");
              }
            });
          })
      } else {
        axios.post('/api/places', placeBody).then(res => {
          bodyContext['placeId'] = res.data.insertId;
          axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
          .then(() => {
            this.props.hideEditModal(null);
          }).catch(err => {
            console.log(err);
            if (err.response.status === 404) {
              this.props.hideEditModal(null);
              alert("Another user has deleted this activity.");
            }
          });
        }).catch(err => {
          console.log(err);
          if (err.response.status === 404) {
            this.props.hideEditModal(null);
            alert("Another user has deleted this activity.");
          }
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
          alert("Another user has deleted this activity.");
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
    }).catch(err => {
      console.log(err);
      this.props.hideEditModal(null);
      alert("Another user has already deleted this activity.");
    })
  }

  render() {
    const {
      errors,
      openHours
    } = this.state;
    return (
      <div className="modal-container">
        <h3>Edit Activity</h3>
        <form>
          <label className="required">Activity Name:
            <input
              type="text" name="newName"
              onChange={this.onChange}
              placeholder={this.props.activity.name}
              maxLength="40"
              required
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
              maxLength="20"
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
              onChange={this.onChange}
              maxLength="40"
              />
          </label>
          <label>Address:
            <input
              type="text"
              name="newAddress"
              placeholder={this.props.address? this.props.address : 'address'}
              onChange={this.onChange}
              maxLength="100"
              />
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
          <div className="error-message">
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
