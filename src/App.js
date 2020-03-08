import React from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './components/Map'
import {API_KEY} from './components/API_KEYS'


function App() {
  return (
    <div style={{marginTop : '50px'}}>
      <Map
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}

export default App;
