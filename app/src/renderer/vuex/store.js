import Vue from 'vue'
import Vuex from 'vuex'
import {remote} from 'electron'
import OAuthElectron from 'salesforce/oauth'
import {configPath} from 'salesforce/config'
import storage from 'ya-storage'

Vue.use(Vuex)

let handleError = function(commit){
  return function(error){
    commit('setError', error)
    return Promise.reject(error)
  }
}

let store = new Vuex.Store({
  state:{
    errorMessage:'Hello',
    import:{
      appId:null,
      instanceURL:null,
      accessToken:null,
      refreshToken:null
    }
  },
  mutations:{
    clearError(state){
      state.errorMessage = ''
    },
    setError(state, {message}){
      state.errorMessage = message
    },
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
      }).catch(handleError(commit))
    },
    saveConfig({state, commit}){
      return storage.set(configPath, state.import).catch(handleError(commit))
    },
    login({state, commit, dispatch}){
      let oauth = new OAuthElectron({appId:state.import.appId, oauthCallbackURL:state.import.oauthCallbackURL})
      return oauth.login().then(function(authResult){
        commit('updateSecurity', authResult)
        return dispatch('saveConfig', state.import)
      }).catch(handleError(commit))
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

store.dispatch('loadConfig')
export default store
