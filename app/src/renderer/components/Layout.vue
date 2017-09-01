<template>
  <div>
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
    <b-navbar type="dark" toggleable="sm" variant="info">
      <b-nav-toggle target="nav_collapse"/>
      <a href='#' class="navbar-brand">DentalFirst</a>
      <b-collapse isNav id="nav_collapse">
        <b-nav isNavBar>
            <b-nav-item>
              <router-link class="text-white" to="/surveys">
                <octicon name="checklist"/><span class="p-2">Surveys</span>
              </router-link>
            </b-nav-item>
            <b-nav-item>
              <router-link class="text-white" to="/settings">
                <octicon name="gear"/><span class="pl-1">Settings</span>
              </router-link>
            </b-nav-item>
            <b-nav-item v-if="false">
              <router-link class="text-white" to="/verify">
                <octicon name="question"/><span class="pl-1">Help</span>
              </router-link>
            </b-nav-item>
        </b-nav>
      </b-collapse>
    </b-navbar>
    <div class="m-2 d-flex flex-column flex-grow">
      <d-title></d-title>
      <div class="flex-grow d-flex flex-column">
        <slot>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
  import TitleComponent from './TitleComponent.vue'
  export default {
    computed: {
      icon () {
        return {
          'success': 'check',
          'danger': 'stop',
          'info': 'info',
          'warning': 'megaphone'
        }[this.$store.state.alert.state]
      },
      alertType () {
        return this.$store.state.alert.state
      },
      alertMessage () {
        return this.$store.state.alert.message
      },
      showAlert () {
        return !!this.$store.state.alert.message
      }
    },
    methods: {
      dismiss () {
        this.$store.commit('clearAlert')
      }
    },
    components: {
      'd-title': TitleComponent
    }
  }
</script>
