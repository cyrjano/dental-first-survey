<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row justify-content-start">
      <div class="ml-auto">
        <b-button @click="signin">Load Data</b-button>
      </div>
    </div>
    <div>
      <h2>Outreach</h2>
    </div>
  </div>
</template>
<script>
export default {
  computed:{
  },
  methods:{
    signin(){
      let promise;
      if(this.$store.state.auth.accessToken){
        promise = Promise.resolve(this.$store.state.auth)
      } else {
        promise = this.$store.dispatch('login')
      }
      promise.then(function(auth){
        this.$store.dispatch('load')
      })
    }
  }
}
</script>
