import axios from 'axios'
import {
  CURRENT_WEATHER_REQUEST,
  CURRENT_WEATHER_SUCCESS,
  CURRENT_WEATHER_FAIL,
  FIVE_DAYS_WEATHER_REQUEST,
  FIVE_DAYS_WEATHER_SUCCESS,
  FIVE_DAYS_WEATHER_FAIL,
  FAVORITE_ITEMS_WEATHER_REQUEST,
  FAVORITE_ITEMS_WEATHER_SUCCESS,
  FAVORITE_ITEMS_WEATHER_FAIL,
  FAVORITE_ITEMS_WEATHER_RESET,
  DEFAULT_LOCATION,
  DEFAULT_CITY_NAME,
} from '../constants/weatherConstants'
import { getCityByName } from '../helper/getCityByName'

export const getCurrentWeather = (
  location = DEFAULT_LOCATION,
  cityName = DEFAULT_CITY_NAME
) => async (dispatch) => {
  try {
    dispatch({ type: CURRENT_WEATHER_REQUEST })

    const { data } = await axios.get(
      `https://dataservice.accuweather.com/currentconditions/v1/${location}?apikey=${process.env.REACT_APP_ACCUWEATHER_KEY}`
    )

    dispatch({
      type: CURRENT_WEATHER_SUCCESS,
      payload: { data: data[0], cityName },
    })
  } catch (error) {
    dispatch({
      type: CURRENT_WEATHER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getFiveDaysWeather = (location = DEFAULT_LOCATION) => async (
  dispatch
) => {
  try {
    dispatch({ type: FIVE_DAYS_WEATHER_REQUEST })

    const { data } = await axios.get(
      `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${location}?apikey=${process.env.REACT_APP_ACCUWEATHER_KEY}&metric=true`
    )

    dispatch({
      type: FIVE_DAYS_WEATHER_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: FIVE_DAYS_WEATHER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getFavoritesWeather = () => async (dispatch, getState) => {
  dispatch({ type: FAVORITE_ITEMS_WEATHER_RESET })

  const favorites = getState().favorites.favoritesItems

  favorites.forEach(async (favorite) => {
    try {
      dispatch({ type: FAVORITE_ITEMS_WEATHER_REQUEST })

      const key = await getCityByName(favorite.cityName)

      const { data } = await axios.get(
        `https://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=${process.env.REACT_APP_ACCUWEATHER_KEY}`
      )

      dispatch({
        type: FAVORITE_ITEMS_WEATHER_SUCCESS,
        payload: { cityName: favorite.cityName, weather: data[0], key },
      })
    } catch (error) {
      dispatch({
        type: FAVORITE_ITEMS_WEATHER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  })
}
