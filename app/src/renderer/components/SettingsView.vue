<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-row justify-content-end" style="min-height:40px">
      <div v-if="show" class="flex-grow">
        <span>Download Date:{{date}},</span>
        <span>Number of Sites:{{numberSites}}</span>
      </div>
      <b-button @click="updateSites">Update Sites</b-button>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    date (){
      return new Date(this.$store.state.sites.downloadDate).toDateString()
    },
    show () {
      return this.$store.state.sites.list.length > 0
    },
    numberSites () {
      return this.$store.state.sites.list.length
    }
  },
  methods: {
    updateSites () {
      this.$store.dispatch('getSites', {retry: true})
    }
  }
}
</script>
<style>
.scrollable{
  overflow:scroll;
}
</style>
