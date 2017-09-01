<template>
  <layout>
    <div class="d-flex flex-column">
      <div class="start">
        <div :class="['dropdown', filter?'show':'']">
          <form class="">
            <input v-model="filter" data-toggle="dropdown" type="text" class="form-control" placeholder="Search..." autocomplete="off">
          </form>
          <div id="sitesDropdown" class="dropdown-menu">
            <a v-for="item of siteOptions" class="dropdown-item" @click="selectSite(item)" href="#">{{item.name}}</a>
          </div>
        </div>
        <div v-show="selectedSite">
          <input type="file" ref="rosterFile" @change="selectFile"></input>
        </div>
        <div class="p-2" v-show="selectedSite">
          <strong>Selected Site:</strong> {{selectedSite}}  <span class="badge badge-warning">{{selectedFile.length}}</span>
        </div>
        <bButton :disabled="siteSelected" class="btn-sm" @click="newSession">
          <octicon name="mortar-board"/>New Session
        </bButton>
      </div>
      <div class="active-session" v-show="activeSession.siteName">
        <h4>
          {{activeSession.siteName}}
          <span class="badge badge-primary">{{activeSession.surveysLength}}</span>
          <span class="badge badge-warning">{{activeSession.recordsLength}}</span>
        </h4>
        <div>
          <strong>Date:</strong>{{new Date(activeSession.date).toDateString()}}
        </div>
        <bButton style="width:100px" class="btn-sm" :disabled="loading" @click="exportSession">
          <span v-show="!loading"><octicon name="cloud-download"/> Export</span>
          <spinner v-show="loading"></spinner>
        </bButton>
      </div>
      <div v-show="sessions.length">
        <h5>Stored Sessions</h5>
        <div v-for="item of sessions">
          <bButton style="width:100px" @click="activateSession(item)" :class="[(activeSession.date === item.date)?'disabled':'',(activeSession.date === item.date)?'btn-secondary':'','btn-sm']">
            {{(activeSession.date === item.date)?'Active':'Activate'}}
          </bButton>
          <span>
            {{item.siteName}}
            <span class="badge badge-primary">{{item.surveysLength}}</span>
            <span class="badge badge-warning">{{item.recordsLength}}</span>
          </span>
          ({{new Date(item.date).toDateString()}})
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
  import Layout from './Layout'
  import Spinner from './Spinner'
  import electron from 'electron'
  import fs from 'fs'
  const BrowserWindow = electron.remote.BrowserWindow

  export default {
    data () {
      return {
        filter: '',
        loading: false
      }
    },
    computed: {
      selectedFile () {
        return this.$store.state.newSession.selectedFile
      },
      siteOptions () {
        var filteredList = this.$store.state.sites.list.filter(
          item => item.name.toLowerCase().indexOf(this.filter.toLowerCase()) >= 0
        )
        return filteredList.slice(0, 10)
      },
      siteSelected () {
        return !this.$store.state.newSession.selectedItem
      },
      selectedSite () {
        if (this.$store.state.newSession.selectedItem) {
          return this.$store.state.newSession.selectedItem.name
        } else {
          return ''
        }
      },
      activeSession () {
        const activeDate = this.$store.state.activeSession
        if (activeDate > 0) {
          return this.$store.state.sessions.find(s => s.date === activeDate)
        }
        return {
          siteName: '',
          surveys: [],
          records: [],
          date: -1
        }
      },
      sessions () {
        return this.$store.state.sessions
      }
    },
    methods: {
      selectFile (ev) {
        if (ev.target.files.length === 1) {
          this.$store.dispatch('selectFile', ev.target.files[0])
        }
        this.$refs.rosterFile.value = ''
      },
      selectSite (item) {
        this.filter = ''
        this.$store.commit('selectSite', item)
      },
      newSession () {
        this.$store.dispatch('newSession')
      },
      activateSession (item) {
        this.$store.dispatch('activateSession', {id: item.date})
      },
      exportSession () {
        let routeInfo = this.$router.resolve({
          name: 'print',
          params: {session: this.$store.state.activeSession}
        })
        this.loading = true
        const sessionUrl = `${window.location.origin}${window.location.pathname}${routeInfo.href}`
        this.$store.dispatch('exportSession',
          {id: this.$store.state.activeSession, sessionUrl: sessionUrl}
        ).then(() => {
          this.loading = false
          this.$store.commit('setAlert', {state: 'success', message: 'Finish exporting all files.'})
        }).catch(error => {
          this.loading = false
          this.$store.commit('setAlert', {state: 'danger', message: error.message})
        })
      }
    },
    components: {
      layout: Layout,
      spinner: Spinner
    }
  }
</script>

<style>
.start{
  background-color:rgb(230,230,255)
}
.active-session{
  background-color:rgb(255,255,180)
}
</style>
