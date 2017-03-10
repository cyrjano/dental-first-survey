<template>
  <div class='m-2 d-flex flex-column'>
    <div class="header">
      <h1>Sessions</h1>
    </div>
    <div>
      <bButton class="btn-block" @click="addSession"><octicon name="mortar-board"/>New Session</bButton>
      <router-view></router-view>
    </div>
    <div>

    </div>
  </div>
</template>
<script>
  export default {
    methods:{
      addSession(){
        this.$router.push('/sessions/add')
      }
    }
  }
</script>

<style>
</style>
