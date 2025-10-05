
import './App.css';

import logo from './assets/images/logo.svg';

import loading from './assets/images/icon-loading.svg';
import unitsIcon from './assets/images/icon-units.svg'

import dropdown from './assets/images/icon-dropdown.svg';
import searchIcon from './assets/images/icon-search.svg';

function HourlyDiv() {

  return(
    <div className='flex h-16 w-[97%] bg-Neutral-700 border border-Neutral-600 shadow-md rounded-xl px-5 mb-5 justify-between items-center me-3'>
     </div>
  )
}

function DailyStats(){
  return(
    <div className='bg-Neutral-700 border-2 border-Neutral-600 rounded-2xl h-40 w-28 shadow-2xl'>

    </div>
  )
}

function CurrentStats(fn:{name:string}) {

  return(
    <div className='bg-Neutral-800 h-28 xl:w-[181px] lg:w-[27.5vw] w-[45vw] 2xs:ps-5 ps-3 pt-2 rounded-xl border border-Neutral-600'>
        <h4 className='mb-3 text-Neutral-300 font-dmsans text-lg'>{fn.name}</h4>
        <p className='text-Neutral-200 2xs:text-4xl text-5xl lg:ps-3 font-dmsans'>
            - 
        </p>
    </div>
  )
}

export function LoadingScreen(){
    return(
        <div className='min-h-[100vh] min-w-[100vw] forecast-scrollbar text-white md:pt-10 md:p-5 pt-5 p-3'>

          <div className="flex mx-2 md:mx-[5vw] justify-between">

            <img src={logo} className='md:w-fit w-[40vw]' alt='logo'/> {/* logo*/}

            <div className='relative'>
              <button className='md:h-10 h-8 bg-Neutral-700 font-semibold rounded-lg py-1 hover:cursor-pointer hover:bg-Neutral-600'
                > {/*Units button*/}
                <div className='flex gap-x-3 px-3'>
                  <img src={unitsIcon} alt='units' />
                  Units
                  <img src={dropdown} alt='dropdown'/>
                </div>
              </button>

            </div>
            

          </div>


          <h1 className='text-6xl  font-bri mx-[6vw] md:mx-0 my-16 text-center leading-18'>How's the sky looking today?</h1>

          <div className='md:flex items-center justify-center md:mb-10'>{/* search bar and button*/}

              <div className='relative'>

                <input type='search' aria-label='search location' disabled
                  className='bg-Neutral-700 placeholder:font-semibold placeholder:text-Neutral-300 rounded-xl py-4 lg:w-[40vw] md:w-[60vw] 
                    w-full ps-16 pe-5 md:me-5 md:m-0 me-10 focus:outline-white focus:outline-1' placeholder='Search for a place...'/>
                <img src={searchIcon} className='relative bottom-9.5 left-6' alt='search icon'/>
              </div>

              <button type='submit' className='bg-Blue-500 font-bri font-semibold text-lg light:bg-Neutral-0 light:text-black light:hover:bg-Neutral-200 rounded-xl px-7 py-3 md:mb-5 mb-10 md:w-fit w-full hover:cursor-pointer hover:bg-Blue-500/70 ease-in'>
                Search
              </button>

          </div>
          <div className='my-grid gap-10 mx-auto lg:gap-3 xl:gap-10'>

            <div> {/*div wrapping today div and feels like,preceptitation etc.*/}

              <div className='md:grid md:grid-cols-2 bg-Neutral-800 rounded-xl justify-self-end  md:items-center 
                xl:h-[280px] lg:h-[200px] h-[280px] xl:w-[90%] md:ps-10  lg:ps-5 xl:ps-10 w-full pt-0.5'> {/* today bg div*/}

                  <img src={loading} alt='loading icon' className='xl:w-38 w-28 rotation md:ms-[75%] mx-auto md:mt-0 mt-26'></img>
              </div>


              <div className='w-fit justify-self-end grid xl:grid-cols-4 grid-cols-2 gap-5 mt-10'> {/*current stats wrapper grid*/}

                <CurrentStats name='Feels Like'/>{/*feels like*/}

                <CurrentStats name='Humidity' /> {/*humidity*/}

                <CurrentStats name='Wind' /> {/*wind*/}

                <CurrentStats name='Preciptiation' /> {/*precipitation*/}

              </div>

              <div className='mt-10 xl:w-[90%] lg:justify-self-end'>
                <h4 className='text-Neutral-200 text-xl mb-7'>Daily Forecast</h4>

                <div className='grid md:grid-cols-5 xl:grid-cols-7 lg:grid-cols-5 grid-cols-2 2xs:grid-cols-3 gap-3'>
                  {
                    Array(7).fill(0).map(()=>
                        <DailyStats  />
                    )
                  }
                </div>
              </div>
            </div>
            <div className='h-[540px] 2xs:h-[500px] xl:h-[710px] lg:h-[920px] md:h-[600px] xl:w-[80%] w-full bg-Neutral-800 2xs:pt-0 xs:pt-0 md:pt-0 pt-5 px-2 rounded-xl'> {/* hourly weather div*/}
              <span className='2xs:flex justify-between items-center md:mt-0 2xs:mt-[-20px]'>

                <p className='2xs:text-xl font-semibold 2xs:ms-5 ms-2'>Hourly forecast</p>

                <div className='relative 2xs:my-0 2xs:ms-0 my-5 ms-2'>{/*day dropdown button*/}

                  <button className='bg-Neutral-700 rounded-lg py-2 me-5 hover:cursor-pointer hover:bg-Neutral-600 ease-in'> 
                    
                    <div className='flex gap-x-3 ps-4 pe-3 font-bri'>
                        -
                      <img src={dropdown} alt='dropdown'/>
                    </div>

                  </button>
                </div>
                
              </span>

              <div className='h-[400px] xl:h-[620px] lg:h-[830px] md:h-[500px] ps-2 overflow-hidden overflow-y-auto forecast-scrollbar'> 
                  {Array(14).fill(0).map(()=>{
                      return <HourlyDiv />
                    })
                  }
                  
              </div>
              
            </div>

          </div>
        </div>
    )
}