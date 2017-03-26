<template>
    <div>
      <bButton class="btn-block" @click="addSession">
        <octicon name="mortar-board"/>New Session</bButton>
      <router-view></router-view>
    </div>
</template>
<script>
  export default {
    methods: {
      addSession () {
        this.$router.push('/sessions/add')
      }
    },
  }
</script>

<style>
</style>
