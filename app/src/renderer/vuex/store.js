import Vue from 'vue'
import Vuex from 'vuex'
import {remote} from 'electron'
import OAuthElectron from 'salesforce/oauth'
import access from 'salesforce/access'
import storage from '../storage'
import electron from 'electron'
let app = electron.remote.app
import {checkLevels} from '../checks'
import babyTeethUrl from '../assets/primary_teeth.jpg'
import permanentTeethUrl from '../assets/permanent_teeth.jpg'

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
    survey:{
      babyTeethUrl:babyTeethUrl,
      permanentTeethUrl:permanentTeethUrl,
      grade:'',
      room:'',
      teacher:'',
      firstName:'',
      lastName:'',
      studentId:'',
      birthDate:'',
      checkList:[],
      babyTeeth:[],
      permanentTeeth:[],
      signature:[]
    },
    checkLevels:checkLevels,
    alert: {state: 'success', message: ''},
    auth: {
      appId: null,
      instanceURL: null,
      accessToken: null,
      refreshToken: null,
      userId: null,
      oauthCallbackURL: null
    },
    sites:{downloadDate:null, list:[]},
    newSession:{
      selectedItem:null
    },
    sessions:[],
    activeSession:-1,
    loaded:false
  },
  mutations: {
    finishLoading(state){
      state.loaded = true
    },
    addLine(state, lineMap){
      for (var key in lineMap) {
        if (lineMap.hasOwnProperty(key)) {
          state.survey[key].push(lineMap[key])
        }
      }
    },
    updateSurvey(state, update){
      Object.assign(state.survey, update)
    },
    activateSession(state, id){
      state.activeSession = id
    },
    addSession(state, session){
      state.sessions.splice(0,0, session)
    },
    addSurvey(state, survey){
      let session = state.sessions.find(s => s.date == state.activeSession)
      session.surveys.push(survey)
      Object.assign(state.survey, {
        firstName:'',
        lastName:'',
        studentId:'',
        birthDate:'',
        checkList:[],
        babyTeeth:[],
        permanentTeeth:[],
        signature:[]
      })
    },
    selectSite(state, site){
      state.newSession.selectedItem = site
    },
    replaceSites(state, sites){
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
    newSession({state, commit, dispatch}){
      let session = {
        date:Date.now(),
        siteId:state.newSession.selectedItem.id,
        siteName:state.newSession.selectedItem.name,
        surveys:[]
      }
      commit('addSession', session)
      commit('activateSession', session.date)
      commit('selectSite', null)
      return dispatch('saveSession', {id:session.date})
    },
    saveSession({state, commit}, {id}){
      const session = state.sessions.find(session=>session.date === id)
      return storage.saveSession(session).catch(handleError(commit))
    },
    saveSurvey({state, commit}){
      let survey = state.survey
      let newSurvey = {
        date:Date.now(),
        sessionId:state.activeSession,
        grade:survey.grade,
        room:survey.room,
        teacher:survey.teacher,
        firstName:survey.firstName,
        lastName:survey.lastName,
        studentId:survey.studentId,
        birthDate:survey.birthDate,
        checkList:survey.checkList.slice(0),
        babyTeeth:survey.babyTeeth.slice(0),
        permanentTeeth:survey.permanentTeeth.slice(0),
        signature:survey.signature.slice(0)
      }
      commit('addSurvey', newSurvey)
      return storage.saveSurvey(newSurvey)
    },
    loadSessions({commit}){
      storage.loadSessions().then(function(sessions){
        sessions.map(function(session) {
          commit('addSession', session)
        })
        commit('finishLoading')
      }).catch(handleError(commit))
    },
    loadConfig ({commit}) {
      storage.loadConfig().then((config) => {
        commit('updateAuth', config)
      }).catch(handleError(commit))
    },
    saveConfig ({state, commit}) {
      return storage.saveConfig(state.auth).catch(handleError(commit))
    },
    loadSites({commit}){
      storage.loadSites().then(sites =>{
        commit('replaceSites', sites)
      }).catch(handleError(commit))
    },
    saveSites({state, commit}) {
      return storage.saveSites(state.sites).catch(handleError(commit))
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
          commit('replaceSites', {downloadDate:Date.now(), list:sites})
          dispatch('saveSites')
          return sites
        }).catch(handleError(commit))
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

store.dispatch('loadConfig')
store.dispatch('loadSites')
store.dispatch('loadSessions')
export default store
