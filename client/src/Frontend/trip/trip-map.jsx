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
    const actWithPos = [];
    this.state.activities.forEach(act => {
      if (act.address) {
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
      }
    })
  }

  render() {
    const {
      positions
    } = this.state
    const {
      toggleMap
    } = this.props
    const latLons = positions.map((place) => place.pos);
    const defaultCenter = [42.3601, -71.0589];
    const center = positions.length > 0 ? 
      latLons
        .reduce((sum, pos) => {
          return [sum[0] + pos[0], sum[1] + pos[1]];
        })
        .map((num) => num / positions.length) :
      defaultCenter;
    const defaultZoom = 11;
    const lats = latLons.map((pos) => pos[0]);
    const lons = latLons.map((pos) => pos[1]);
    // const zoom = positions.length > 0 ? 
    //   Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lons) - Math.min(...lons)) * 70 :
    //   defaultZoom;
    // console.log(zoom);
    const zoom = defaultZoom;
    return (
      <div id="trip-map">
        <Map center={center} zoom={zoom}>
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