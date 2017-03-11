<template>
  <div class="bg-success text-white p-2">
    <h1>{{pageTitle}}</h1>
  </div>
</template>
<script>
export default {
  computed:{
    pageTitle(){
      return this.$route.meta.title
    }
  }
}
</script>
