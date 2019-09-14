import React, { Component, Fragment } from 'react'
import Axios from 'axios'
import id from 'uuid'

export default class WeatherApp extends Component {

    constructor(props){
        super(props)
        this.state={
            city:'',
            cityWeather: []
        }
    }

    handleChange=(e)=>{
        const {value} = e.target
        this.setState({
            city:value
        })
    }

    getData (){
        const {city} = this.state
        const url = `https://www.metaweather.com/api/location/search/?query=${city}`
        Axios
        .get(url)
        .then(({data}) =>
            this.getWether(data[0].woeid)
        )
    }

    getWether(woeid){
        const url = `https://www.metaweather.com/api/location/${woeid}`
        Axios
        .get(url)
        .then(({data:{consolidated_weather}}) => 
        this.setState({
            cityWeather: consolidated_weather
        }))
    }

    getWeatherIcon(iconName){
        const url = `https://www.metaweather.com/static/img/weather/${iconName}.svg`
        Axios
        .get(url)
        .then(({data})=> {
            const obj = {__html: data}
            // console.log(obj)
            return obj
        })
    }

    handleClick =()=>{
         this.getData()
    }
    render() {
        const {cityWeather, city} = this.state
        return (
            <div>
                <input 
                    type ='text'
                    name ='city'
                    placeholder = 'City'
                    value= {this.state.city}
                    onChange={this.handleChange}/>
                <button
                    onClick={this.handleClick}
                >Get Weather
                </button> 
                <br/>
                {
                    cityWeather.map((weather)=>{
                        return (
                            <Fragment key = {id.v4()} > 
                            <h2 key = {id.v4()}>{weather.weather_state_name}:
                            <span key = {id.v4()}> 
                                <div 
                                    dangerouslySetInnerHTML= {this.getWeatherIcon(weather.weather_state_abbr)}
                                    style ={{width : "100px"}}
                                /> 
                            </span>
                            </h2>                                                       
                            <p key = {id.v4()}> Air Pressure: {parseFloat(weather.air_pressure).toFixed(2)}</p>
                            <p key = {id.v4()}> Max Temp: {parseFloat( weather.max_temp).toFixed(2)}</p>
                            <p key = {id.v4()}> Min Temp: {parseFloat(weather.min_temp).toFixed(2)}</p>
                            <p key = {id.v4()}> Agg Temp: {parseFloat(weather.the_temp).toFixed(2)}</p>
                            <p key = {id.v4()}> Visibility: {parseFloat(weather.visibility).toFixed(2)}</p>
                            <p key = {id.v4()}> Wind Speed: {parseFloat(weather.wind_speed).toFixed(2)}</p>
                            <br/>      
                            </Fragment>                      
                        )
                    })
                }
            </div>
        )
    }
}

