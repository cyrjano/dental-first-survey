import {DataService} from 'forcejs'
const GET_SITES_QUERY = "SELECT Account.name, Account.ID, Account.type, Account.owner.name from Account where Account.RecordType.Name='School Sites'"

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
  },
  getLeads(id) {
    let service = DataService.getInstance()
    console.log(`Downloading Site:${site}`)
    return service.query(siteQuery(id))
  }
}
