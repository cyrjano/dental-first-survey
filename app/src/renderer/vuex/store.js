import Vue from 'vue'
import Vuex from 'vuex'
import {remote} from 'electron'
let jsforce = remote.require('jsforce')

Vue.use(Vuex)


let conn = new jsforce.Connection();

export default new Vuex.Store({
  state:{
    sessions:[],
    selectedSession: null,
    import:{
      loggedIn:false,
      instanceUrl:null,
      accessToken:null,
      email:'',
      password:'',
      show:false
    }
  },
  mutations:{
    showModal(state, payload){
      state.import.show=payload.show
    },
    updateEmail(state, {email}){
      state.import.email = email
    },
    updatePassword(state, {password}){
      state.import.password = password
    },
    updateToken(state, {accessToken,instanceUrl}){
      state.import.accessToken = accessToken
      state.import.instanceUrl = instanceUrl
      console.log(state.import)
    }
  },
  actions:{
    openLoginDialog({commit}){
      commit('showModal',{show:true})
    },
    closeLoginDialog({commit}){
      commit('showModal',{show:false})
    },
    login({state, commit}){
      if(!state.import.email){
        return Promise.reject('Email required')
      }
      if(!state.import.password){
        return Promise.reject('Password required')
      }
      return conn.login(state.import.email, state.import.password).then(function(userInfo){
        commit.UpdateToken({accessToken:conn.accessToken,instanceUrl:conn.intanceUrl})
        console.dir(userInfo)
      }).catch(function(err){
        return Promise.reject(err.message)
      })
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
