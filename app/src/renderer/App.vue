<template>
  <div id="app">
    <img class="preload" src="./assets/logo.jpg">
    <img class="preload" src="./assets/permanent_teeth.jpg">
    <img class="preload" src="./assets/primary_teeth.jpg">
    <router-view></router-view>
  </div>
</template>
<script>
  import store from 'renderer/vuex/store'
  export default {
    store
  }
</script>

<style>
#app{
  display:flex;
  flex-direction:column;
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
}
.flex-grow{
  flex:1
}
img.preload {
  display:none;
}
</style>
