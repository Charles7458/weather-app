import bookmark from './assets/images/bookmark_40dp_D9D9D9_FILL0_wght400_GRAD0_opsz40.svg'
import filledBookmark from './assets/images/bookmark_40dp_D9D9D9_FILL1_wght400_GRAD0_opsz40.svg'
import smallBookmark from './assets/images/bookmark_35dp_D9D9D9_FILL0_wght400_GRAD0_opsz40.svg'
import smallFilledBookmark from './assets/images/bookmark_35dp_D9D9D9_FILL1_wght400_GRAD0_opsz40.svg'

// The component for divs in Hourly Forecast
export function HourlyDiv(hr:{img:string, w_name:string, hour:string, temperature:number}) {

  let hour = new Date(hr.hour).getHours();
  const AMPM = hour>=12 ? "PM" : "AM";
  let Hour12 = hour%12;

  if(Hour12==0){
    Hour12 = 12;
  }

  return(
    <div className='flex h-16 w-[97%] bg-Neutral-700 border border-Neutral-600 shadow-md rounded-xl px-5 mb-5 justify-between items-center me-3'>
      <span className='flex items-center'>
        <img src={hr.img} className='h-16 py-1' alt={hr.w_name} title={hr.w_name}/>
        <p className='ms-3 text-xl text-Neutral-200 font-bri'>{Hour12} {AMPM}</p>
      </span>
      <p className='text-lg'>{hr.temperature}&deg;</p>
     </div>
  )
}

// the divs in Feels Like, Wind Speed, etc.
export function CurrentStats(fn:{name:string,data:string, unit:string}) {

  return(
    <div className='bg-Neutral-800 h-28 xl:w-[181px] lg:w-[27.5vw] w-[45vw] 2xs:ps-5 ps-3 pt-2 rounded-xl border border-Neutral-600'>
      <h4 className='mb-3 text-Neutral-300 font-dmsans text-lg'>{fn.name}</h4>
      <p className='text-Neutral-200 2xs:text-4xl text-5xl font-dmsans'>{fn.data} 
        <span className='text-2xl ms-2'>{fn.unit}</span>
      </p>
    </div>
  )
}

// The divs for the Daily Forecast
export function DailyStats(fn:{dayName:string, w_code:string, w_text:string, min_temp:number, max_temp:number}){
  return(
    <div className='bg-Neutral-700 border-2 border-Neutral-600 rounded-2xl px-2 py-3 shadow-2xl'>
      <p className='text-Neutral-300 text-center'>{fn.dayName.substring(0,3)}</p>
      <img src={fn.w_code} className='md:w-[130px] w-[80px] mx-auto' alt={fn.w_text} title={fn.w_text}></img>
      <div className='flex justify-between'>
        <span className='text-Neutral-300'>{fn.max_temp}&deg;</span>
        <span className='text-Neutral-300'>{fn.min_temp}&deg;</span>
      </div>
    </div>
  )
}

export function SaveButton(fn:{handleSaveLocation:()=>void, isSaved:boolean, handleRemoveSave:()=>void}){
  
  return(
    <button className='p-1 hover:bg-Neutral-300/30 rounded cursor-pointer w-fit
      ms-[-20px] lg:ms-[-10px] xl:ms-[-20px]'  onClick={e=>{e.stopPropagation();fn.isSaved ? fn.handleRemoveSave() : fn.handleSaveLocation() }}>
      {
        fn.isSaved ? 
        <img src={filledBookmark} alt='remove saved location icon' title='Remove from saved'/> :
        <img src={bookmark} className='' alt='save location icon' title='save'/>
        
      }
    </button>
  )
}

export function SmallSaveButton(fn:{handleSaveLocation:()=>void, isSaved:boolean, handleRemoveSave:()=>void}){
  return(
  <button className='p-3 hover:bg-Neutral-300/30 rounded cursor-pointer ms' onClick={e=>{e.stopPropagation();fn.isSaved ? fn.handleRemoveSave()  : fn.handleSaveLocation() }}>
    {
        fn.isSaved ? 
        <img src={smallFilledBookmark} alt='remove saved location icon' title='Remove from saved'/> :
        <img src={smallBookmark} className='' alt='save location icon' title='save'/>
        
      }
  </button>
  )
}
