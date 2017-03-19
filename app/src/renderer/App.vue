<template>
  <div id="app">
    <div class="fixed-bottom">
      <b-alert :state="alertType" :show="showAlert">
        <button type="button"
                        class="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        @click.stop.prevent="dismiss"
          >
          <span aria-hidden="true">&times;</span>
        </button>
        <octicon :name="icon" />{{alertMessage}}

      </b-alert>
    </div>
    <b-navbar type="inverse" variant="inverse" class="text-white navbar-toggleable-sm">
      <b-nav-toggle target="nav_collapse"/>
      <a href='#' class="navbar-brand">Dental First</a>
      <b-collapse isNav id="nav_collapse">
        <b-nav isNavBar>
            <b-nav-item>
              <router-link class="text-white" to="/">
                <octicon name="checklist"/><span class="p-2">Sessions</span>
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link class="text-white" to="/import">
                <octicon name="cloud-download"/><span class="pl-1">Import</span>
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link class="text-white" to="/sfdata">
                <octicon name="file-directory"/><span class="pl-1">Stored</span>
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link class="text-white" to="/help">
                <octicon name="question"/><span class="pl-1">Help</span>
              </router-link>
            </b-nav-item>
        </b-nav>
      </b-collapse>
    </b-navbar>
    <div class="m-2 d-flex flex-column flex-grow">
      <d-title></d-title>
      <div class="flex-grow d-flex flex-column">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import store from 'renderer/vuex/store'
  import TitleComponent from './components/TitleComponent.vue'
  export default {
    store,
    computed:{
      icon(){
        return {
          'success':'check',
          'danger':'stop',
          'info':'info',
          'warning':'megaphone'
        }[this.$store.state.alert.state]
      },
      alertType(){
        return this.$store.state.alert.state
      },
      alertMessage(){
        return this.$store.state.alert.message
      },
      showAlert(){
        return !!this.$store.state.alert.message
      },
    },
    methods:{
      dismiss(){
        this.$store.commit('clearAlert')
      }
    },
    components:{
      'd-title':TitleComponent
    }
  }
</script>

<style>
#app{
  display:flex;
  flex-direction:column;
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
}
.flex-grow{
  flex:1
}
</style>
