import Vue from 'vue'
import Vuex from 'vuex'
import {remote} from 'electron'
import OAuthElectron from 'salesforce/oauth'
import {configPath} from 'salesforce/config'
import access from 'salesforce/access'
import storage from 'ya-storage'

Vue.use(Vuex)

let handleError = function (commit) {
  return function (error) {
    commit('setAlert', {state: 'danger', message: error.message})
  }
}

let login = function (auth) {
  let oauth = new OAuthElectron(
    {
      appId: auth.appId,
      oauthCallbackURL: auth.oauthCallbackURL
    })
  return oauth.login()
}
let getAccessToken = function (auth) {
  access.init(auth)
  if (!auth.accessToken) {
    return access.refreshAccessToken().then(function (accessToken) {
      const newAuth = Object.assign({}, auth, {'accessToken': accessToken})
      access.init(newAuth)
      return newAuth
    })
  }
  return auth
}

let store = new Vuex.Store({
  state: {
    alert: {state: 'success', message: ''},
    auth: {
      appId: null,
      instanceURL: null,
      accessToken: null,
      refreshToken: null,
      userId: null,
      oauthCallbackURL: null
    },
    sites:[],
  },
  mutations: {
    replaceSites(state, {sites}){
      state.sites = sites
    },
    clearAlert (state) {
      console.log('clear Alert')
      state.alert.message = ''
    },
    setAlert (state, alert) {
      console.log(`Set alert:${alert.state}-${alert.message}`)
      state.alert.state = alert.state
      state.alert.message = alert.message
    },
    clearAuthParams (state, params) {
      console.log(`clearing ${params}`)
      for (const key of params) {
        state.auth[key] = null
      }
    },
    updateAuth (state, payload) {
      for (const prop in payload) {
        if ([
          'instanceURL',
          'accessToken',
          'appId',
          'userId',
          'refreshToken',
          'oauthCallbackURL'
        ].indexOf(prop) >= 0) {
          state.auth[prop] = payload[prop] || state.auth[prop]
        }
      }
    }
  },
  actions: {
    loadConfig ({commit}) {
      storage.get(configPath).then((config) => {
        commit('updateAuth', config)
      }).catch(handleError(commit))
    },
    saveConfig ({state, commit}) {
      return storage.set(configPath, state.auth).catch(handleError(commit))
    },
    getAuth ({commit, dispatch, state}) {
      return Promise.resolve(state.auth).then(function (auth) {
        if (auth.refreshToken) {
          return auth
        } else {
          return login(auth).then(function (auth) {
            commit('updateAuth', auth)
            dispatch('saveConfig')
            return auth
          })
        }
      }).then(getAccessToken).then(function (auth) {
        commit('updateAuth', auth)
        dispatch('saveConfig')
        return auth
      })
    },
    getSites ({commit, dispatch, state}, {retry = true}) {
      return dispatch('getAuth').then(function (auth) {
        return access.getSites().catch(function (error) {
          if (retry &&
            error.length &&
            error[0].errorCode &&
            error[0].errorCode == 'INVALID_SESSION_ID') {
            commit('clearAuthParams', ['accessToken'])
            return dispatch('getSites', {retry: false})
          }
          if (error.length) {
            throw error[0]
          }
          throw error
        }).then(function(response){
          let sites = response.records.map(function(record){
            return {
              id:record.Id,
              name:record.Name,
              owner:record.Owner?record.Owner.Name:'None',
              type:record.Type
            }
          })
          commit('replaceSites', {sites})
          return sites
        }).catch(handleError(commit))
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

store.dispatch('loadConfig')
export default store
