import React from "react";
import moment from 'moment';
import styles from "./itinerary.css";
import Calendar from './calendar.jsx';
import AddButton from "../components/add-button.jsx";
import CreateItineraryModal from "./create-itinerary-modal.jsx";

class Itinerary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      showDropdown
    } = this.state;

    const {
      toggleCreateItineraryModal,
      toggleEditItineraryModal,
      toggleCreateEventModal,
      itinerary,
      itineraries,
      handleSelectItinerary,
      existingEvents,
      handleSelectEvent,
      defaultDate,
      starItinerary,
      unstarItinerary
    } = this.props;

    const itinerariesList = itineraries.map((itinerary, i) => {
      return (
        <div 
          className="itinerary-item-container" 
          key={i}
          onClick={handleSelectItinerary(itinerary)}
        >
          {itinerary.starred === 0 &&
            <i className="far fa-star fa-sm"></i>
          }
          {itinerary.starred === 1 &&
            <i className="fas fa-star fa-sm"></i>
          }
          {itinerary.name}
        </div>
      )
    });

    return (
      <div className="itinerary-container">
        <div className="itinerary-header">

          <span className="itinerary-name center-vertically">
            <h2 className="center-vertically">Itineraries</h2>
            <AddButton onButtonClick={toggleCreateItineraryModal}/>
          </span>

          {itineraries.length > 0 &&
            <>
              <hr/>

              <span className="itinerary-name center-vertically">
                <span className="itinerary-star center-vertically">
                  {itinerary.starred === 0 &&
                    <i 
                      className="far fa-star fa-lg" 
                      onClick={starItinerary} 
                      title="Star this itinerary"
                    ></i>
                  }
                  {itinerary.starred === 1 &&
                    <i 
                      className="fas fa-star fa-lg" 
                      onClick={unstarItinerary}
                      title="Unstar this itinerary"
                    ></i>
                  }
                </span>
                <h2 className="center-vertically">{itinerary.name}</h2>
                <span className="itinerary-edit center-vertically">
                  <i onClick={toggleEditItineraryModal} className="fa fa-edit fa-lg"/>
                </span>
              </span>

              <span className="itinerary-caret center-vertically">
                <button 
                  className="itinerary-dropdown-button" 
                  onClick={this.toggleDropdown}
                  title="Select an itinerary"
                >
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
          <>
            <div>
            To create an event on the itinerary, drag an Activity to the calendar, or click a slot in the calendar.
            </div>
            <Calendar
              existingEvents={existingEvents}
              toggleCreateEventModal={toggleCreateEventModal}
              handleSelectEvent={handleSelectEvent}
              defaultDate={defaultDate}
            />
          </>
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
