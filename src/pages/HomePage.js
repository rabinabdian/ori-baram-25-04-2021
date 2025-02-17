import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Jumbotron, Row, Col } from 'react-bootstrap'

import { weatherImageChooser } from '../components/helper/weatherImageChooser'
import {
  getCurrentWeather,
  getFiveDaysWeather,
} from '../Redux/actions/weatherActions'
import { getCityByCoords } from '../Redux/actions/cityActions'
import Spinner from '../components/layout/Spinner'
import AddFavoriteButton from '../components/AddFavoriteButton'
import SearchBox from '../components/SearchBox'
import ErrorToast from '../components/ErrorToast'
import useGeolocation from '../components/hooks/useGeolocation'
import FiveDaysForecast from '../components/FiveDaysForecast'

const HomePage = () => {
  const [weatherFields, setWeatherFields] = useState({
    WeatherText: null,
    WeatherIcon: null,
    Value: null,
  })
  const [cityField, setCityField] = useState('Tel-Aviv')

  const location = useGeolocation()

  const dispatch = useDispatch()

  const currentWeather = useSelector((state) => state.currentWeather)
  const { loading, error, weather, cityName } = currentWeather

  const cityByCoords = useSelector((state) => state.cityByCoords)
  const { city } = cityByCoords

  const autoComplete = useSelector((state) => state.autoComplete)
  const { isSearch } = autoComplete

  const fiveDaysWeather = useSelector((state) => state.fiveDaysWeather)
  const { error: fiveDaysWeatherError } = fiveDaysWeather

  const favorites = useSelector((state) => state.favorites)
  const { showItem, favoriteCityName } = favorites

  useEffect(() => {
    if (favoriteCityName) {
      setCityField(favoriteCityName)
    }

    if (location.coords && city && !cityName && !favoriteCityName) {
      setCityField(city.EnglishName)
    }

    if (cityName && !favoriteCityName) {
      setCityField(cityName)
    }

    if (weather) {
      setWeatherFields({
        ...weatherFields,
        WeatherText: weather.WeatherText,
        WeatherIcon: weather.WeatherIcon,
        Value: weather.Temperature.Metric.Value,
      })
    }

    // eslint-disable-next-line
  }, [weather])

  const { WeatherText, WeatherIcon, Value } = weatherFields

  const roundedTemperature = Math.round(parseFloat(Value))

  const weatherImage = !loading
    ? weatherImageChooser(WeatherText)
    : 'cloudy-day'

  useEffect(() => {
    if (location.coords && !isSearch && !showItem) {
      const { latitude, longitude } = location.coords
      dispatch(getCityByCoords(latitude, longitude))
    }
    if (city && !isSearch && !showItem) {
      dispatch(getCurrentWeather(city.Key))
      dispatch(getFiveDaysWeather(city.Key))
    } else if (!isSearch && !showItem) {
      dispatch(getCurrentWeather())
      dispatch(getFiveDaysWeather())
    }
    // eslint-disable-next-line
  }, [dispatch, location.coords, isSearch])

  return (
    <>
      <Row className='justify-content-md-center mb-5'>
        <Col md='auto'>
          <SearchBox />
        </Col>
      </Row>
      {loading ? (
        <Spinner />
      ) : error || fiveDaysWeatherError ? (
        <ErrorToast />
      ) : (
        <Jumbotron>
          <img
            src={`/img/weather-images/${weatherImage}.jpg`}
            alt=''
            className='weather-img'
            loading='lazy'
          />
          <div className='weather-icon'>
            <img
              src={`/img/weather-icons/${WeatherIcon}-s.png`}
              alt='weather icon'
              className='column'
              loading='lazy'
            />
            <div className='column'>
              <h4>{cityField} </h4>
              <p className='ml-2'>{roundedTemperature} &deg;</p>
            </div>
          </div>
          <div className='favorite-button'>
            <AddFavoriteButton />
          </div>
          <div className='weather-text'>
            <h1 className='l-heading'>{WeatherText}</h1>
          </div>
          <FiveDaysForecast />
        </Jumbotron>
      )}
    </>
  )
}

export default HomePage
