<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row justify-content-start">
      <div class="ml-auto">
        <b-button @click="signin">Sign In</b-button>
      </div>
    </div>
    <div>
      <h2>Outreach</h2>
      <d-login-dialog/>
    </div>
  </div>
</template>
<script>
import LoginDialog from './LoginDialog'

export default {
  computed:{
    signInMessage(){
      return this.$store.state.import.loggedIn?'Sign Out':'Sign In'
    }
  },
  methods:{
    signin(){
      if(!this.$store.state.import.loggedIn){
        this.$store.dispatch('openLoginDialog')
      }
    }
  },
  components:{
    'd-login-dialog':LoginDialog
  }
}
</script>
