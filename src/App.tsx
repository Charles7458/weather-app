import { useEffect, useState} from 'react'
import axios from 'axios';
import { checkIsImperial, checkIsMetric, defWeather, getWeather, setToImperial, setToMetric, setUnits} from './omAPI';//setUnits, searchLocation
// import type {weather}  from './omAPI';
import './App.css';
import { DaysDropdown, UnitsDropdown } from './dropdown';

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


function HourlyDiv(hr:{img:string, hour:string, temperature:number}){
  let hour = new Date(hr.hour).getHours();
  const AMPM = hour>12 ? "PM" : "AM";
  let Hour12 = hour%12;
  if(Hour12==0){
    Hour12 = 12;
  }

  return(
    <div className='flex h-16 w-full bg-gray-500/15 rounded-xl px-5 mb-5 justify-between items-center'>
      <span className='flex items-center'>
        <img src={hr.img} className='h-16 py-1' />
        <p className='ms-3 text-xl'>{Hour12} {AMPM}</p>
      </span>
      <p className='text-lg'>{hr.temperature}&deg;</p>
     </div>
  )
}

type hourlyData = {
  time: string,
  temp:number,
  w_code:number
}

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

    const [isImperial, setIsImperial] = useState(false);
    const [isMetric, setIsMetric] = useState(false);

    const [forecastDay, setForecastDay] = useState(date.getDay() || "-")

    const [hourly, setHourly] = useState<Array<hourlyData>>([{time:"",temp:0,w_code:0}])

    const [showUnitsDropdown, setShowUnitsDropdown] = useState(false);
    const [showDaysDropdown, setShowDaysDropdown] = useState(false);

    
    
    async function getAllWeather() { // function that gets the forecast
        const currWeather = await getWeather(coords.latitude, coords.longitude);
        if(currWeather===null){
          setIsError(true);
          return;
        }
        setWeather(currWeather || defWeather);
        // getHourly(0)
        console.log(currWeather)
        console.log(coords.latitude, coords.longitude)
    }      

    async function getCity(){
        const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`)
        const location: any = res.data;
        if(res.status!=200){setIsError(true)}
        setCityString(`${location.city}, ${location.countryName}`)
    }

    function getHourly(theDay:number) {
      let newHourlyData : Array<hourlyData>= []
      if(theDay===0){
        for(let i=hour-1;i<hour+7;i++){
          const time = weather.hourly.time[i];
          const w_code = weather.hourly.weather_code[i];
          const temp = weather.hourly.temperature_2m[i];
          newHourlyData.push({time: time, w_code: w_code, temp: temp})
        }
      }
      else {
        const start = 24*theDay;
        const end = start + 24;
        for(let i = start;i<end+24;i++) {
          const time = weather.hourly.time[i];
          const w_code = weather.hourly.weather_code[i];
          const temp = weather.hourly.temperature_2m[i];
          newHourlyData.push({time: time, w_code: w_code, temp: temp})
        }
      }
      console.log(newHourlyData)
      setHourly(newHourlyData);

    }

    function handleSetImperial(){
      setIsImperial(true);
      setIsMetric(false)
      setToImperial();
    }

    function handleSetMetric(){
      setIsImperial(false);
      setIsMetric(true);
      setToMetric();
    }

    function handleUnitChange(parameter:string, unit:string){
      setIsImperial(checkIsImperial());
      setIsMetric(checkIsMetric());
      setUnits(parameter,unit);
      
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
            getCity();
            console.log(weather)
      }
      setIsLoading(false)
    },[isLocPending,coords])

    useEffect(()=>{
      if(!isLoading){
        getHourly(0);
      }
    },[hour,weather])

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


    else{
      return (
        <div className='min-h-[100vh] min-w-[100vw] text-white md:pt-10 md:p-5 pt-5 p-3'>

          <div className="flex mx-2 md:mx-[5vw] justify-between">

            <img src={logo} className='md:w-fit w-[40vw]'/> {/* logo*/}

            <div className='relative'>
              <button className='md:h-10 h-8 bg-slate-800 font-semibold rounded-lg py-1 hover:cursor-pointer hover:bg-gray-600/50'
                onClick={()=>setShowUnitsDropdown(!showUnitsDropdown)}> {/*Units button*/}
                <div className='flex gap-x-3 px-3'>
                  <img src={units} />
                  Units
                  <img src={dropdown} className={showUnitsDropdown? "rotate-180":""}/>
                </div>
              </button>

              <UnitsDropdown show={showUnitsDropdown} isImperial={isImperial} isMetric={isMetric} setToImperial={handleSetImperial} setToMetric={handleSetMetric} changeUnits={handleUnitChange}/>
            </div>
            

          </div>


          <p className='text-6xl  font-bri mx-[6vw] md:mx-0 my-16 text-center leading-18'>How's the sky looking today?</p>
          {/* <h1>{coords!=undefined ? `latitude: ${coords?.latitude} longitude: ${coords?.longitude}`: "location is not available"}</h1> */}


          <div className='md:flex items-center justify-center md:mb-10'>
            <label className=''>
              <input type='search' value={search} onChange={e=>setSearch(e.target.value)} aria-label='search location'
                className='bg-gray-500/30 rounded-xl py-4 lg:w-[40vw] md:w-[60vw] w-full ps-16 pe-5 md:me-5 md:m-0 me-10 focus:outline-white focus:outline-1' placeholder='Search for a place...'/>
              <img src={searchIcon} className='relative bottom-9 left-6' alt='search icon'/> 
            </label>
            <button className='bg-indigo-600/90 rounded-xl font-semibold px-7 py-4 md:mb-5 mb-10 md:w-fit w-full hover:cursor-pointer hover:bg-indigo-700'>Search</button>
          </div>
          <div className='my-grid gap-10 mx-auto lg:gap-3 xl:gap-10'>

            <div className='md:grid md:grid-cols-2 md:align-middle today-bg md:items-center md:ps-10 lg:ps-5 xl:ps-10 xl:py-10 justify-self-end justify-between'> {/* today bg div*/}

                <div className='md:block hidden'>{/*city div (big screens)*/}
                  <p className='xl:text-4xl lg:text-3\2xl md:text-4xl font-dmsans mb-3'>{cityString}</p>
                  <p className='text-gray-300/60 text-lg'>{dateString}</p>
                </div>

                <div className='md:flex hidden align-middle items-center justify-self-start pe-10'>{/* temp weather div (big screens) */}
                  <img className='h-36' src={WCodetoImg(weather.current.weather_code)} alt={WCodetoText(weather.current.weather_code)} title={WCodetoText(weather.current.weather_code)}/>
                  <p className='xl:text-8xl lg:text-7xl md:text-8xl font-dmsans italic ms-7'>{weather.current.temperature_2m.toPrecision(2)}&deg;</p>
                </div>

                <div className='md:hidden text-center mt-10 mb-6'>{/*city div (small screens)*/}
                  <p className='text-4xl font-dmsans mb-3'>{cityString}</p>
                  <p className='text-gray-300/60 text-lg'>{dateString}</p>
                </div>

                <div className='md:hidden flex align-middle justify-center items-center'>{/* temp weather div (small screens) */}
                  <img className='h-36' src={WCodetoImg(weather.current.weather_code)} alt={WCodetoText(weather.current.weather_code)} title={WCodetoText(weather.current.weather_code)}/>
                  <p className='text-8xl font-dmsans italic ms-5'>{weather.current.temperature_2m.toPrecision(2)}&deg;</p>
                </div>

                <div className='grid grid-cols-4'> {/*feels like, precipitation,etc. divs*/}

                </div>

            </div>

            <div className='h-fit xl:w-[80%] w-full bg-gray-500/30 py-5 px-3 rounded-xl'> {/* hourly weather div*/}
              <span className='flex justify-between items-center mb-5'>

                <p className='text-xl font-semibold ms-5'>Hourly forecast</p>

                <div className='relative'>{/*day dropdown button*/}

                  <button className='md:h-10 h-8 bg-gray-500/15 rounded-lg py-1 me-5 hover:cursor-pointer hover:bg-gray-500/25'
                    onClick={()=>setShowDaysDropdown(!showDaysDropdown)}> 
                    
                    <div className='flex gap-x-3 ps-4 pe-3'>
                      {typeof(forecastDay)=="number" ? days[forecastDay] : forecastDay}
                      <img src={dropdown}/>
                    </div>

                  </button>

                  <DaysDropdown show={showDaysDropdown}/>
                </div>
                
              </span>
              {
                hourly.map((ihour)=>{
                  return <HourlyDiv img={WCodetoImg(ihour.w_code)} hour={ihour.time} temperature={ihour.temp}/>
                })
              }
            </div>

          </div>
        </div>
      )
    }

    function WCodetoImg(code:number){ // function to translate weather code

      const CodeMap: { [key: number]: string } = {
          0 : sunny,
          1 : sunny,
          2 : partlyCloudy,
          3 : overcast,
          45 : fog,
          48 : fog,
          51 : drizzle,
          53 : drizzle,
          55 : drizzle,
          56 : drizzle,
          57 : drizzle,
          61 : rain,   
          63 : rain,     
          65 : rain,  
          66 : rain,
          67 : rain,
          71 : snow,   
          73 : snow,     
          75 : snow,  
          77 : snow,   
          80 : rain,         
          81 : rain,
          82 : rain,          
          85 : snow,
          86 : snow,          
          95 :storm,
          96 :storm,          
          99 :storm,       
        }

        return CodeMap[code]
        // if([0,1].includes(code))
        //   return sunny;
        // else if(code==2)
        //   return partlyCloudy;
        // else if(code==3)
        //   return overcast;
        // else if([45,48].includes(code))
        //   return fog;
        // else if([51,53,55,56,57].includes(code))
        //   return drizzle;
        // else if([61,63,65,66,67, 80,81,82].includes(code))
        //   return rain;
        // else if([71, 73, 75, 77, 85, 86].includes(code))
        //   return snow;
        // else if([95,96,99].includes(code))
        //   return storm;
      }

      function WCodetoText(code:number){ // function to translate weather code

        const CodeMap: { [key: number]: string } = {
          0 : "sunny",
          1 : "mainly clear",
          2 : "partly cloudy",
          3 : "overcast",
          45 : "fog",
          48 : "depositing rime fog",
          51 : "light drizzle",
          53 : "moderate drizzle",          
          55 : "dense drizzle",
          56 : "light freezing drizzle",
          57 : "dense freezing drizzle",
          61 : "slight rain",
          63 : "moderate rain",
          65 : "heavy rain",
          66 : "light freezing rain",
          67 : "heavy freezing rain",
          71 : "slight snow",
          73 : "moderate snow",
          75 : "heavy snow",
          77 : "snow grains",
          80 : "slight rain showers",
          81 : "moderate rain showers",
          82 : "violent rain showers",
          85 : "slight snow showers",
          86 : "heavy snow showers",
          95 : "thunderstorm",
          96 : "thunderstorm w/ slight hail",
          99 : "thunderstorm w/ heavy hail"
        }
        // if([0,1].includes(code))
        //   return "sunny";
        // else if(code==2)
        //   return "partly cloudy";
        // else if(code==3)
        //   return "overcast";
        // else if([45,48].includes(code))
        //   return "fog";
        // else if([51,53,55,56,57].includes(code))
        //   return "drizzle";
        // else if([61,63,65,66,67, 80,81,82].includes(code))
        //   return "rain";
        // else if([71, 73, 75, 77, 85, 86].includes(code))
        //   return "snow";
        // else if([95,96,99].includes(code))
        //   return "storm";
        return CodeMap[code];
      }
  }
}

export default App
