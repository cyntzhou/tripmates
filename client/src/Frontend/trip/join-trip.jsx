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
      <div className="form-container">
        <h3>Join Trip</h3>
        <input type="text" value={codeValue} onChange={this.onChange}/>
        <Button label="Cancel" onButtonClick={this.props.hideModal}/>
        <Button label="Join" onButtonClick={this.handleJoin}/>

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