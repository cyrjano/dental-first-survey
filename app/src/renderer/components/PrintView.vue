<template>
  <div class="container">
    <view-survey :siteName="siteName" :show-signature="true" :survey="survey"></view-survey>
  </div>
</template>
<script>
import ViewSurvey from './ViewSurvey'
export default {
  computed:{
    survey(){
      if(!this.$store.state.loaded){
        return {
          grade:'',
          room:'',
          teacher:'',
          firstName:'',
          lastName:'',
          studentId:'',
          birthDate:'',
          checkList:[],
          babyTeeth:[],
          permanentTeeth:[],
          signature:[]
        }
      }
      const surveyId = this.$route.params.survey
      setTimeout(function(){document.title = `print:${surveyId}`}, 500)
      const session = this.$store.state.sessions.find(s=>s.date===parseInt(this.$route.params.session))
      return session.surveys.find(s=>s.date===parseInt(this.$route.params.survey))
    },
    siteName(){
      if(!this.$store.state.loaded){
        return 'NOT LOADED'
      }
      let session = this.$store.state.sessions.find(
        session=>session.date ==parseInt(this.$route.params.session)
      )
      return session.siteName
    },
  },
  components:{
    'view-survey':ViewSurvey
  }
}
</script>
