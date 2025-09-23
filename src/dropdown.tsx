// import React from "react"

export function UnitsDropdown(){
    return(
        <div>

        </div>
    )
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

function DaysDropdown(fn:{show: boolean,changeDay:(day:number)=>void, selectedDay:number, days:Array<string>}){
    if(fn.show){
        return(
            <div>

            </div>
        )
    }
}