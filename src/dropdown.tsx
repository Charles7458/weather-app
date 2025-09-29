// import React from "react"

import type { units } from "./omAPI"

export function UnitsDropdown(fn:{show:boolean, isImperial:boolean,isMetric:boolean, setToImperial:()=>void,setToMetric:()=>void,changeUnits:(parameter:string,unit:string)=>void}){
    if(fn.show){
        return(
            <div className="rounded-xl bg-slate-800 h-88 w-70 px-5 absolute right-0 mt-5 z-10">
                {!fn.isImperial &&
                    <button onClick={fn.setToImperial} className="block w-full py-2 my-2 font-semibold rounded-xl bg-gray-600/30">
                        Switch to Imperial
                    </button>
                }

                {!fn.isMetric &&
                    <button onClick={fn.setToMetric} className="block w-full py-2 my-2 font-semibold rounded-xl bg-gray-600/30">
                        Switch to Metric
                    </button>
                }
            </div>
        )
    }
}

export function Dropdown(fn:{options:Array<string>, selected:string}){
    return (
        <div>

        </div>
    )
}

function Options(fn:{name:string, selected:string}){
    return (
        <div>

        </div>
    )
}

export function DaysDropdown(fn:{show: boolean,}){//changeDay:(day:number)=>void, selectedDay:number, days:Array<string>}){
    if(fn.show){
        return(
            <div className="rounded-xl bg-slate-800 h-88 w-70 absolute right-0 mt-5 z-20">

            </div>
        )
    }
}