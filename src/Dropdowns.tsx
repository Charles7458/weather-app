// import React from "react"

import type { units, locationSearchResult } from "./omAPI"
import checkmark from './assets/images/icon-checkmark.svg';
import { temperatures, wind_speeds, preceptiations } from './omAPI';
import { useEffect} from "react";
import { CircleFlag } from "react-circle-flags";
import loading from './assets/images/icon-loading.svg'

function Partition(){
    return(
        <hr className="text-gray-700 mx-3 my-1 py-1"></hr>
    )
}

function UnitOptions(fn:{text:string, parameter:string, unit:string, selected:boolean, handleChange:(parameter:string, unit:string)=>void}){
    return (
        <div className={fn.selected ? "rounded-lg bg-Neutral-700 text-Neutral-0 flex justify-between px-2 py-2 my-1":"py-2 px-2 my-1 text-Neutral-0 rounded-lg hover:bg-Neutral-700"}
            onClick={e=>{e.stopPropagation();fn.handleChange(fn.parameter,fn.unit)}}>
            {fn.text}
            {fn.selected && <img src={checkmark}></img>}
        </div>
    )
}


export function UnitsDropdown(fn:{show:boolean,units:units, isImperial:boolean,isMetric:boolean, setToImperial:()=>void,setToMetric:()=>void,changeUnits:(parameter:string,unit:string)=>void}){

    if(fn.show){
        
        return(
            <div className="rounded-xl bg-Neutral-800 border border-Neutral-600 shadow-2xl h-fit w-70 px-2 pb-3 absolute right-0 mt-5 z-10">
                {!fn.isImperial &&
                    <button onClick={e=>{e.stopPropagation();fn.setToImperial()}} className="block w-full py-2 mt-2 font-semibold rounded-lg hover:bg-Neutral-600 cursor-pointer ease-in">
                        Switch to Imperial
                    </button>
                }

                {!fn.isMetric &&
                    <button onClick={e=>{e.stopPropagation();fn.setToMetric()}} className="block w-full py-2 mt-2 font-semibold rounded-lg hover:bg-Neutral-600 cursor-pointer ease-in">
                        Switch to Metric
                    </button>
                }

                <h3 className="ps-2 text-Neutral-300 mb-3">Temperature</h3>
                {temperatures.map((temp)=>{
                    return <UnitOptions key={temp[0]} handleChange={fn.changeUnits} text={temp[0]} parameter="temperature" unit={temp[1]} selected={fn.units.temperature==temp[1]} />
                })}

                <Partition/>

                <h3 className="ps-2 text-Neutral-300 mb-3">Wind Speed</h3>
                {wind_speeds.map((wind)=>{
                    return <UnitOptions key={wind[0]} handleChange={fn.changeUnits} text={wind[0]} parameter="wind_speed" unit={wind[1]} selected={fn.units.wind_speed==wind[1]} />
                })}

                <Partition/>

                <h3 className="ps-2 text-Neutral-300 mb-3">Preceptitation</h3>
                {preceptiations.map((prcpt)=>{
                    return <UnitOptions key={prcpt[0]} handleChange={fn.changeUnits} text={prcpt[0]} parameter="precipitation" unit={prcpt[1]} selected={fn.units.precipitation==prcpt[1]} />
                })}
            </div>
        )
    }
}

function SearchOptions(fn:{country_code:string,id:number,placeName:string, handleSelect:()=>void}){
    return(
        <div className="flex justify-between items-center py-2 px-5 mt-2 font-semibold rounded-lg hover:bg-Neutral-600 cursor-pointer ease-in"
            onClick={e=>{e.stopPropagation();fn.handleSelect()}}>
            <p className="">{fn.placeName}</p>
            <CircleFlag countryCode={fn.country_code} width="30px"/>
        </div>
    )
}

export function SearchDropdown(fn:{show:boolean,isLoading:boolean, resultList:Array<locationSearchResult>,handleSearchSelect:(index:number)=>void}) {

    function handleSelect(index:number){
        fn.handleSearchSelect(index)
    }

    if(fn.show && fn.isLoading){
        return(
            <div className="flex rounded-lg bg-Neutral-700 border border-Neutral-600 shadow-2xl h-fit w-full md:w-[60vw] lg:w-[40vw] px-5 py-3 absolute z-10">
                <img src={loading} className="rotation me-5 w-6"/>
                Search in progress
            </div>
        )
    }

    else if (fn.show && fn.resultList.length==0){
        return(
            <div className="rounded-lg bg-Neutral-700 border border-Neutral-600 shadow-2xl h-fit w-full md:w-[60vw] lg:w-[40vw] px-4 py-4 absolute z-10">
                No results found
            </div>
        )
    }

    else if(fn.show && fn.resultList.length>0){
        return(
            <div className="rounded-lg bg-Neutral-700 border border-Neutral-600 shadow-2xl h-70 w-full md:w-[60vw] lg:w-[40vw] px-2 absolute z-10">
                {
                    fn.resultList.map((result,index)=>
                        <SearchOptions handleSelect={()=>handleSelect(index)} country_code={result.country_code.toLowerCase()} key={result.id} id={result.id} placeName={result.name}/>
                    )
                }
            </div>
        )
    }
}


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayKeys = [11,12,13,14,15,16,17]

export function DaysDropdown(fn:{show: boolean,today:number,changeDay:(day:number)=>void, selectedDay:number, days:Array<string>}){

    const changeDay = fn.changeDay;
    let selectedDay = fn.selectedDay;

    useEffect(()=>{ //listens for arrow up and arrow down presses

        const handleKeyDown = (event: KeyboardEvent)=>{
        if(event.key==="ArrowDown" && fn.show){
            event.preventDefault();
            changeDay((selectedDay+1)%7);
            selectedDay=(selectedDay+1)%7;
        }
        if(event.key==="ArrowUp" && fn.show){
            event.preventDefault();
            selectedDay==0 ? changeDay(6) : changeDay(selectedDay-1);
            selectedDay= selectedDay==0 ? 6 : selectedDay-1
        }
    }

        document.addEventListener("keydown",handleKeyDown);
        return ()=>document.removeEventListener("keydown",handleKeyDown)
    },[fn.show])

    function DayOption(fnDO:{dayNumber:number}){
        
        return(
            <button onClick={()=>changeDay(fnDO.dayNumber)} 
                className={fnDO.dayNumber==fn.selectedDay ? "block w-full py-2 mt-2 font-semibold rounded-lg bg-Neutral-600 cursor-pointer ease-in" : 
                    "block w-full py-2 mt-2 font-semibold rounded-lg hover:bg-Neutral-600 cursor-pointer ease-in"}>
                {days[(fnDO.dayNumber+fn.today)%7]}
            </button>
        )
    }

    if(fn.show){

        return(
            <div className="rounded-lg bg-Neutral-700 border border-Neutral-600 shadow-2xl h-88 w-48 px-2 absolute right-4 mt-3 z-10">

            {dayKeys.map((d,i)=>
                <DayOption key={d} dayNumber={i} />
            )}

            </div>
        )
    }
}
