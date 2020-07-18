import Vue from "vue";
import Vuex from "vuex";
import fetchWeatherData from './modules/fetchWeatherData'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    fetchWeatherData
  }
});
