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
      return octicons[this.name].toSVG()
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
