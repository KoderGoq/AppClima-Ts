import axios from 'axios';
import { Searchtype } from '../types';
import { z } from 'zod';
import { useMemo, useState } from 'react';
// import { object, string, number, InferOutput, parse } from 'valibot';


// Type Guard o Assertion
// const isWeaterResponse = (weather: unknown): weather is Weather => {
//   return (
//     Boolean(weather) &&
//     typeof weather === 'object' &&
//     typeof (weather as Weather).name === 'string' &&
//     typeof (weather as Weather).main.temp === 'number' &&
//     typeof (weather as Weather).main.temp_min === 'number' &&
//     typeof (weather as Weather).main.temp_max === 'number'
//   )
// }


// Zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number()
  })
})

export type Weather = z.infer<typeof Weather>


// Valibot
// const weatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number(),

//   })
// })

// type Weather = InferOutput<typeof weatherSchema>

const initialState = {
  name: '',
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0
  }
}

export default function useWeather() {

  const [weather, setWeather] = useState<Weather>(initialState)
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchWeather = async (search: Searchtype) => {

    const appId = import.meta.env.VITE_API_KEY;
    setLoading(true);
    setWeather(initialState);

    try {

      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
      const { data } = await axios(geoUrl);


      // Comprobar si existe
      if (!data[0]) {
        setNotFound(true);
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

      // Type Asing
      // const { data: weatherResult } = await axios<Weather>(weatherUrl);

      // Type Guard
      // const { data: weatherResult } = await axios(weatherUrl);
      // const result = isWeaterResponse(weatherResult);
      // if (result) {
      //   console.log(weatherResult.name);
      // }

      // Zod
      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      if (result.success) {
        setWeather(result.data)
      }

      // Valibot
      // const { data: weatherResult } = await axios(weatherUrl);
      // const result = parse(weatherSchema, weatherResult);
      // if (result) {
      //   console.log(result.name);
      // }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const hasWeatherData = useMemo(() => weather.name, [weather])
  return {
    weather,
    loading,
    notFound,
    fetchWeather,
    hasWeatherData
  }
}