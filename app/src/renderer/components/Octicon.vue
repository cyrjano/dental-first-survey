<template>
  <span v-html="icon"></span>
</template>

<script>
import octicons from 'octicons'
export default {
  props:{
    name:{type:String, required:true}
  },
  computed:{
    icon(){
      return octicons[this.name].toSVG({width:18})
    }
  }
}
</script>

<style>
.octicon {
  display: inline-block;
  fill: currentColor;
}
</style>
