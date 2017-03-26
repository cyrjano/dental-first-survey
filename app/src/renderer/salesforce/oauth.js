'use strict'
import electron from 'electron'
const BrowserWindow = electron.BrowserWindow || electron.remote.BrowserWindow
let instanceCounter = 0

// if page URL is http://localhost:3000/myapp/index.html, context is /myapp
let context = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'))

// if page URL is http://localhost:3000/myapp/index.html, serverURL is http://localhost:3000
let serverURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')

// if page URL is http://localhost:3000/myapp/index.html, baseURL is http://localhost:3000/myapp
let baseURL = serverURL + context

let getQueryStringAsObject = url => {
  let obj = {}
  let index = url.indexOf('#')
  if (index > -1) {
    let queryString = decodeURIComponent(url.substr(index + 1))
    let params = queryString.split('&')
    params.forEach(param => {
      let splitter = param.split('=')
      obj[splitter[0]] = splitter[1]
    })
  }
  return obj
}

class OAuth {

  constructor ({appId, loginURL, oauthCallbackURL}) {
    instanceCounter = instanceCounter + 1
    this.instanceId = instanceCounter
    this.appId = appId || '3MVG9fMtCkV6eLheIEZplMqWfnGlf3Y.BcWdOf1qytXo9zxgbsrUbS.ExHTgUPJeb3jZeT8NYhc.hMyznKU92'
    this.loginURL = loginURL || 'https://login.salesforce.com'
    this.oauthCallbackURL = oauthCallbackURL || baseURL + '/oauthcallback.html'
  }

  login () {
  }

}

class OAuthElectron extends OAuth {

  login () {
    return new Promise((resolve, reject) => {
      console.log('loginURL: ' + this.loginURL)
      console.log('oauthCallbackURL: ' + this.oauthCallbackURL)

      let onCallback = (url) => {
        const oauthResult = getQueryStringAsObject(url)
        if (oauthResult.state == this.instanceId) {
          if (oauthResult.access_token) {
            resolve({
              appId: this.appId,
              accessToken: oauthResult.access_token,
              instanceURL: oauthResult.instance_url,
              refreshToken: oauthResult.refresh_token,
              userId: oauthResult.id.split('/').pop()
            })
            authWindow.removeAllListeners('closed')
            setImmediate(function () {
              authWindow.close()
            })
          } else {
            reject(oauthResult)
            authWindow.removeAllListeners('closed')
            setImmediate(function () {
              authWindow.close()
            })
          }
        }
      }

      const loginWindowURL = this.loginURL + `/services/oauth2/authorize?client_id=${this.appId}&redirect_uri=${this.oauthCallbackURL}&response_type=token&state=${this.instanceId}`
      const authWindow = new BrowserWindow({'use-content-size': true})
      authWindow.loadURL(loginWindowURL)
      authWindow.show()
      authWindow.on('closed', () => {
        reject(new Error('window was closed by user'))
      })
      authWindow.webContents.on('will-navigate', (event, url) => {
        onCallback(url)
      })
      authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
        onCallback(newUrl)
      })
    })
  }
}

export default OAuthElectron
