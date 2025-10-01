// import React from "react"

import type { units } from "./omAPI"
import checkmark from './assets/images/icon-checkmark.svg';
import { temperatures, wind_speeds, preceptiations } from './omAPI';

function Partition(){
    return(
        <hr className="text-gray-700 mx-3 my-1 py-1"></hr>
    )
}

function UnitOptions(fn:{text:string, parameter:string, unit:string, selected:boolean, handleChange:(parameter:string, unit:string)=>void}){
    return (
        <div className={fn.selected ? "rounded-lg bg-Neutral-700 text-Neutral-0 flex justify-between px-2 py-2 my-1":"py-2 px-2 my-1 text-Neutral-200 rounded-lg hover:bg-Neutral-700"}
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

                <h3 className="text-lg text-Neutral-300 mb-3">Temperature</h3>
                {temperatures.map((temp)=>{
                    return <UnitOptions handleChange={fn.changeUnits} text={temp[0]} parameter="temperature" unit={temp[1]} selected={fn.units.temperature==temp[1]} />
                })}

                <Partition/>

                <h3 className="text-lg text-Neutral-300 mb-3">Wind Speed</h3>
                {wind_speeds.map((wind)=>{
                    return <UnitOptions handleChange={fn.changeUnits} text={wind[0]} parameter="wind_speed" unit={wind[1]} selected={fn.units.wind_speed==wind[1]} />
                })}

                <Partition/>

                <h3 className="text-lg text-Neutral-300 mb-3">Preceptitation</h3>
                {preceptiations.map((prcpt)=>{
                    return <UnitOptions handleChange={fn.changeUnits} text={prcpt[0]} parameter="precipitation" unit={prcpt[1]} selected={fn.units.precipitation==prcpt[1]} />
                })}
            </div>
        )
    }
}


export function DaysDropdown(fn:{show: boolean,}){//changeDay:(day:number)=>void, selectedDay:number, days:Array<string>}){
    if(fn.show){
        return(
            <div className="rounded-lg bg-Neutral-800 border border-Neutral-600 shadow-2xl h-88 w-70 px-2 absolute right-0 mt-5 z-10">

            </div>
        )
    }
}