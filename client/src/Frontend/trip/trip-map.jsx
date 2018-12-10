import React from 'react';
import axios from 'axios';
import styles from "./trip-map.css";
import Modal from "../components/modal.jsx";
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

class TripMap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tripId: props.tripId,
      center: [42.3601, -71.0589],
      zoom: 13,
      activities: [],
      positions: [],
    }
  }

  componentDidMount() {
    this.getActivities();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activities !== this.state.activities) {
      this.getActivities();
    }
  }

  getActivities = () => {
    axios.get(`/api/trips/${this.props.tripId}/activities`).then(res => {
      this.setState({activities: res.data})
      this.getPositions();
    })
  }

  getPositions = () => {
    const provider = new OpenStreetMapProvider();
    const actWithPos = []
    this.state.activities.forEach(act => {
      provider.search({ query: act.address }).then(res => {
          const pos = [parseFloat(res[0].y), parseFloat(res[0].x)]
          actWithPos.push({
            activityName: act.name, 
            placeName: act.placeName,
            address: act.address,
            pos
          })
          this.setState({
            positions: actWithPos
          })
      }).catch(err => console.log(err));
    })
  }

  render() {
    const {
      positions,
    } = this.state
    const {
      toggleMap
    } = this.props
    return (
      <div id="trip-map">
        <Map center={this.state.center} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {
            positions.map((act, index) => {
              return (
                <Marker position={act.pos} key={index}>
                  <Popup>
                    {act.activityName} <br /> {act.placeName} <br/> {act.address}
                  </Popup>
                </Marker>
              )
            })
          }
        </Map>
        <i 
          id="hide-map-btn" 
          className="fa fa-map" 
          aria-hidden="true"
          onClick={toggleMap}
        > Hide Map </i>
      </div>
    );
  }
}

export default TripMap;