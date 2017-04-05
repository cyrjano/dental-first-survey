<template>
  <layout>
    <div class="d-flex flex-column">
      <div class="d-flex flex-row justify-content-end" style="min-height:40px">
        <div v-if="show" class="flex-grow">
          <span>Download Date:{{date}},</span>
          <span>Number of Sites:{{numberSites}}</span>
        </div>
        <b-button @click="updateSites" :disabled="loading">
          <span v-show="!loading">Update Sites</span>
          <spinner v-show="loading"></spinner>
        </b-button>
      </div>
    </div>
  </layout>
</template>
<script>
import Layout from './Layout'
import Spinner from './Spinner'

export default {
  data () {
    return {
      loading: false
    }
  },
  computed: {
    date () {
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
      this.loading = true
      this.$store.dispatch('getSites', {retry: true}).then(() => {
        this.loading = false
        this.$store.commit('setAlert', {state: 'success', message: 'Sites Loaded...'})
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
.scrollable{
  overflow:scroll;
}
</style>
