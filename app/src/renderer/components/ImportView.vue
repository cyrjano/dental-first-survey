<template>
  <div class="d-flex flex-column">
    <b-alert state="danger" :show="showError">
      {{errorMessage}}
    </b-alert>
    <div class="d-flex flex-row justify-content-start">
      <div class="ml-auto">
        <b-button @click="signin">{{signInMessage}}</b-button>
      </div>
    </div>
    <div>
      <h2>Outreach</h2>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      errorMessage:''
    }
  },
  computed:{
    showError(){
      return !!this.errorMessage
    },
    signInMessage(){
      return !!this.$store.state.import.accessToken?'Sign Out':'Sign In'
    }
  },
  methods:{
    signin(){
      if(!this.$store.state.import.loggedIn){
        this.$store.dispatch('login').catch(error => this.errorMessage = error.message)
      }
    }
  }
}
</script>
