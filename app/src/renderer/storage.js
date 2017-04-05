import electron from 'electron'
import fs from 'fs'
import ya from 'ya-storage'
import mkdirp from 'mkdirp'
import papa from 'papaparse'
let app = electron.remote.app
const appPath = `${app.getPath('documents')}/sjsu_survey`
const settingsPath = `${appPath}/settings`
const configPath = `${settingsPath}/oauth`
const sitesPath = `${settingsPath}/sites`
const sessionsPath = `${appPath}/sessions`
const surveysPath = `${appPath}/surveys`

function getFiles (path) {
  mkdirp.sync(path)
  return new Promise(function (resolve, reject) {
    console.log(`Reading files from path:${path}`)
    fs.readdir(path, function (err, files) {
      if (err) {
        reject(err)
      } else {
        var files = files.filter(file => file.endsWith('.json'))
        console.log(`List of files@${path}`)
        resolve(files)
      }
    })
  })
}

export default {
  loadConfig () {
    console.log('Loading oauth config...')
    return ya.get(configPath).catch(err => {
      if (err.message.indexOf('exist') < 0) {
        throw err
      }
      return {
        'appId': '3MVG9A2kN3Bn17htcA472YRO55FhbeaCeGOYSKqUKQnYzNl2wroOB3Et8r8s1EjisJvoCcMW9wqICNyjJ4SaS',
        'oauthCallbackURL': 'http://localhost/salesforce/login'
      }
    })
  },
  saveConfig (config) {
    console.log('Saving oath config...')
    return ya.set(configPath, config)
  },
  loadSites () {
    console.log('Saving list of sites...')
    return ya.get(sitesPath).catch(err => {
      if (err.message.indexOf('exist') < 0) {
        throw err
      }
      return {downloadDate: null, list: []}
    })
  },
  saveSites (sites) {
    console.log('Saving list of sites...')
    return ya.set(sitesPath, sites)
  },
  loadSessions () {
    console.log('Retrieving list of sessions')
    let sessionsPromise = getFiles(sessionsPath).then(function (sessionFiles) {
      console.log(`Received list of sessions ${sessionFiles}`)
      const sessionPromises = sessionFiles.map(function (sessionFile) {
        return ya.get(`${sessionsPath}/${sessionFile}`)
      }
      )
      return Promise.all(sessionPromises)
    }).then(function (sessions) {
      console.log('Sorting session')
      sessions.sort((a, b) => b.date - a.date)
      return sessions
    })
    let surveysPromise = getFiles(surveysPath).then(function (surveyFiles) {
      console.log(`Received list of surveys ${surveyFiles}`)
      const surveyPromises = surveyFiles.map(function (surveyFile) {
        return ya.get(`${surveysPath}/${surveyFile}`)
      }
      )
      return Promise.all(surveyPromises)
    })
    return Promise.all([sessionsPromise, surveysPromise]).then(function (results) {
      console.log('Assigning surveys')
      let sessions = results[0]
      let surveys = results[1]
      for (const survey of surveys) {
        let session = sessions.find(s => survey.sessionId === s.date)
        session.surveys.push(survey)
      }
      return sessions
    })
  },
  saveSession (session) {
    if (!session) {
      return Promise.reject(new Error('No session passed.'))
    }
    console.log(`Saving session ${new Date(session.date)}`)
    return ya.set(`${sessionsPath}/${session.date}`, session)
  },
  saveSurvey (survey) {
    if (!survey) {
      return Promise.reject(new Error('No survey received.'))
    }
    console.log(`Saving survey ${new Date(survey.date)}`)
    return ya.set(`${surveysPath}/${survey.sessionId}.${survey.date}`, survey)
  },
  savePDF (path, name, contents) {
    const pdfPath = `${path}/pdfs`
    mkdirp.sync(pdfPath)
    return new Promise(function (resolve, reject) {
      fs.writeFile(`${pdfPath}/${name}`, contents, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  },
  saveCSV (path, records) {
    return new Promise(function (resolve, reject) {
      const contents = papa.unparse(records)
      fs.writeFile(path, contents, function (err) {
        if (err) {
          reject(err)
        }
        resolve()
      })
    })
  }
}
