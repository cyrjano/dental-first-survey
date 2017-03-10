import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    sessions:{},
    selectedSession: null
  },
  mutations:{
    addSession(state, payload) {
      state.sessions[payload.sessionId] = payload
    },
    selectSession(state, payload){
      selectedSession: payload.sessionId
    },
    addSurvey(state, payload){
      state.sessions[payload.sessionId].push(payload.survey)
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
