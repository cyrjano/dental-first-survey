import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    sessions:[],
    selectedSession: null,
    import:{
      loggedIn:false,
      instanceUrl:null,
      accessToken:null,
      username:null,
      show:false
    }
  },
  mutations:{
    showModal(state, payload){
      state.import.show=payload.show
    },
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
  actions:{
    openLoginDialog({commit}){
      commit('showModal',{show:true})
    },
    closeLoginDialog({commit}){
      commit('showModal',{show:false})
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
