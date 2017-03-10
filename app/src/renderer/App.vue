<template>
  <div id="#app">
    <b-navbar type="inverse" variant="inverse" class="text-white">
      <router-link class="navbar-brand" to="/">
        <octicon class="align-bottom" name="home"/><span class="p-2">Home</span>
      </router-link>
      <router-link class="mt-sm-2 navbar-toggler-right text-white" to="/">
        <octicon class="" name="gear"/>
      </router-link>
    </b-navbar>
    <div class="d-flex p-2">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import octicon from './components/Octicon.vue'
  import store from 'renderer/vuex/store'
  export default {
    store
  }
</script>

<style>
#app{
}

</style>
