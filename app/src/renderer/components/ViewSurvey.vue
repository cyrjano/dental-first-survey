<template>
<div class="m-4">
  <div>
  <h3 class="page-title">Healthier Kids Foundation Santa Clara County</h3>
  </div>
  <div class="py-4">
    Your child received a free dental screening. This screening consists of
    visual exam performed by a licensed dental profesional./ Su ni&ntilde;o
    recibi&oacute; un examen de detecci&oacute;n dental gratuita. Este examen
    de detecci&oacute;n consist&iacute;a en un examen visual realizado por un
    profesional licenciado en odontolog&iacute;a.
  </div>
  <div class="p-2">
    <strong>{{schoolName}} Grade:{{survey.grade}} Room: {{survey.room}} {{survey.teacher}}</strong>
    <strong>Child's Name/ Nombre del Ni&ntilde;o: {{survey.firstName}} {{survey.lastName}} {{survey.studentId}}</strong>
    <strong>Date Of Birth/ Fecha de Nacimiento: {{survey.birthDate}}</strong>
  </div>
  <div class="p-1" v-for="checkLevel of checkLevels" v-show="showLevel(checkLevel)">
    <dl>
      <dt>{{checkLevel.index}}. {{checkLevel.title}}</dt>
      <dd v-for="option of checkLevel.options" v-show="showOption(option.value)">{{option.letter}}. {{option.text}}</dd>
    </dl>
  </div>
  <div>
    <Drawing  :lines="survey.babyTeeth" :src="survey.babyTeethUrl" :width="230" :height="300"/>
    <Drawing  :lines="survey.permanentTeeth" :src="survey.permanentTeethUrl" :width="230" :height="300"/>
  </div>
</div>
</template>
<script>
import Drawing from './Drawing'
export default{
  computed:{
    schoolName(){
      return this.$store.state.sessions.find(
        session=>session.date == this.$store.state.activeSession
      ).siteName
    },
    survey(){
      return this.$store.state.survey
    },
    checkLevels(){
      return this.$store.state.checkLevels
    }
  },
  methods:{
    showLevel(checkLevel){
      for(const option of checkLevel.options){
        if(this.showOption(option.value)){
          return true
        }
      }
      return false
    },
    showOption(value){
      return this.survey.checkList.indexOf(value) >= 0
    }
  },
  components:{
    Drawing
  }
}
</script>
<style>
.page-title{
  text-align:center
}
</style>
