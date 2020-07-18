<template>
  <div :class="bgClasses" class="position-relative weather">

    <v-progress-circular class="align-center" v-if="getLoader" :width="3" color="green" indeterminate>
    </v-progress-circular>

    <v-card class="elevation-0 bg-transparent ">
      <v-toolbar dense class="mx-auto elevation-0 bg-transparent searchbar  ">
        <v-text-field dark prepend-inner-icon="fal  fa-search " :error="getError" :hint="getError" v-model="search"
          @keyup="handleKeyUp" @click:prepend-inner="onSearch" class="elevation-0 search-box pa-2 mt-3 bg-transparent  "
          placeholder="SEARCH CITY">

        </v-text-field>
       
        <download-excel
    class   = "btn btn-default"
    :data   = "[getWeather]"
    :fields = "json_fields"
    worksheet = "My Worksheet"
    name    = "filename.xls">
 
     <img height="30px" width="20px" src="@/assets/arrow.svg">
 
</download-excel>
      </v-toolbar>

    </v-card>

    <v-container v-if="getWeather" class=" text-center text ">
      <p>{{date}},{{day}}</p>
      <p class="temp">{{time}}</p>
      <h3 class="py-1 ">{{getWeather.weather[0].main}}</h3>
      <img :src="`http://openweathermap.org/img/wn/${getWeather.weather[0].icon}@2x.png`" />
      <h1 class="py-1 temp">{{Math.round(getWeather.main.temp-273.15)}}°C</h1>
      <h2 class="py-1">{{getWeather.name}}</h2>
      <hr class="mx-auto my-2" width="40%" style="background-color:white">
    </v-container>
    <v-container v-if="getWeather" class=" text">
      <div class="d-flex flex-wrap justify-space-around">
        <div class="text-center">
          <p class="rmv-margin">{{'Sunrise'}} </p>
          <img height="30px" width="20px" src="@/assets/icons-sunrise.png">
          <p>{{sunrise}}</p>
        </div>
        <div class="text-center">
          <p class="rmv-margin">{{'Sunrise'}} </p>
          <img height="30px" width="20px" src="@/assets/sunset.svg">
          <p>{{ sunset}}</p>
        </div>
        <div class="text-center">
          <p class="rmv-margin">{{'Wind'}} </p>
          <img height="30px" width="20px" src="@/assets/meter.svg">
          <p>{{ getWeather.wind.speed}}</p>
        </div>
        <div class="text-center">
          <p class="rmv-margin">{{'Humidity'}} </p>
          <img height="30px" width="20px" src="@/assets/humidity.svg">
          <p>{{getWeather.main.humidity}}</p>
        </div>


      </div>

    </v-container>
  </div>
</template>

<script>
 
  import JsonExcel from 'vue-json-excel'

  import moment from 'moment';
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  export default {
    name: "WeatherInfo",
    components:{
      'download-excel':JsonExcel
    },
    data() {
      return {
        coordinate: {
          date: '',
          time: '',
          day: '',
          latitude: '',
          longitude: '',
        },
        errorStr: null,
        loader: false,
        search: '',
        bgActive: false,
        json_fields: {
            'City': 'name',
            'Country': 'sys.country',
            'Temperature':'main.temp',
            'Wind Speed':'wind.speed',
            'Sunrise Time':'sys.sunrise',
            'Sunset Time':'sys.sunset'
        },
      
        json_meta: [
            [
                {
                    'key': 'charset',
                    'value': 'utf-8'
                }
            ]
        ],

      }

    },

    computed: {
      ...mapGetters('fetchWeatherData', ['getWeather', 'getWeatherByCity', 'getLoader', 'getError']),
      sunrise() {
        return moment(this.getWeather.sys.sunrise * 1000).format('LT')
      },
      sunset() {
        return moment(this.getWeather.sys.sunset * 1000).format('LT')
      },

      bgClasses() {
        let main = (this.getWeather && this.getWeather.weather.length) && this.getWeather.weather[0].main.toLowerCase()
        if (!main) return {}
        return {
          'linearGradient-rainy': main === 'rain' || main === 'clouds',
          'linearGradient-clear': main === 'clear',
          'linearGradient-sunny': main === 'haze',
        }
      }
    },
    methods: {
      ...mapActions('fetchWeatherData', ['fetchWeather', 'fetchWeatherBYcity']),
      geolocation() {
        if (!("geolocation" in navigator)) {
          this.errorStr = 'Geolocation is not available.';
        }

        // get position
        return navigator.geolocation.getCurrentPosition(pos => {
          let location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
          this.coordinate = {
            ...this.coordinate,
            ...location
          }

          this.fetchWeather(location)
        }, err => {
          this.gettingLocation = false;
          this.errorStr = err.message;
        })
      },
      handleKeyUp({
        keyCode
      }) {
        if (keyCode === 13 && this.search.trim() !== '') {
          this.fetchWeatherBYcity({
            cityName: this.search
          })
        } else if (this.search.trim() === '') {
          console.log(this.coordinate);
          this.fetchWeather(this.coordinate)
        }
      },
      onSearch() {
        if (this.search.trim() !== '') {
          this.fetchWeatherBYcity({
            cityName: this.search
          })

        }
      },
      date() {
        let time = new Date().getTime()
        this.date = moment(time).format('LL')
        this.time = moment(time).format('LT')
        this.day = moment(time).format('dddd');

      }

    },
    created() {
      this.geolocation()
      this.date()

    },
  };
</script>

<style scoped>
  .search-box {
    width: 100%;
    background-color: whitesmoke;
    border-radius: 16px 16px 16px 16px;

  }

  .weather {
    height: 100vh;
    background: linear-gradient(to bottom, rgb(49, 70, 128, 0.8), rgb(178, 194, 238))
  }

  .linearGradient-rainy {

    background: linear-gradient(to bottom, rgb(49, 70, 128, 0.8), rgb(178, 194, 238))
  }

  .linearGradient-clear {

    background: linear-gradient(to bottom, rgb(41, 128, 185, 0.8), rgb(109, 213, 250))
  }

  .linearGradient-sunny {

    background: linear-gradient(to bottom, rgb(255, 179, 71, 0.8), rgb(236, 106, 54))
  }

  .text {
    color: whitesmoke;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.445)
  }


  .temp {
    font-size: 2.5rem;
    font-weight: light;
    color: whitesmoke;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.445)
  }

  .bg-transparent {
    background: transparent !important
  }

  .rmv-margin {
    margin: 0px !important
  }

  .align-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%)
  }

  .error-text {
    color: red;
    font-size: 4rem;
  }

  @media screen and (min-width: 480px) {
    .searchbar {
      width: 50%
    }
  }
</style>