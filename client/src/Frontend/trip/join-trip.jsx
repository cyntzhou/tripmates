import React from "react";
import axios from "axios";
import styles from "./create-trip.css";
import Button from "../components/button.jsx";

class JoinTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeValue: '',
      errors: []
    };
  }

  onChange = (event) => {
    this.setState({
      codeValue: event.target.value
    });
  }

  handleJoin = () => {
    const { hideModal } = this.props;
    const bodyContext = {
      joinCode: this.state.codeValue
    };
    axios.post('/api/trips/join', bodyContext).then(res => {
      this.props.hideModal();
    }).catch(err => {
      const errors = [err.response.data.error];
      this.setState({ errors: errors });
    });
  }

  render() {
    const {
      codeValue,
      errors
    } = this.state;
    return (
      <div className="join-container">
        <h3 id="title">Join Trip</h3>
        <p id="join-description">
          Ask the trip creator for the trip's 6-digit code and enter it here: 
        </p>
        <input id="code-input" type="text" value={codeValue} onChange={this.onChange} placeholder="XXXXXX"/>
        <div className="join-btns">
          <Button colorClassName="btn-gray-background" label="Cancel" onButtonClick={this.props.hideModal}/>
          <Button colorClassName="btn-yellow-background" label="Join" onButtonClick={this.handleJoin}/>
        </div>

        {errors.length > 0 &&
          <div className="settings-error-message">
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

export default JoinTrip;