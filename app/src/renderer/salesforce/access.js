import {DataService} from 'forcejs'
const GET_SITES_QUERY = "SELECT Account.name, Account.ID, Account.type, Account.owner.name from Account where Account.RecordType.Name='School Sites'"
export default {
  init (auth) {
    console.log(`Init Token:${auth.accessToken}`)
    DataService.createInstance(auth)
    DataService.getInstance().useProxy = false
  },
  refreshAccessToken () {
    let service = DataService.getInstance()
    return service.refreshAccessToken().then(function () {
      console.log(`Refreshed Token:${service.accessToken}`)
      return service.accessToken
    })
  },
  getSites () {
    let service = DataService.getInstance()
    console.log(`GettingSites:${service.accessToken}`)
    return service.query(GET_SITES_QUERY)
  }
}
