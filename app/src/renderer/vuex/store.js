import Vue from 'vue'
import Vuex from 'vuex'
import {remote} from 'electron'
import OAuthElectron from 'salesforce/oauth'
import access from 'salesforce/access'
import storage from '../storage'
import papa from 'papaparse'
let {app, dialog, BrowserWindow} = remote

import {checkLevels} from '../checks'
import babyTeethUrl from '../assets/primary_teeth.jpg'
import permanentTeethUrl from '../assets/permanent_teeth.jpg'

Vue.use(Vuex)
function generatePDFs (exportPath, sessionUrl) {
  return new Promise(function (resolve, reject) {
    let win = new BrowserWindow({useContentSize: true, show: false})
    win.loadURL(sessionUrl)
    win.on('page-title-updated', function (event, title) {
      if (title === 'finish') {
        win.close()
        win = null
        resolve()
      }
      let titleParts = title.split(':')

      if (titleParts[0] === 'print') {
        const surveyName = titleParts[1]
        win.webContents.printToPDF({}, function (err, data) {
          if (err) {
            win.close()
            win = null
            reject(err)
          }
          storage.savePDF(exportPath, surveyName, data)
          win.webContents.send('status', 'ready')
        })
      }
    })
  })
}

function getChildAge (survey, record) {
  if (survey.birthDate) {
    const ageSeconds = Date.now() - Date.parse(survey.birthDate)
    console.log(ageSeconds)
    const age = new Date(ageSeconds).getUTCFullYear() - 1970
    return age
  }
  if (record && record.childsAge) {
    return record.childsAge
  }
  return null
}

function getOutputRecord (siteId, siteName, survey, record) {
  let prioritySet  = new Set(survey.checkList.map(c=>parseInt(c[0])))
  const needsFollowUp = prioritySet.has(1) || prioritySet.has(2)

  let output = {
    'Lead type':'DentalFirst',
    'Student ID': survey.studentId,
    'School Site:Account ID': siteId,
    'School Site:Account Name': siteName,
    'First Name': survey.firstName,
    'Last Name': survey.lastName,
    'Teacher': survey.teacher,
    'Date of Birth': survey.birthDate,
    'Priority':[...prioritySet].sort().reverse()[0],
    'Follow-up Required': needsFollowUp ? 'Yes' : 'No',
    'Status': needsFollowUp ? 'Open - Outreach Required' : 'Closed - Passed screening',
    'PDF Name': `${survey.studentId}.${new Date(survey.date).toISOString().split('T')[0]}.pdf`,
    'Screening Outreach':'',
    'Date Child Screened':new Date(survey.date).toISOString().split('T')[0]
  }

  const childsAge = getChildAge(survey, record)
  if (childsAge) {
    output["Child's Age"] = childsAge
  }
  if (record && record.zipCode) {
    output['Zip Code'] = record.zipCode
  }
  if (record && record.gender) {
    output['Gender'] = record.gender
  }
  if (record && record.preferredLanguage) {
    output['Preferred Language'] = record.preferredLanguage
  }
  if (record && record.stateId) {
    output['State Identifier'] = record.stateId
  }
  return output
}

function cleanSurvey () {
  return {
    firstName: '',
    lastName: '',
    studentId: '',
    birthDate: '',
    comment:'',
    checkList: [],
    babyTeeth: [],
    permanentTeeth: [],
    signature: []
  }
}
function cleanFullSurvey () {
  return Object.assign(cleanSurvey(), {
    room: '',
    teacher: '',
    grade: ''
  })
}

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
    survey: {
      babyTeethUrl: babyTeethUrl,
      permanentTeethUrl: permanentTeethUrl,
      grade: '',
      room: '',
      teacher: '',
      firstName: '',
      lastName: '',
      comment: '',
      studentId: '',
      birthDate: '',
      checkList: [],
      babyTeeth: [],
      permanentTeeth: [],
      signature: []
    },
    checkLevels: checkLevels,
    alert: {state: 'success', message: ''},
    auth: {
      appId: null,
      instanceURL: null,
      accessToken: null,
      refreshToken: null,
      userId: null,
      oauthCallbackURL: null
    },
    sites: {downloadDate: null, list: []},
    newSession: {
      selectedItem: null,
      selectedFile: []
    },
    sessions: [],
    activeSession: -1,
    loaded: false
  },
  mutations: {
    finishLoading (state) {
      state.loaded = true
    },
    addLine (state, lineMap) {
      for (var key in lineMap) {
        if (lineMap.hasOwnProperty(key)) {
          state.survey[key].push(lineMap[key])
        }
      }
    },
    updateSurvey (state, update) {
      Object.assign(state.survey, update)
    },
    activateSession (state, id) {
      state.activeSession = id
    },
    addSession (state, session) {
      state.sessions.splice(0, 0, session)
    },
    addSurvey (state, survey) {
      let session = state.sessions.find(s => s.date == state.activeSession)
      session.surveys.push(survey)
    },
    updateFile (state, file) {
      state.newSession.selectedFile = file
    },
    selectSite (state, site) {
      state.newSession.selectedItem = site
    },
    replaceSites (state, sites) {
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
    searchId ({commit, state}) {
      const activeSession = state.sessions.find(s => s.date === state.activeSession)
      const record = activeSession.records.find(r => r.studentId === state.survey.studentId)
      if (!record) {
        commit('setAlert', {state: 'danger', message: 'Student id not found'})
      } else {
        let update = {}
        for (const key in record) {
          if (['firstName', 'lastName', 'birthDate', 'teacher'].indexOf(key) >= 0) {
            update[key] = record[key]
          }
        }
        commit('updateSurvey', update)
      }
    },
    selectFile ({commit}, file) {
      return new Promise((resolve, reject) => {
        papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            resolve(results.data)
          },
          error: function (err) {
            reject(err)
          }
        })
      }).then(function (results) {
        console.log(results)
        commit('updateFile', results)
      }).catch(handleError(commit))
    },
    newSession ({state, commit, dispatch}) {
      let session = {
        date: Date.now(),
        siteId: state.newSession.selectedItem.id,
        siteName: state.newSession.selectedItem.name,
        surveys: [],
        records: state.newSession.selectedFile.slice(0)
      }
      commit('addSession', session)
      dispatch('activateSession', {id: session.date})
      return dispatch('saveSession', {id: session.date})
    },
    activateSession ({commit}, {id}) {
      commit('activateSession', id)
      commit('selectSite', null)
      commit('updateFile', [])
      commit('updateSurvey', cleanFullSurvey())
    },
    saveSession ({state, commit}, {id}) {
      const session = state.sessions.find(session => session.date === id)
      return storage.saveSession(session).catch(handleError(commit))
    },
    saveSurvey ({state, commit}) {
      let survey = state.survey
      let newSurvey = {
        date: Date.now(),
        sessionId: state.activeSession,
        grade: survey.grade,
        room: survey.room,
        teacher: survey.teacher,
        firstName: survey.firstName,
        lastName: survey.lastName,
        comment: survey.comment,
        studentId: survey.studentId,
        birthDate: survey.birthDate,
        checkList: survey.checkList.slice(0),
        babyTeeth: survey.babyTeeth.slice(0),
        permanentTeeth: survey.permanentTeeth.slice(0),
        signature: survey.signature.slice(0)
      }
      commit('addSurvey', newSurvey)
      commit('updateSurvey', cleanFullSurvey())
      return storage.saveSurvey(newSurvey)
    },
    loadSessions ({commit}) {
      storage.loadSessions().then(function (sessions) {
        sessions.map(function (session) {
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
    loadSites ({commit}) {
      storage.loadSites().then(sites => {
        commit('replaceSites', sites)
      }).catch(handleError(commit))
    },
    saveSites ({state, commit}) {
      return storage.saveSites(state.sites).catch(handleError(commit))
    },
    async getAuth ({commit, dispatch, state}) {
      let auth = state.auth
      if (!auth.refreshToken) {
        auth = await login(auth)
        commit('updateAuth', auth)
        dispatch('saveConfig')
      }
      auth = await getAccessToken(auth)
      commit('updateAuth', auth)
      dispatch('saveConfig')
      return auth
    },
    getSites ({dispatch, commit}) {
      dispatch('_getSites').catch(handleError(commit))
    },
    async _getSites ({commit, dispatch, state}) {
      let auth = await dispatch('getAuth')
      let response = null
      try {
        response = await access.getSites()
      } catch (error) {
        if (error.length &&
            error[0].errorCode &&
            error[0].errorCode == 'INVALID_SESSION_ID') {
          commit('clearAuthParams', ['accessToken'])
          auth = await dispatch('getAuth')
          response = await access.getSites()
        } else {
          throw error
        }
      }
      let sites = response.records.map(function (record) {
        return {
          id: record.Id,
          name: record.Name,
          owner: record.Owner ? record.Owner.Name : 'None',
          type: record.Type
        }
      })
      commit('replaceSites', {downloadDate: Date.now(), list: sites})
      dispatch('saveSites')
      return sites
    },
    setAlertWithTimeout({commit}, alertInfo){
      commit('setAlert', alertInfo)
      setTimeout(function(){
        commit('clearAlert')
      }, 3000)
    },
    exportSession ({state, commit}, {id, sessionUrl}) {
      try{
        let selectedSession = state.sessions.find(s => s.date == id)
        const files = dialog.showOpenDialog({
          title: 'Export Directory',
          properties: ['openDirectory', 'createDirectory']
        })
        if(!files){
          return Promise.reject(new Error('User canceled.'))
        }
        const exportPath = files[0]
        const outputRecords = selectedSession.surveys.map(function (survey) {
          const record = selectedSession.records.find(r => r.studentId == survey.studentId)
          return getOutputRecord(selectedSession.siteId, selectedSession.siteName, survey, record)
        })
        let csvPromise = storage.saveCSV(`${exportPath}/output.csv`, outputRecords)
        let pdfPromise = generatePDFs(exportPath, sessionUrl)
        return Promise.all([csvPromise, pdfPromise])
      } catch(error){
        return Promise.reject(error)
      }
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

store.dispatch('loadConfig')
store.dispatch('loadSites')
store.dispatch('loadSessions')
export default store
