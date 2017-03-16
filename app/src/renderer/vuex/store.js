import Vue from 'vue'
import Vuex from 'vuex'
import {remote} from 'electron'
import OAuthElectron from 'salesforce/oauth'
import {configPath} from 'salesforce/config'
import storage from 'ya-storage'

Vue.use(Vuex)

let store = new Vuex.Store({
  state:{
    sessions:[],
    selectedSession: null,
    import:{
      appId:null,
      instanceURL:null,
      accessToken:null,
      refreshToken:null
    }
  },
  mutations:{
    updateSecurity(state, {instanceURL, accessToken, appId, refreshToken, oauthCallbackURL}){
      state.import.instanceURL = instanceURL || state.import.instanceURL
      state.import.accessToken = accessToken || state.import.accessToken
      state.import.appId = appId || state.import.appId
      state.import.refreshToken = refreshToken || state.import.refreshToken
      state.import.oauthCallbackURL = oauthCallbackURL || state.import.oauthCallbackURL
    }
  },
  actions:{
    loadConfig({commit}){
      storage.get(configPath).then((config)=>{
        commit('updateSecurity', config)
      })
    },
    saveConfig({state}){
      return storage.set(configPath,state.import)
    },
    login({state, commit,dispatch}){
      let oauth = new OAuthElectron({appId:state.import.appId, oauthCallbackURL:state.import.oauthCallbackURL})
      return oauth.login().then(function(authResult){
        commit('updateSecurity', authResult)
        return dispatch('saveConfig', state.import)
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

store.dispatch('loadConfig')
export default store
