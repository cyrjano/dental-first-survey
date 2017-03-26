import {DataService} from 'forcejs'

let siteQuery = id => `SELECT FROM `
export default {
  init(auth) {
    console.log(`Init Token:${auth.accessToken}`)
    DataService.createInstance(auth)
    DataService.getInstance().useProxy = false
  },
  refreshAccessToken() {
    let service = DataService.getInstance()
    return service.refreshAccessToken().then(function () {
      console.log('Refreshed Token...')
      return service.accessToken
    })
  },
  getSites() {
    let service = DataService.getInstance()
    console.log('Getting Sites...')
    return service.query(GET_SITES_QUERY)
  }
}
