// import { useState, useEffect } from 'react'
import './App.css';
import { useGeolocated } from 'react-geolocated'
import logo from './assets/images/logo.svg';
import units from './assets/images/icon-units.svg'
import dropdown from './assets/images/icon-dropdown.svg';

function App() {
  
    const { coords, isGeolocationAvailable, isGeolocationEnabled } = getLocation();

    function getLocation() {
      const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });
        return {coords, isGeolocationAvailable, isGeolocationEnabled};
    }
    
  console.log(isGeolocationEnabled ? "location enabled" : "location disabled")
  return (
    <div className='body-bg min-h-[100vh] min-w-[100vw] text-white pt-10 p-5'>
      <div className="flex mx-[1vw] md:mx-[5vw] justify-between">
        <img src={logo} />

        <button className='h-10 bg-gray-600/30 rounded-lg py-1'>
          <div className='flex gap-x-3 px-3'>
            <img src={units} className=''/>
            Units
            <img src={dropdown}/>
          </div>
        </button>
      </div>
      <p className='text-6xl  font-bri mx-[6vw] md:mx-0 my-16 text-center leading-18'>How's the sky looking today?</p>
      {/* <h1>{coords!=undefined ? `latitude: ${coords?.latitude} longitude: ${coords?.longitude}`: "location is not available"}</h1> */}
    </div>
  )
}

export default App
