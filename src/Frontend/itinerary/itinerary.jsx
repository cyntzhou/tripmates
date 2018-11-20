import React from "react";
import moment from 'moment';
import styles from "./itinerary.css";
import Calendar from './calendar.jsx';
import AddButton from "../components/add-button.jsx";
import CreateItineraryModal from "./create-itinerary-modal.jsx";

const existingEvents = [
  {
    title: "Dim sum",
    start: new Date(2018, 10, 19, 10, 30),
    end: new Date(2018, 10, 19, 12, 30),
    allDay: false
  }
]

class Itinerary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      existingEvents: existingEvents,
      showDropdown: false
    }
  }

  toggleDropdown = () => {
    this.setState({
      showDropdown: !this.state.showDropdown
    });
  }

  render() {
    const {
      existingEvents,
      showDropdown
    } = this.state;

    const {
      toggleCreateModal,
      toggleEditModal
    } = this.props;

    const itineraries = [
      {
        name: "Itinerary 1"
      },
      {
        name: "Itinerary 2"
      }
    ];

    const itineraryComponents = itineraries.map(itinerary => {
      return (
        <div className="itinerary-item-container">
          <h3>{itinerary.name}</h3>
        </div>
      )
    });

    return (
      <div className="itinerary-container">
        <div className="itinerary-header">

          <span className="itinerary-name center-vertically">
            <h2>Itinerary</h2>
          </span>

          <span className="itinerary-edit center-vertically">
            <i onClick={toggleEditModal} className="fa fa-edit fa-lg"/>
          </span>

          <span className="itinerary-caret center-vertically">
            <button className="itinerary-dropdown-button" onClick={this.toggleDropdown}>
              <i className="fa fa-caret-down" aria-hidden="true"/>
            </button>

            {showDropdown &&
              <div className="itinerary-dropdown">
                {itineraryComponents}
                <AddButton onButtonClick={toggleCreateModal}/>
              </div>
            }
          </span>

        </div>

        <Calendar
          existingEvents={existingEvents}
        />
      </div>
    )
  }
}

export default Itinerary
