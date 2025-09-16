import { useEffect, useState} from 'react'
import axios from 'axios';
import { defWeather, getWeather} from './omAPI';//setUnits, searchLocation
// import type {weather}  from './omAPI';
import './App.css';
// import { useGeolocated } from 'react-geolocated'

import logo from './assets/images/logo.svg';
import errorIcon from './assets/images/icon-error.svg';
import retryIcon from './assets/images/icon-retry.png';
// import loading from './assets/images/icon-loading.svg';
import units from './assets/images/icon-units.svg'

import dropdown from './assets/images/icon-dropdown.svg';
import searchIcon from './assets/images/icon-search.svg';

import drizzle from './assets/images/icon-drizzle.webp';
import fog from './assets/images/icon-fog.webp';
import overcast from './assets/images/icon-overcast.webp';
import partlyCloudy from './assets/images/icon-partly-cloudy.webp';
import rain from './assets/images/icon-rain.webp';
import snow from './assets/images/icon-snow.webp';
import storm from './assets/images/icon-storm.webp';
import sunny from './assets/images/icon-sunny.webp';


function App() {
  
    const [isError, setIsError] = useState(false);
    const [isLocPending,setIsLocPending] = useState(true);
    const [isLoading,setIsLoading] = useState(true);
    const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({ latitude: 52.52, longitude: 13.41 });
    const [cityString, setCityString] = useState("")
    const [weather, setWeather] = useState(defWeather);
    const [search, setSearch] = useState("");
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ['January',"February",'March','April','May','June','July','August','September','October','November','December'];
    const day = days[date.getDay()];
    const dateString = `${day}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    const hour = date.getHours();

    
    async function getAllWeather() { // function that gets the forecast
        const currWeather = await getWeather(coords.latitude, coords.longitude);
        setWeather(currWeather || defWeather);
        console.log(currWeather)
        console.log(coords.latitude, coords.longitude)
    }      

    async function getCity(){
        const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`)
        const location: any = res.data;
        if(res.status!=200){setIsError(true)}
        setCityString(`${location.city}, ${location.countryName}`)
    }

    useEffect(()=>{ //changing theme according to day or night at the initial load of the page
      var doc = document.documentElement;
      if(hour>6 && hour<14){
        doc.setAttribute("data-theme","light")
      }
      else{doc.setAttribute("data-theme","dark")}
    },[])

    // useEffect(()=>{
    //   setLoc({latitude: coords?.latitude || 52.52,longitude: coords?.longitude || 13.41})
    // },[coords])

    useEffect(()=>{
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          setIsLocPending(false)
        })
      }
      else{
        console.log("Geolocation is not supported by this browser.")
        setIsLocPending(false)
      }
    },[])

    useEffect(()=>{ //getting weather and city
      if(!isLocPending){
            getAllWeather();
            getCity()
          console.log(cityString)
      }
      setIsLoading(false)
    },[isLocPending,coords])

    // function changeUnits(parameter: string, unit: string){
    //   setUnits(parameter, unit);
    //   getAllWeather();
    // }
    
  // console.log(document.documentElement.getAttribute("data-theme"))
  if(isLoading){
    return(
      <div>

      </div>
    )
  }


  else{
  
    if(isError){
      return(
        <div className='min-h-[100vh] min-w-[100vw] text-white md:pt-10 md:p-5 pt-5 p-3'>

          <div className="flex mx-2 md:mx-[5vw] justify-between">

            <img src={logo} className='md:w-fit w-[40vw]'/> {/* logo*/}

            <button className='md:h-10 h-8 bg-gray-600/30 rounded-lg py-1 hover:cursor-pointer hover:bg-gray-600/50'> {/*Units button*/}
              <div className='flex gap-x-3 px-3'>
                <img src={units} />
                Units
                <img src={dropdown}/>
              </div>
            </button>
          </div>

          <div className='text-center justify-center mt-20'>
              <img src={errorIcon} className='block mx-auto w-16'/>
              <p className='my-5 font-bold text-3xl'>
                Something Went Wrong
              </p>
              <p className=' text-gray-400'>We couldn't connect to the server (API error)</p>
              <p className=' text-gray-400'>Please try again in a few moments</p>
              <button className='md:h-10 h-8 bg-gray-600/30 rounded-lg py-1 mt-8 hover:cursor-pointer
                  hover:bg-gray-600/50 text-gray-400 font-semibold hover:text-white'> {/*Units button*/}
              <div className='flex px-4 align-middle'>
                <img src={retryIcon} className='pe-3 h-5 pt-1'/>
                  Retry           
              </div>
            </button>
          </div>
        </div>
      )
    }
    return (
      <div className='min-h-[100vh] min-w-[100vw] text-white md:pt-10 md:p-5 pt-5 p-3'>

        <div className="flex mx-2 md:mx-[5vw] justify-between">

          <img src={logo} className='md:w-fit w-[40vw]'/> {/* logo*/}

          <button className='md:h-10 h-8 bg-gray-600/30 font-semibold rounded-lg py-1 hover:cursor-pointer hover:bg-gray-600/50'> {/*Units button*/}
            <div className='flex gap-x-3 px-3'>
              <img src={units} />
              Units
              <img src={dropdown}/>
            </div>
          </button>

        </div>


        <p className='text-6xl  font-bri mx-[6vw] md:mx-0 my-16 text-center leading-18'>How's the sky looking today?</p>
        {/* <h1>{coords!=undefined ? `latitude: ${coords?.latitude} longitude: ${coords?.longitude}`: "location is not available"}</h1> */}


        <div className='md:flex items-center justify-center md:mb-10'>
          <label className=''>
            <input type='search' value={search} onChange={e=>setSearch(e.target.value)} aria-label='search location'
              className='bg-gray-500/30 rounded-xl py-4 lg:w-[40vw] md:w-[60vw] w-full ps-16 pe-5 md:me-10 md:m-0 me-10 focus:outline-white focus:outline-1' placeholder='Search for a place...'/>
            <img src={searchIcon} className='relative bottom-9 left-6' alt='search icon'/> 
          </label>
          <button className='bg-indigo-600/90 rounded-xl font-semibold px-7 py-4 md:mb-5 mb-10 md:w-fit w-full hover:cursor-pointer hover:bg-indigo-700'>Search</button>
        </div>
        <div className='my-grid gap-10 mx-auto'>

          <div className='flex today-bg items-center px-5 justify-self-end justify-between'> {/* today bg div*/}

              <div>{/*city div*/}
                <p className='text-4xl font-dmsans mb-3'>{cityString}</p>
                <p className='text-gray-300/60 text-xl'>{dateString}</p>
              </div>

              <div className='flex align-middle items-center justify-end'>{/* temp weather div*/}
                <img className='h-36' src={WCodetoImg(weather.current.weather_code)} alt={WCodetoText(weather.current.weather_code)} title={WCodetoText(weather.current.weather_code)}/>
                <p className='text-8xl font-dmsans ms-7'>{weather.current.temperature_2m}&deg;</p>
              </div>

          </div>

          <div className='h-96 md:w-[90%] w-full bg-gray-700 rounded-xl'> {/* hourly weather div*/}

          </div>

        </div>
      </div>
    )


    function WCodetoImg(code:number){ // function to translate weather code

        if([0,1].includes(code))
          return sunny;
        else if(code==2)
          return partlyCloudy;
        else if(code==3)
          return overcast;
        else if([45,48].includes(code))
          return fog;
        else if([51,53,55,56,57].includes(code))
          return drizzle;
        else if([61,63,65,66,67, 80,81,82].includes(code))
          return rain;
        else if([71, 73, 75, 77, 85, 86].includes(code))
          return snow;
        else if([95,96,99].includes(code))
          return storm;
      }

      function WCodetoText(code:number){ // function to translate weather code

        if([0,1].includes(code))
          return "sunny";
        else if(code==2)
          return "partly cloudy";
        else if(code==3)
          return "overcast";
        else if([45,48].includes(code))
          return "fog";
        else if([51,53,55,56,57].includes(code))
          return "drizzle";
        else if([61,63,65,66,67, 80,81,82].includes(code))
          return "rain";
        else if([71, 73, 75, 77, 85, 86].includes(code))
          return "snow";
        else if([95,96,99].includes(code))
          return "storm";
      }
  }
}

export default App
