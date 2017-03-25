<template>
    <div>
      <bButton class="btn-block" @click="addSession">
        <octicon name="mortar-board"/>New Session</bButton>
      <router-view></router-view>
      <SketchComponent></SketchComponent>
    </div>
</template>
<script>
  import SketchComponent from './SketchComponent'
  export default {
    methods: {
      addSession () {
        this.$router.push('/sessions/add')
      }
    },
    components:{
      SketchComponent
    }
  }
</script>

<style>
</style>
