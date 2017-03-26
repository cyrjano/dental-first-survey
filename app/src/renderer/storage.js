import electron from 'electron'
import fs from 'fs'
import ya from 'ya-storage'
import mkdirp from 'mkdirp'
let app = electron.remote.app
const appPath = `${app.getPath('documents')}/sjsu_survey`
const settingsPath = `${appPath}/settings`
const configPath = `${settingsPath}/oauth`
const sitesPath = `${settingsPath}/sites`
const sessionsPath =`${appPath}/sessions`

export default {
  loadConfig(){
    console.log('Loading oauth config...')
    return ya.get(configPath)
  },
  saveConfig(config){
    console.log('Saving oath config...')
    return ya.set(configPath, config)
  },
  loadSites(){
    console.log('Saving list of sites...')
    return ya.get(sitesPath).catch(err=>{
      if(err.message.indexOf('exist') < 0){
        throw err;
      }
      return {downloadDate:null, list:[]}
    })
  },
  saveSites(sites){
    console.log('Saving list of sites...')
    return ya.set(sitesPath, sites)
  },
  loadSessions(){
    mkdirp.sync(sessionsPath)
    let filePromises = new Promise(function(resolve, reject){
      fs.readdir(sessionsPath, function(err, files){
        if(err){
          reject(err)
        } else {
          var sessionFiles = files.filter(file => file.endsWith('.json'))
          resolve(sessionFiles)
        }
      });
    })
    console.log('Retrieving List of sessions')
    return filePromises.then(function(sessionFiles){
      const sessionPromises = sessionFiles.map(
        sessionFile => ya.get(`${sessionsPath}/${sessionFile}`)
      )
      return Promise.all(sessionPromises)
    })
  },
  saveSession(session){
    if(!session){
      return Promise.reject(new Error('No session passed.'))
    }
    console.log(`Saving session ${new Date(session.date)}`)
    return ya.set(`${sessionsPath}/${session.date}`, session)
  }
}
