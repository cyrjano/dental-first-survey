<template>
  <div class="bg-success text-white p-2">
    <h3>{{pageTitle}}</h3>
  </div>
</template>
<script>
export default {
  computed: {
    pageTitle () {
      return this.$route.meta.title
    }
  }
}
</script>
