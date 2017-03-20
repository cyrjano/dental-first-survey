<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row justify-content-start">
      <div class="ml-auto">
        <b-button @click="showSites">Show Sites</b-button>
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
    showSites(){
      this.$store.dispatch('getSites', {retry:true}).then((sites)=>console.log(sites))
    }
  }
}
</script>
