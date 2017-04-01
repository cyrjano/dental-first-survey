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
  <div class="p-1">
    <div>
      <strong>{{siteName}} Grade:{{survey.grade}} Room: {{survey.room}} {{survey.teacher}}</strong>
    </div>
    <div>
      <strong>Child's Name/ Nombre del Ni&ntilde;o: {{survey.firstName}} {{survey.lastName}} {{survey.studentId}}</strong>
    </div>
    <div>
      <strong>Date Of Birth/ Fecha de Nacimiento: {{survey.birthDate}}</strong>
    </div>
  </div>
  <div v-for="checkLevel of checkLevels" v-show="showLevel(checkLevel)">
    <dl>
      <dt>{{checkLevel.index}}. {{checkLevel.title}}</dt>
      <dd v-for="option of checkLevel.options" v-show="showOption(option.value)">{{option.letter}}. {{option.text}}</dd>
    </dl>
  </div>
  <div>
    <Drawing  :lines="survey.babyTeeth" :src="babyTeethUrl" :width="230" :height="300"/>
    <Drawing  :lines="survey.permanentTeeth" :src="permanentTeethUrl" :width="230" :height="300"/>
  </div>
  <div v-show="showSignature">
    <Drawing class="decorated" :width="300" :height="140" :lines="survey.signature"/>
  </div>
  <div class="date">
    {{formatDate(survey.date)}}
  </div>
</div>
</template>
<script>
import Drawing from './Drawing'
export default{
  props:{
    survey:{type:Object},
    siteName:{type:String},
    showSignature:{type:Boolean, default:false},
  },
  computed:{
    babyTeethUrl(){
      return this.$store.state.survey.babyTeethUrl
    },
    permanentTeethUrl(){
      return this.$store.state.survey.permanentTeethUrl
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
    },
    formatDate(value){
      return new Date(value).toDateString()
    }
  },
  components:{
    Drawing
  }
}
</script>
<style>
.page-title{
  text-align:center;
}
.date{
  font-size:12px;
  margin-left:200px;
}
</style>
