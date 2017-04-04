<template>
  <div class="container">
    <view-survey :siteName="siteName" :show-signature="true" :survey="survey"></view-survey>
  </div>
</template>
<script>
import ViewSurvey from './ViewSurvey'
export default {
  mounted(){
    console.log('Mounting Printer')
    require('electron').ipcRenderer.on('status', (event, message) => {
      console.log(`status:${message}`)
      console.log(`Surveys:${this.surveys.length}`)
      if(this.index < this.surveys.length - 1){
        this.index = this.index + 1
        console.log(`index:${this.index}`)
      } else {
        console.log('finished')
        document.title = 'finish'
      }
    })
  },
  data(){
    return {
      index:0
    }
  },
  computed:{
    surveys(){
      if(!this.$store.state.loaded){
        return null
      }
      return this.session.surveys
    },
    session(){
      if(!this.$store.state.loaded){
        return null
      }
      let session = this.$store.state.sessions.find(
        session=>session.date ==parseInt(this.$route.params.session)
      )

      return session
    },
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
      this.$nextTick(function(){
        console.log(`Index: ${this.index}`)
        document.title = `print:${this.survey.studentId}.${new Date(this.survey.date).toISOString().split('T')[0]}.pdf`
      })
      return this.session.surveys[this.index]
    },
    siteName(){
      if(!this.$store.state.loaded){
        return 'NOT LOADED'
      }
      return this.session.siteName
    },
  },
  components:{
    'view-survey':ViewSurvey
  }
}
</script>
