import { useEffect, useState} from 'react'
import axios from 'axios';
import { checkIsImperial, checkIsMetric, defWeather, getWeather, searchLocation} from './omAPI';//setUnits, searchLocation
import type {cityNameResult, locationSearchResult}  from './omAPI';
import './App.css';
import { DaysDropdown, SearchDropdown, UnitsDropdown } from './Dropdowns';

import logo from './assets/images/logo.svg';
import errorIcon from './assets/images/icon-error.svg';
import retryIcon from './assets/images/icon-retry.png';
import type { units } from './omAPI';
import unitsIcon from './assets/images/icon-units.svg'

import dropdown from './assets/images/icon-dropdown.svg';
import searchIcon from './assets/images/icon-search.svg';
// import bookmark from './assets/images/bookmark_24dp_D9D9D9_FILL0_wght400_GRAD0_opsz24.svg'
// import filledBookmark from './assets/images/bookmark_24dp_D9D9D9_FILL1_wght400_GRAD0_opsz24.svg'
// import bookmarks from './assets/images/bookmarks_24dp_D9D9D9_FILL1_wght400_GRAD0_opsz24.svg'

import drizzle from './assets/images/icon-drizzle.webp';
import fog from './assets/images/icon-fog.webp';
import overcast from './assets/images/icon-overcast.webp';
import partlyCloudy from './assets/images/icon-partly-cloudy.webp';
import rain from './assets/images/icon-rain.webp';
import snow from './assets/images/icon-snow.webp';
import storm from './assets/images/icon-storm.webp';
import sunny from './assets/images/icon-sunny.webp';

import { LoadingScreen } from './LoadingScreen';
import { HourlyDiv, CurrentStats, DailyStats } from './Components';

type hourlyData = {
  time: string,
  temp:number,
  w_code:number
}

const default_units =  {
    temperature: "celsius",
    wind_speed: "km/h",
    precipitation: "mm"
} 


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ['January',"February",'March','April','May','June','July','August','September','October','November','December'];

function App() {
  
    const [isError, setIsError] = useState(false);
    const [isLocPending,setIsLocPending] = useState(true);
    const [isLoading,setIsLoading] = useState(true);
    const [coords, setCoords] = useState<{ latitude: number; longitude: number }>({ latitude: 52.52, longitude: 13.41 });
    const [cityString, setCityString] = useState("")
    const [weather, setWeather] = useState(defWeather);
    let currentLocationId = 0;

    const [date, setDate] = useState(new Date());
    const day = days[date.getDay()];
    const dateString = `${day}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    const hour = date.getHours();

    const [wUnits,setWUnits] = useState<units>(   //loads preferred units if stored. uses metric units if not stored
      ()=>{
        try{
          const pref_units = localStorage.getItem("w_units")
          return pref_units ? JSON.parse(pref_units) :  default_units;
        }
        catch{
          console.log("error accessing preferred units")
          return default_units;
        }
      })

    const [savedLocations, setSavedLocations] = useState<Array<number>>(
      ()=>{
        try{
          const locations = localStorage.getItem("saved_locations");
          return locations ? JSON.parse(locations) : [];
        }

        catch{
          console.log("error accessing saved locations")
          return [];
        }
      }
    )
    
    const [isSaved, setIsSaved] = useState(true);
    const [search, setSearch] = useState("");
    const [searchResults,setSearchResults] = useState<Array<locationSearchResult>>([])
    const [searchIsLoading, setSearchIsLoading] = useState(false);

    const [isImperial, setIsImperial] = useState(checkIsImperial(wUnits));
    const [isMetric, setIsMetric] = useState(checkIsMetric(wUnits));

    const [forecastDay, setForecastDay] = useState<number>(0);

    const [hourly, setHourly] = useState<Array<hourlyData>>([{time:"",temp:0,w_code:0}])

    const [showUnitsDropdown, setShowUnitsDropdown] = useState(false);
    const [showDaysDropdown, setShowDaysDropdown] = useState(false);

    
    
    async function getAllWeather() { // function that gets the forecast
        const currWeather = await getWeather(coords.latitude, coords.longitude, wUnits || default_units);
        if(currWeather===null){
          setIsError(true);
          console.log("fetching weather failed!")
          return;
        }
        setWeather(currWeather || defWeather);
        console.log(currWeather)
        console.log(coords.latitude, coords.longitude)
    }

    async function getCity(){
        const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`)
        const location: cityNameResult = res.data;
        if(res.status!=200){setIsError(true)}
        const country = location.countryName.replace("(the)","")//replaces '(the)' which sometimes pops up in country name
        
        currentLocationId
        setCityString(`${location.city}, ${country}`)
    }

    function getHourly(theDay:number) {
      let newHourlyData : Array<hourlyData>= []
      if(theDay===0){
        for(let i=hour;i<=23;i++){
          const time = weather.hourly.time[i];
          const w_code = weather.hourly.weather_code[i];
          const temp = weather.hourly.temperature_2m[i];
          newHourlyData.push({time: time, w_code: w_code, temp: temp})
        }
        for(let i=0;i<hour;i++){
          const time = weather.hourly.time[i];
          const w_code = weather.hourly.weather_code[i];
          const temp = weather.hourly.temperature_2m[i];
          newHourlyData.push({time: time, w_code: w_code, temp: temp})
        }
      }
      else {
        const start = 24*theDay;
        const end = start + 24;
        for(let i = start;i<end;i++) {
          const time = weather.hourly.time[i];
          const w_code = weather.hourly.weather_code[i];
          const temp = weather.hourly.temperature_2m[i];
          newHourlyData.push({time: time, w_code: w_code, temp: temp})
        }
      }
      setHourly(newHourlyData);
    }

    //saves preferred units in local storage
    function savePrefUnits(){
      localStorage.setItem("w_units",JSON.stringify(wUnits))
    }

    //saves saved location ids in local storage
    function saveLocations(){
      localStorage.setItem("saved_locations",JSON.stringify(savedLocations))
    }

    function unitChange(parameter:string, unit:string){
      setWUnits({...wUnits,[parameter]:unit})
      savePrefUnits()
    }



    function handleSetImperial(){
      setWUnits(
      {
        temperature: "fahrenheit",
        wind_speed: "mph",
        precipitation: "inch"
      });
      savePrefUnits()
    }

    function handleSetMetric(){
      setWUnits(
      {
        temperature: "celsius",
        wind_speed: "km/h",
        precipitation: "mm"
      });  
      savePrefUnits()
    }

    function handleUnitChange(parameter:string, unit:string){
      unitChange(parameter,unit);
    }

    async function handleSearchSelect(index:number){
      setIsLoading(true)
      setCoords(
        {
          latitude: searchResults[index].latitude,
          longitude: searchResults[index].longitude
        })
      setSearch("");
      setSearchResults([])
    }

    useEffect(()=>{
      setIsImperial(checkIsImperial(wUnits));
      setIsMetric(checkIsMetric(wUnits));
    },[wUnits])
        

    useEffect(()=>{ //changing theme according to day or night at the initial load of the page
      var doc = document.documentElement;
      if(hour>6 && hour<17){
        doc.setAttribute("data-theme","light")
      }
      else{doc.setAttribute("data-theme","dark")}
    },[])



    useEffect(()=>{
      console.log("current hour: "+date.getHours())
    },[date])

    useEffect(()=>{  // updates search results when there is a change in search bar
      async function getResults(){
        try{
          setTimeout(async ()=>{
            const results = await searchLocation(search)
            if(results){
              console.log("search results: "+results[0].name)
              setSearchResults(results);

            }
            setSearchIsLoading(false)
          },300)
        }
        catch(err){
          console.error(err)
          setSearchIsLoading(false)
        }
        
      }

      if(search.length>1){
        setSearchResults([])
        setSearchIsLoading(true)
        getResults()
      }
    },[search])

    function fetchLocation(){ // fetches current location of the user defaults to berlin if not fetched
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            setCoords({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            setIsLocPending(false)
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              console.log("User denied location access.");
              alert("Location access denied. Please enable it in your browser settings.");
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              console.log("Location information is unavailable.");
            } else if (error.code === error.TIMEOUT) {
              console.log("The request to get location timed out.");
            } else {
              console.log("An unknown error occurred.", error);
              setIsError(true)
            }
            setIsLocPending(false)
          },
          {//options
            enableHighAccuracy:true, timeout:5000
          }
      )
      }
      else{
        console.log("Geolocation is not supported by this browser.")
        setIsLocPending(false)
      }
    }

    useEffect(()=>{        // fetches current location and weather at initial load of page
      fetchLocation()
      getCity();
      getAllWeather();
    },[])

    useEffect(()=>{ //getting weather and city at initial load and when dependencies change
      if(!isLocPending){
        setIsLoading(true)
        getCity();
        getAllWeather();
      } 
    },[coords, hour, wUnits])

    useEffect(()=>{
      if(weather!=null){
        setDate(new Date(weather.current.time))
        if(!isLoading){
          setIsError(false)
        }
      }
    },[weather])

    useEffect(()=>{               //update hourly forecast if weather or forecast day changes
      if(!isLocPending && weather!=null){
        getHourly(forecastDay);
        setTimeout(()=>{
          console.log("contents loaded")
          setIsLoading(false)
        },500)   
      }
    },[weather,forecastDay, date])
  
  // console.log(document.documentElement.getAttribute("data-theme"))
    function closeAllDropdowns(){
      setShowUnitsDropdown(false);
      setShowDaysDropdown(false);
    }


  if(isLoading){ {/* Loading Screen*/}
    return(
      <LoadingScreen />
    )
  }

  else if(isError){
      return(
        <div className='min-h-[100vh] min-w-[100vw] text-white md:pt-10 md:p-5 pt-5 p-3'>

          <div className="flex mx-2 md:mx-[5vw] justify-between">

            <img src={logo} className='md:w-fit w-[40vw]' alt='logo'/> {/* logo*/}

            <button className='md:h-10 h-8 bg-Neutral-800 rounded-lg py-1 hover:cursor-pointer hover:bg-Neutral-700'> {/*Units button*/}
              <div className='flex gap-x-3 px-3'>
                <img src={unitsIcon} />
                Units
                <img src={dropdown}/>
              </div>
            </button>
          </div>

          <div className='text-center justify-center mt-20'>
              <img src={errorIcon} className='block mx-auto w-16' alt="error icon"/>
              <p className='my-5 font-bold text-3xl'>
                Something Went Wrong
              </p>
              <p className=' text-gray-400'>We couldn't connect to the server (API error)</p>
              <p className=' text-gray-400'>Please try again in a few moments</p>
              {/*Retry button*/}
              <button className='md:h-10 h-8 bg-gray-600/30 rounded-lg py-1 mt-8 hover:cursor-pointer 
                  hover:bg-gray-600/50 text-gray-400 font-semibold hover:text-white' onClick={fetchLocation}> 
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
        <div className='min-h-[100vh] min-w-[100vw] forecast-scrollbar text-white md:pt-10 md:p-5 pt-5 p-3' onClick={closeAllDropdowns}>

          <div className="flex mx-2 md:mx-[5vw] justify-between">

            <img src={logo} className='md:w-fit w-[40vw]'/> {/* logo*/}

            <div className='relative'>
              <button className='md:h-10 h-8 bg-Neutral-700 font-semibold rounded-lg py-1 hover:cursor-pointer hover:bg-Neutral-600'
                onClick={e=>{e.stopPropagation();setShowUnitsDropdown(!showUnitsDropdown)}}> {/*Units button*/}
                <div className='flex gap-x-3 px-3'>
                  <img src={unitsIcon} />
                  Units
                  <img src={dropdown} className={showUnitsDropdown? "rotate-180":""}/>
                </div>
              </button>

              <UnitsDropdown show={showUnitsDropdown} units={wUnits} isImperial={isImperial} isMetric={isMetric} setToImperial={handleSetImperial} setToMetric={handleSetMetric} changeUnits={handleUnitChange}/>
            </div>
            

          </div>


          <p className='text-6xl  font-bri mx-[6vw] md:mx-0 my-16 text-center leading-18'>How's the sky looking today?</p>
          {/* <h1>{coords!=undefined ? `latitude: ${coords?.latitude} longitude: ${coords?.longitude}`: "location is not available"}</h1> */}


          <div className='md:flex items-center justify-center md:mb-10'>{/* search bar and button*/}

              <div className='relative'>

                <input type='search' value={search} onChange={e=>setSearch(e.target.value)} aria-label='search location'
                  className='bg-Neutral-700 placeholder:font-semibold placeholder:text-Neutral-300 rounded-xl py-4 lg:w-[40vw] md:w-[60vw] 
                    w-full ps-16 pe-5 md:me-5 md:m-0 me-10 focus:outline-white focus:outline-1' placeholder='Search for a place...'/>

                <img src={searchIcon} className='relative bottom-9.5 left-6' alt='search icon'/>

                <SearchDropdown handleSearchSelect={handleSearchSelect} isLoading={searchIsLoading} show={searchIsLoading || search.length>1} resultList={searchResults} />

              </div>

              <button type='submit' className='bg-Blue-500 font-bri font-semibold text-lg light:bg-Neutral-0 light:text-black light:hover:bg-Neutral-200 rounded-xl px-7 py-3 md:mb-5 mb-10 md:w-fit w-full hover:cursor-pointer hover:bg-Blue-500/70 ease-in'>
                Search
              </button>

          </div>
          <div className='my-grid gap-10 mx-auto lg:gap-3 xl:gap-10'>

            <div> {/*div wrapping today div and feels like,preceptitation etc.*/}

              <div className='md:grid md:grid-cols-2 today-bg rounded-xl justify-self-end justify-between md:items-center lg:items-center xl:items-center xl:w-[90%] md:ps-10  lg:ps-5 xl:ps-10 w-fit pt-0.5'> {/* today bg div*/}

                  <div className='md:block hidden'>{/*city div (big screens)*/}
                    <p className='text-4xl font-dmsans mb-3'>{cityString}</p>
                    <p className='text-gray-300/60 text-lg'>{dateString}</p>
                  </div>

                  <div className='md:flex hidden align-middle items-center justify-self-start pe-5'>{/* temp weather div (big screens) */}
                    <img className='h-36' src={WCodetoImg(weather.current.weather_code)} alt={WCodetoText(weather.current.weather_code)} title={WCodetoText(weather.current.weather_code)}/>
                    <p className='xl:text-8xl lg:text-7xl md:text-8xl font-dmsans italic ms-7'>{weather.current.temperature_2m.toPrecision(2)}&deg;</p>
                  </div>

                  <div className='md:hidden text-center mt-5 2xs:mb-6 mb-3'>{/*city div (small screens)*/}
                    <p className='text-4xl font-dmsans mb-3'>{cityString}</p>
                    <p className='text-gray-300/60 text-lg'>{dateString}</p>
                  </div>

                  <div className='md:hidden flex align-middle justify-center items-center'>{/* temp weather div (small screens) */}
                    <img className='h-36' src={WCodetoImg(weather.current.weather_code)} alt={WCodetoText(weather.current.weather_code)} title={WCodetoText(weather.current.weather_code)}/>
                    <p className='2xs:text-9xl text-6xl font-dmsans italic ms-5'>{weather.current.temperature_2m.toPrecision(2)}&deg;</p>
                  </div>
              </div>


              <div className='w-fit justify-self-end grid xl:grid-cols-4 grid-cols-2 gap-5 mt-10'> {/*current stats wrapper grid*/}

                <CurrentStats name='Feels Like' data={`${weather.current.apparent_temperature}`+"°"} unit=""/>{/*feels like*/}

                <CurrentStats name='Humidity' data={`${weather.current.relative_humidity_2m}`+'%'} unit='' /> {/*humidity*/}

                <CurrentStats name='Wind' data={`${weather.current.wind_speed_10m}`} unit={wUnits.wind_speed}/> {/*wind*/}

                <CurrentStats name='Preciptiation' data={`${weather.current.precipitation}`} unit={wUnits.precipitation}/> {/*precipitation*/}

              </div>

              <div className='mt-10 xl:w-[90%] lg:justify-self-end'>
                <h4 className='text-Neutral-200 text-xl mb-7'>Daily Forecast</h4>

                <div className='grid md:grid-cols-5 xl:grid-cols-7 lg:grid-cols-5 grid-cols-2 2xs:grid-cols-3  gap-3'>
                  {
                    weather.daily.time.map((time,index)=>
                        <DailyStats key={time} dayName={days[(date.getDay()+index)%7] || ""} min_temp={weather.daily.temperature_2m_min[index]} max_temp={weather.daily.temperature_2m_max[index]} w_code={WCodetoImg(weather.daily.weather_code[index])} w_text={WCodetoText(weather.daily.weather_code[index])}/>
                    )
                  }
                </div>
              </div>
            </div>
            <div className='h-[540px] 2xs:h-[500px] xl:h-[680px] lg:h-[930px] md:h-[600px] xl:w-[80%] w-full bg-Neutral-800 2xs:pt-0 xs:pt-0 md:pt-0 pt-5 px-2 rounded-xl'> {/* hourly weather div*/}
              <span className='2xs:flex justify-between items-center md:mt-0 2xs:mt-[-20px]'>

                <p className='2xs:text-xl font-semibold md:ms-5.5 2xs:ms-5 ms-2'>Hourly forecast</p>

                <div className='relative 2xs:my-0 2xs:ms-0 my-5 ms-2'>{/*day dropdown button*/}

                  <button className='bg-Neutral-700 rounded-lg py-2 me-5 hover:cursor-pointer hover:bg-Neutral-600 ease-in'
                    onClick={e=>{e.stopPropagation();setShowDaysDropdown(!showDaysDropdown)}}> 
                    
                    <div className='flex gap-x-3 ps-4 pe-3 font-bri'>
                      {days[(date.getDay()+forecastDay)%7]}
                      <img src={dropdown} className={showDaysDropdown ? 'rotate-180' : ''}/>
                    </div>

                  </button>

                  <DaysDropdown changeDay={setForecastDay} days={days} show={showDaysDropdown} today={date.getDay()} selectedDay={forecastDay} />
                </div>
                
              </span>

              <div className='h-[400px] xl:h-[570px] lg:h-[830px] md:h-[500px] ps-2 overflow-hidden overflow-y-auto forecast-scrollbar'> 
                  {forecastDay!=0 &&
                    hourly.map((ihour)=>{
                      return <HourlyDiv key={ihour.time} w_name={WCodetoText(ihour.w_code)} img={WCodetoImg(ihour.w_code)} hour={ihour.time} temperature={ihour.temp}/>
                    })
                  }
                  {
                    forecastDay===0 &&
                    <div>
                      {
                        hourly.map((ihour,index)=>{
                          if(index>=23-hour+1 && forecastDay==0){return null;}
                          return <HourlyDiv key={ihour.time} w_name={WCodetoText(ihour.w_code)} img={WCodetoImg(ihour.w_code)} hour={ihour.time} temperature={ihour.temp}/>
                        })
                      }
                    <span>
                      <p className='text-Neutral-300 text-lg my-3 ms-2'>Past hours</p>
                      {
                        hourly.map((ihour,index)=>{
                          if(index<=23-hour){return null;}
                          return <HourlyDiv key={ihour.time} w_name={WCodetoText(ihour.w_code)} img={WCodetoImg(ihour.w_code)} hour={ihour.time} temperature={ihour.temp}/>
                        })
                      }
                    </span>
                    </div>
                  }
              </div>
              
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


export default App
