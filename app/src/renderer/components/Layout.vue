<template>
  <div>
    <div class="fixed-bottom">
      <div :class="['alert',alertType]" v-show="showAlert">
        <button type="button"
                        class="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        @click.stop.prevent="dismiss"
          >
          <span aria-hidden="true">&times;</span>
        </button>
        <octicon :name="icon" />{{alertMessage}}
      </div>
    </div>
    <nav class="navbar navbar-expand-sm navbar-inverse navbar-dark bg-primary">
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#nav_collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a href='#' class="navbar-brand">DentalFirst</a>
      <div class="collapse navbar-collapse" id="nav_collapse">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item" v-show="hasActiveSession">
              <router-link class="text-white" to="/surveys">
                <octicon name="checklist"/><span class="p-2">Surveys</span>
              </router-link>
            </li>
            <li class="nav-item" v-show="hasActiveSession">
              <router-link class="text-white" to="/findstudent">
                <octicon name="search"/><span class="p-2">Find Student</span>
              </router-link>
            </li>
            <li class="nav-item" v-show="hasActiveSession">
              <router-link class="text-white" to="/editsurveys">
                <octicon name="pencil"/><span class="p-2">Edit Surveys</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="text-white" to="/settings">
                <octicon name="gear"/><span class="pl-1">Settings</span>
              </router-link>
            </li>
        </ul>
      </div>
    </nav>
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
      hasActiveSession () {
        return this.$store.state.activeSession >= 0
      },
      icon () {
        return {
          'success': 'check',
          'danger': 'stop',
          'info': 'info',
          'warning': 'megaphone'
        }[this.$store.state.alert.state]
      },
      alertType () {
        return 'alert-' + this.$store.state.alert.state
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
