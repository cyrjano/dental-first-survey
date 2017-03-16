import electron from 'electron'

let app = electron.remote.app
const configPath = app.getPath('documents') +'/sjsu_survey/settings'
export  {configPath}
