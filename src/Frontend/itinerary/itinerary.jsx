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
      toggleEditModal,
      itinerary,
      itineraries
    } = this.props;

    const itinerariesList = itineraries.map((itinerary, i) => {
      return (
        <div className="itinerary-item-container" key={i}>
          <h3>{itinerary.name}</h3>
        </div>
      )
    });

    return (
      <div className="itinerary-container">
        <div className="itinerary-header">

          <span className="itinerary-name center-vertically">
            <h2 className="center-vertically">Itineraries</h2>
            <AddButton onButtonClick={toggleCreateModal}/>
          </span>

          {itineraries.length > 0 &&
            <>
              <hr/>

              <span className="itinerary-name center-vertically">
                <h2 className="center-vertically">{itinerary.name}</h2>
                <span className="itinerary-edit center-vertically">
                  <i onClick={toggleEditModal} className="fa fa-edit fa-lg"/>
                </span>
              </span>

              <span className="itinerary-caret center-vertically">
                <button className="itinerary-dropdown-button" onClick={this.toggleDropdown}>
                  <i className="fa fa-caret-down" aria-hidden="true"/>
                </button>

                {showDropdown &&
                  <div className="itinerary-dropdown">
                    {itinerariesList}
                  </div>
                }
              </span>
            </>
          }

        </div>

        {itineraries.length > 0 &&
          <Calendar
            existingEvents={existingEvents}
          />
        }

        {itineraries.length === 0 &&
          <div>
            Create an itinerary to get started!
          </div>
        }
      </div>
    )
  }
}

export default Itinerary
