import React from "react"
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import * as KEYS from '../keys'

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
    console.log(props)
    return props.lat === 0 ? (<h4>No loaction information provided</h4>) : (
        <GoogleMap
            bootstrapURLKeys={{ key:KEYS.MAP_GOOGLE_KEY }}
            defaultZoom={8}
            defaultCenter={{ lat:props.lat , lng: props.lng }}
        >
            {props.isMarkerShown && <Marker position={{  lat:props.lat , lng: props.lng }} onClick={props.onMarkerClick} />}
        </GoogleMap>
    )
})


class Map extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isMarkerShown: false,
          }
    }
    componentDidMount() {
      this.delayedShowMarker()
    }
  
    delayedShowMarker = () => {
      setTimeout(() => {
        this.setState({ isMarkerShown: true })
      }, 3000)
    }
  
    handleMarkerClick = () => {
      this.setState({ isMarkerShown: false })
      this.delayedShowMarker()
    }
  
    render() {
        return (
        <MyMapComponent
          lat = {this.props.lat} 
          lng = {this.props.lng}
          isMarkerShown={this.state.isMarkerShown}
        //   isMarkerShown={false}
          onMarkerClick={this.handleMarkerClick}
        />
      )
    }
  }

  export default Map