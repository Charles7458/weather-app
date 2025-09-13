import { useEffect, useState } from 'react'
import './App.css';
import { useGeolocated } from 'react-geolocated'
import logo from './assets/images/logo.svg';
import units from './assets/images/icon-units.svg'
import dropdown from './assets/images/icon-dropdown.svg';
import searchIcon from './assets/images/icon-search.svg';

function App() {
  
    const { coords, isGeolocationAvailable, isGeolocationEnabled } = getLocation();
    const [search, setSearch] = useState("");
    const time = new Date().getHours()
    useEffect(()=>{
      var doc = document.documentElement;
      if(time>15){
        doc.setAttribute("data-theme","dark")
      }
    else{doc.setAttribute("data-theme","light")}
    },[])
    
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
  console.log(document.documentElement.getAttribute("data-theme"))
  getLocation()
  
  return (
    <div className='min-h-[100vh] min-w-[100vw] text-white md:pt-10 md:p-5 pt-5 p-3'>
      <div className="flex mx-2 md:mx-[5vw] justify-between">
        <img src={logo} className='md:w-fit w-[40vw]'/>

        <button className='md:h-10 h-8 bg-gray-600/30 rounded-lg py-1'>
          <div className='flex gap-x-3 px-3'>
            <img src={units} />
            Units
            <img src={dropdown}/>
          </div>
        </button>
      </div>
      <p className='text-6xl  font-bri mx-[6vw] md:mx-0 my-16 text-center leading-18'>How's the sky looking today?</p>
      {/* <h1>{coords!=undefined ? `latitude: ${coords?.latitude} longitude: ${coords?.longitude}`: "location is not available"}</h1> */}
      <div className='md:flex items-center justify-center'>
        <label className=''>
          <input value={search} onChange={e=>setSearch(e.target.value)} 
            className='bg-gray-500/30 rounded-xl py-4 lg:w-[40vw] md:w-[60vw] w-full ps-16 pe-5 md:me-10 md:m-0 me-10' placeholder='Search for a place...'/>
          <img src={searchIcon} className='relative bottom-8.5 left-6'/> 
        </label>
        <button className='bg-indigo-600 rounded-xl px-7 py-4 md:mb-5 mb-10 md:w-fit w-full'>Search</button>
      </div>
    </div>
  )
}

export default App
