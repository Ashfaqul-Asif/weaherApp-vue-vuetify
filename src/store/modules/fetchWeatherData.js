/* eslint-disable */
import axios from 'axios' 
import qs from 'query-string'

const api = axios.create({
  baseURL:'https://api.openweathermap.org/data/2.5'
})

const state = {
    currentWeather:'',
    
    query:{
      APPID:'5c739d4b2c4f1230652dea9139c61e83'
    },
    error:null,
    loader:false

  }
  const actions = {
    fetchWeather: async ({commit,state},{latitude,longitude}) => {
      commit("setLoader",true)
      console.log(latitude,longitude);

      let query = {lat:latitude,lon:longitude,...state.query}
      console.log(qs.stringify(query));
  
        let res = await api.get(`/weather?${qs.stringify(query)}`)
  
        let weatherData = res.data
        commit("setWeather", weatherData)
        commit("setLoader",false)
  
        console.log(weatherData);
    
    },
    fetchWeatherBYcity:async({commit,state},{cityName})=>{
   
      try {
        commit("setLoader",true)
        let query={q:cityName,...state.query}
        console.log(cityName);
        let res=await api.get(`/weather?${qs.stringify(query)}`)
        let data=res.data
        console.log(res.data);
        commit("setWeather",data)
        commit("setLoader",false)
      } catch (error) {
        commit("setLoader",false)
        
        commit("setMessage",error.response.data.message)
        
        setTimeout(() => {
          commit("setMessage",null)
        }, 5000);
      }
    }
  }
  const mutations = {
    setWeather: (state, payload) => state.currentWeather = payload,
    weatherByCity:(state,payload)=>state.weatherByCity=payload,
    setMessage:(state,payload)=>state.error=payload,
    setLoader:(state,payload)=>state.loader=payload
  }
  const getters = {
    getWeather: state => state.currentWeather,
    getWeatherByCity:state=>state.weatherByCity,
    getLoader:state=>state.loader,
    getError:state=>state.error

  }
  export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
  


