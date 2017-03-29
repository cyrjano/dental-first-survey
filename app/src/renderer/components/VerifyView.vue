<template>
<div class="p-4">
<ViewSurvey></ViewSurvey>
<div>
  <Sketch :width="300" :height="140" :lines="signatureLines" @line="addSignatureLine" @clear="clearSignature"></Sketch>
</div>
<div>
  <button class="btn btn-primary" @click.prevent="accept">Accept</button>
  <button class="btn btn-default" @click.prevent="edit">Edit</button>
</div>
</div>
</template>
<script>
import ViewSurvey from './ViewSurvey'
import Sketch from './Sketch'
export default {
  computed:{
    signatureLines(){
      return this.$store.state.survey.signature
    }
  },
  methods:{
    addSignatureLine(ev){
      this.$store.commit('addLine', {signature:ev})
    },
    clearSignature(){
      this.$store.commit('updateSurvey', {signature:[]})
    }
  },
  components:{
    ViewSurvey,
    Sketch
  }
}
</script>
