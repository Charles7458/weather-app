import axios, {type AxiosResponse } from 'axios';

export type locationSearchResult = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    admin2_id: number;
    admin3_id: number;
    admin4_id: number;
    timezone: string;
    population: number;
    post_codes: Array<string>;
    country_id: number;
    country: string;
    admin1: string;
    admin2: string;
    admin3: string;
    admin4: string;
}

export type weather = {
    latitude: number,
    longitude: number,
    generationtime_ms: number,
    utc_offset_seconds: number,
    timezone: string,
    timezone_abbreviation: string,
    elevation: number,
    current_units: {
        time: string,
        interval: string,
        wind_speed_10m: string,
        temperature_2m: string,
        relative_humidity_2m: string,
        apparent_temperature: string,
        precipitation: string,
        weather_code: string,
    },
    current: {
        time: string,
        interval: number,
        wind_speed_10m: number,
        temperature_2m: number,
        relative_humidity_2m: number,
        apparent_temperature: number,
        precipitation: number,
        weather_code: number,
    },
    hourly_units: {
        time: string,
        temperature_2m: string,
        weather_code: string,
        apparent_temperature: string,
        precipitation_probability: string,
    },

    hourly: {
        time: Array<string>,
        temperature_2m: Array<number>,
        weather_code: Array<number>,
        apparent_temperature: Array<number>,
        precipitation_probability: Array<number>,
    },
    daily_units: {
        time: string,
        weather_code: string,
        temperature_2m_max: string,
        temperature_2m_min: string,
        precipitation_probability_max: string,
    },
    daily: {
      time: Array<string>,
      weather_code: Array<number>,
      temperature_2m_max: Array<number>,
      temperature_2m_min: Array<number>,
      precipitation_probability_max: Array<number>,
    }
}

export const defWeather: weather = {
    latitude: 0,
    longitude: 0,
    generationtime_ms: 0,
    utc_offset_seconds: 0,
    timezone: "",
    timezone_abbreviation: "",
    elevation: 0,
    current_units: {
        time: "",
        interval: "",
        wind_speed_10m: "km/h",
        temperature_2m: "",
        relative_humidity_2m: "",
        apparent_temperature: "",
        precipitation: "",
        weather_code: "",
    },
    current: {
        time: "",
        interval: 0,
        wind_speed_10m: 0,
        temperature_2m: 0,
        relative_humidity_2m: 0,
        apparent_temperature: 0,
        precipitation: 0,
        weather_code: 0,
    },
    hourly_units: {
    time: "",
    temperature_2m: "",
    weather_code: "",
    apparent_temperature: "",
    precipitation_probability: "",
  },
  hourly: {
    time: [""],
    temperature_2m: [0],
    weather_code: [0],
    apparent_temperature: [0],
    precipitation_probability: [0],
  },
  daily_units: {
    time: "",
    weather_code: "",
    temperature_2m_max: "",
    temperature_2m_min: "",
    precipitation_probability_max: "",
  },
    daily: {
      time:[""],
      weather_code: [0],
      temperature_2m_min: [0],
      temperature_2m_max: [0],
      precipitation_probability_max: [0],
    }
}

export type locationSearchList = {
    results: Array<locationSearchResult>
}

export type units = {
  temperature: string;
  wind_speed: string;
  precipitation: string;
}

export const temperatures = [["Celsius(°C)","celsius"], ["Fahrenheit(°F)","fahrenheit"]]
export const wind_speeds = [["km/h","km/h"],["mph","mph"],["m/s","ms"],["Knots","kn"]]
export const preceptiations = [["Millimeters(mm)","mm"],["Inch (in)","inch"]]



export function checkIsImperial(units:units) {
  return units.temperature=="fahrenheit" && units.wind_speed=="mph" && units.precipitation=="inch";
}

export function checkIsMetric(units:units) {
  return units.temperature=="celsius" && units.wind_speed=="km/h" && units.precipitation=="mm";
}

/*
 temperature:   farenheit -> &temperature_unit=farenheit , default = celsius
 Wind Speed:    m/s -> &wind_speed_unit=ms , mph -> &wind_speed_unit=mph , knots = &wind_speed_unit=kn , default = km/h
 Preciptiation: inch -> precipitation_unit=inch (in) , default = millimeter (mm)
*/

// celsius = &#8451; , farenheit = &#8457;
//api for getting current weather along with 7 days ahead and hourly weather

export async function getWeather(lat: number|undefined, long: number|undefined, units:units): Promise<weather | null> {
  if(lat==undefined || long == undefined){return null;}
  const temp_unit = units.temperature=="celsius" ? "": `&temperature_unit=${units.temperature}`
  const wind_speed = units.wind_speed=="km/h" ? "": `&wind_speed_unit=${units.wind_speed}`
  const precipitation = units.precipitation=="mm" ? "": `&precipitation_unit=${units.precipitation}`
  const result: AxiosResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,`+
    "temperature_2m_max,temperature_2m_min&hourly=temperature_2m,weather_code&current=wind_speed_10m,temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code&timezone=auto"
    +temp_unit+wind_speed+precipitation);

  const weather:weather = result.data

  return weather;
}

export async function searchLocation(name: string): Promise<Array<locationSearchResult> | null> {
      const location = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=10&language=en&format=json`);
      const locationList: locationSearchList = location.data;
      return locationList.results;
}     

export type cityNameResult =
{
  latitude: number,
  lookupSource: string,
  longitude: number,
  localityLanguageRequested: string,
  continent: string,
  continentCode: string,
  countryName: string,
  countryCode: string,
  principalSubdivision: string,
  principalSubdivisionCode: string,
  city: string,
  locality: string,
  postcode: string,
  plusCode: string,
  fips: {
    state: string,
    county: string,
    countySubdivision: string,
    place: string
  },
  localityInfo: 
    {
      administrative: Array<admin>
    }
  }

type admin = {
  name: string,
  description: string,
  isoName: string,
  order: number,
  adminLevel: number,
  isoCode: string,
  wikidataId: string,
  geonameId: number
}