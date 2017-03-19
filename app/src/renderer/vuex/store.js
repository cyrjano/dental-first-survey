import Vue from 'vue'
import Vuex from 'vuex'
import {remote} from 'electron'
import OAuthElectron from 'salesforce/oauth'
import {configPath} from 'salesforce/config'
import storage from 'ya-storage'

Vue.use(Vuex)

let handleError = function(commit){
  return function(error){
    commit('setAlert', {state:'danger', message:error.message})
    return Promise.reject(error)
  }
}

let store = new Vuex.Store({
  state:{
    alert:{state:'success', message:''},
    oauth:{
      appId:null,
      instanceURL:null,
      accessToken:null,
      refreshToken:null,
      userId:null
    }
  },
  mutations:{
    clearAlert(state){
      state.alert.message = ''
    },
    setAlert(state, alert){
      state.alert.state = alert.state
      state.alert.message = alert.message
    },
    updateSecurity(state, {instanceURL, accessToken, appId, userId, refreshToken, oauthCallbackURL}){
      state.auth.instanceURL = instanceURL || state.auth.instanceURL
      state.auth.accessToken = accessToken || state.auth.accessToken
      state.auth.appId = appId || state.auth.appId
      state.auth.refreshToken = refreshToken || state.auth.refreshToken
      state.auth.oauthCallbackURL = oauthCallbackURL || state.auth.oauthCallbackURL
      state.auth.userId = userId || state.auth.userId
    }
  },
  actions:{
    loadConfig({commit}){
      storage.get(configPath).then((config)=>{
        commit('updateSecurity', config)
      }).catch(handleError(commit))
    },
    saveConfig({state, commit}){
      return storage.set(configPath, state.auth).catch(handleError(commit))
    },
    login({state, commit, dispatch}){
      let oauth = new OAuthElectron({appId:state.auth.appId, oauthCallbackURL:state.auth.oauthCallbackURL})
      return oauth.login().then(function(authResult){
        commit('updateSecurity', authResult)
        dispatch('saveConfig', state.auth)
        return authResult
      }).catch(handleError(commit))
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

store.dispatch('loadConfig')
export default store
