import React, { useState } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';

import {API_KEY} from './API_KEYS';

Geocode.setApiKey( API_KEY);
Geocode.enableDebug();

const initialState = {
    address: '',
    city: '',
    area: '',
    state: '',
    mapPosition: {
        lat: 14.803690,
        lng: 121.034203 
    },
    markerPosition: {
        lat: 14.803690, 
        lng: 121.034203 
    }
}

const Map = () =>{
    const [state, setState] = React.useState(()=> initialState);
    
    const getCity = ( addressArray ) => {
		let city = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0] && 'administrative_area_level_2' === addressArray[ i ].types[0] ) {
				city = addressArray[ i ].long_name;
				return city;
			}
		}
	};

	const getArea = ( addressArray ) => {
		let area = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			if ( addressArray[ i ].types[0]  ) {
				for ( let j = 0; j < addressArray[ i ].types.length; j++ ) {
					if ( 'sublocality_level_1' === addressArray[ i ].types[j] || 'locality' === addressArray[ i ].types[j] ) {
						area = addressArray[ i ].long_name;
						return area;
					}
				}
			}
		}
	};

	const getState = ( addressArray ) => {
		let state = '';
		for( let i = 0; i < addressArray.length; i++ ) {
			for( let i = 0; i < addressArray.length; i++ ) {
				if ( addressArray[ i ].types[0] && 'administrative_area_level_1' === addressArray[ i ].types[0] ) {
					state = addressArray[ i ].long_name;
					return state;
				}
			}
		}
	};
     const onPlaceSelected = ( place ) => {
       if(place && place !== "" ){
            const latValue = place.geometry.location.lat()
            const lngValue = place.geometry.location.lng()
            const coordinates = {
                lat: latValue, 
                lng: lngValue
            }
            setState((prevState)=>{
                return {
                    ...prevState,
                    mapPosition : coordinates,
                    markerPosition : coordinates
                }
            });
       }
    }

    
    const onMarkerDragEnd = event => {
        let newLat = event.latLng.lat(), newLng = event.latLng.lng();
        const coordinates = {
            lat: newLat, 
            lng: newLng
        }
        Geocode.fromLatLng( newLat , newLng ).then(
			response => {
				const address = response.results[0].formatted_address
                const addressArray =  response.results[0].address_components
                const city = getCity( addressArray )
				const area = getArea( addressArray )
                const state = getState( addressArray )
                setState((prevState)=>{
                    return{
                        ...prevState,
                        address: ( address ) ? address : '',
                        area: ( area ) ? area : '',
                        city: ( city ) ? city : '',
                        state: ( state ) ? state : '',
                        markerPosition : coordinates,
                        mapPosition: coordinates
                    }
                });
			},
			error => {
				console.error(error);
			}
		);
    }

    return (
        <div>
            <GoogleMap 
                defaultZoom={16}
                defaultCenter={{ lat: state.mapPosition.lat,  lng: state.mapPosition.lng}}
                center = {{ lat: state.mapPosition.lat,  lng: state.mapPosition.lng}}
            >
                <Marker
                    position={{ lat: state.markerPosition.lat, lng: state.markerPosition.lng}} 
                    draggable = {true}
                    onDragEnd={onMarkerDragEnd}
    
                />  
            </GoogleMap>
            <h1>Marker coordinates</h1>
            <div>Lat : {state.markerPosition.lat}</div>
            <div>Long : {state.markerPosition.lng}</div>
            <div>Address : {state.address}</div>
            <h1>Map coordinates</h1>
            <div>Lat : {state.mapPosition.lat}</div>
            <div>Long : {state.mapPosition.lng}</div>
            <Autocomplete
                style={{
                    width: '80%',
                    height: '20px',
                    paddingLeft: '50px',
                    marginTop: '10px',
                    marginBottom: '500px'
                }}
                onPlaceSelected={ onPlaceSelected }
                types={['(regions)']}
			/>
        </div>
    )
}

export default withScriptjs(withGoogleMap(Map))
