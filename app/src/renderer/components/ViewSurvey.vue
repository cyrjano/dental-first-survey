<template>
<div style="d-flex column">
  <h1>Healthier Kids Foundation Santa Clara County</h1>
  <div class="py-4">
    Your child received a free dental screening. This screening consists of
    visual exam performed by a licensed dental profesional./ Su ni&ntilde;o
    recibi&oacute; un examen de detecci&oacute;n dental gratuita. Este examen
    de detecci&oacute;n consist&iacute;a en un examen visual realizado por un
    profesional licenciado en odontolog&iacute;a.
  </div>
  <div class="p-2">
    <h5>{{schoolName}} Grade:{{survey.grade}} Room: {{survey.room}} {{survey.teacher}}</h5>
    <h5>Child's Name/ Nombre del Ni&ntilde;o: {{survey.firstName}} {{survey.lastName}} {{survey.studentId}}</h5>
    <h5>Date Of Birth/ Fecha de Nacimiento: {{survey.birthDate}}</h5>
  </div>
  <div class="p-1" v-for="checkLevel of checkLevels" v-show="showLevel(checkLevel)">
    <dl>
      <dt>{{checkLevel.index}}. {{checkLevel.title}}</dt>
      <dd v-for="option of checkLevel.options" v-show="showOption(option.value)">{{option.letter}}. {{option.text}}</dd>
    </dl>
  </div>
</div>
</template>
<script>
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
  }
}
</script>
