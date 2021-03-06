import React from "react";
import axios from "axios";
import moment from 'moment';
import Button from "../components/button.jsx";
import OpenHoursCalendar from './hours-calender.jsx';
import Modal from '../components/modal.jsx';
import styles from "./edit-activity.css";

class EditActivityModal extends React.Component {
constructor(props) {
    super(props)
    this.state = {
      newName: props.activity.name,
      newCategory: props.activity.category ? props.activity.category : null,
      suggestedHours: props.activity.suggestedDuration ? Math.floor(this.props.activity.suggestedDuration/60) : null,
      suggestedMins: props.activity.suggestedDuration ? props.activity.suggestedDuration%60 : null,
      newPlaceName: this.props.activity.placeName ? this.props.activity.placeName : null,
      newAddress: this.props.activity.address ? this.props.activity.address : null,
      openHours: props.activity.formatedHours,
      currHours: Math.floor(this.props.activity.suggestedDuration/60),
      currMins: props.activity.suggestedDuration%60,
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

  deleteHours = (placeId) => {
    const hoursBody = { placeId }
    axios.delete(`/api/places/${placeId}/hours`, hoursBody)
    .then()
    .catch(err => console.log(err));
  }

  createHours = (placeId) => {
    this.state.openHours.forEach((timeSeg) => {
      const hoursBody = {
        placeId,
        day: timeSeg.resourceId,
        startTime: moment(timeSeg.start).format('HH:mm'),
        endTime: moment(timeSeg.end).format('HH:mm')
      }
      axios.post(`/api/places/${placeId}/hours`, hoursBody)
        .then()
        .catch(err => {
        })
    })
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
    const { activity } = this.props
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

    if(newAddress || newPlaceName || openHours.length > 0) {
      let placeBody = {}

      if (newAddress) {
        placeBody['address'] = newAddress;
      } else {
        placeBody['address'] = activity.address;
      }
      if (newPlaceName) {
        placeBody['name'] = newPlaceName;
      } else {
        placeBody['name'] = activity.newPlaceName
      }
      if (activity.placeId) {
        bodyContext['placeId'] = activity.placeId;
        axios.put(`/api/places/${activity.placeId}`, placeBody)
          .then(() => {
            axios.put(`/api/activities/${activity.id}`, bodyContext)
            .then(() => {
              this.props.toggleModal(null);
              this.props.editActivitiesDone();
            }).catch(err => {
              if (err.response.status === 404) {
                this.props.toggleModal(null);
                this.props.editActivitiesDone();
                alert("Another user has deleted this activity.");
              }
            });
          })
        if (openHours.length > 0) {
          if (activity.openHours.length > 0) {
            this.deleteHours(activity.placeId);
          }
          this.createHours(activity.placeId);
        }
      } else {
        let newPlaceId;
        axios.post('/api/places', placeBody).then(res => {
          bodyContext['placeId'] = res.data.insertId;
          newPlaceId = res.data.insertId;
          axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
          .then(() => {
            this.props.toggleModal(null);
            this.props.editActivitiesDone();
          }).catch(err => {
            if (err.response.status === 404) {
              this.props.toggleModal(null);
              this.props.editActivitiesDone();
              alert("Another user has deleted this activity.");
            }
          });
        }).catch(err => {
          if (err.response.status === 404) {
            this.props.toggleModal(null);
            this.props.editActivitiesDone();
            alert("Another user has deleted this activity.");
          }
        });

        if (openHours.length > 0) {
          // this.deleteHours(newPlaceId);
          this.createHours(newPlaceId);
        }
      }
    } else {
      axios.put(`/api/activities/${this.props.activity.id}`, bodyContext)
      .then(() => {
        this.props.toggleModal(null);
        this.props.editActivitiesDone();
      }).catch(err => {
        if (err.response.status === 404) {
          this.props.toggleModal(null);
          this.props.editActivitiesDone();
          alert("Another user has deleted this activity.");
        }
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
      this.props.toggleModal(null);
      this.props.editActivitiesDone();
    }).catch(err => {
      this.props.toggleModal(null);
      this.props.editActivitiesDone();
      alert("Another user has already deleted this activity.");
    })
  }

  render() {
    const {
      errors,
      openHours,
      newName,
      newCategory,
      suggestedHours,
      suggestedMins,
      newPlaceName,
      newAddress
    } = this.state;

    const {
      showModal,
      toggleModal
    } = this.props;
    return (
      <Modal show={showModal} handleClose={toggleModal} className="modal-container">
        <h3 id="title">Edit Activity</h3>
        <form id="edit-form">
          <label className="required">Activity Name:
            <input
              type="text" name="newName"
              onChange={this.onChange}
              placeholder="name"
              value={newName}
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
              placeholder="category"
              value={newCategory ? newCategory : ''}
              maxLength="20"
            />
          </label>
          <label>Suggested Duration:
            <input
              type="number" min="0"
              name="suggestedHours"
              placeholder="hours"
              value={suggestedHours ? suggestedHours : ''}
              onChange={this.onChange}
            />
            <input
              type="number" min="0"
              name="suggestedMins"
              placeholder="mins"
              value={suggestedMins ? suggestedMins: ''}
              onChange={this.onChange}
            />
          </label>
          <p>Place:</p>
          <div>
            <label>Name:
              <input
                type="text"
                name="newPlaceName"
                placeholder="name"
                value={newPlaceName ? newPlaceName : ''}
                onChange={this.onChange}
                maxLength="40"
                />
            </label>
            <label>Address:
              <input
                type="text"
                name="newAddress"
                placeholder="address"
                value ={newAddress ? newAddress : ''}
                onChange={this.onChange}
                maxLength="100"
                />
            </label>
          </div>
          <p>Open Hours:</p>
          <div className="hours-cal">
            <OpenHoursCalendar openHours={openHours} updateHours={this.updateOpenHours} />
          </div>
        </form>
        <div className="edit-buttons">
          <Button colorClassName="btn-red-background" label="Delete" onButtonClick={this.onDelete}/>
          <div id="save-cancel">
            <Button colorClassName="btn-gray-background" label="Cancel" onButtonClick={toggleModal}/>
            <Button label="Save" onButtonClick={this.onSave}/>
          </div>
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
      </Modal>
    )
  }
}

export default EditActivityModal;
