<template>
  <div class="container">
    <view-survey :siteName="siteName" :for-print="true" :survey="survey"></view-survey>
  </div>
</template>
<script>
import ViewSurvey from './ViewSurvey'
export default {
  mounted () {
    console.log('Mounting Printer')
    require('electron').ipcRenderer.on('status', (event, message) => {
      console.log(`status:${message}`)
      if (this.index < this.session.surveySummaries.length - 1) {
        this.index = this.index + 1
        console.log(`index:${this.index}`)
      } else {
        console.log('finished')
        document.title = 'finish'
      }
    })
  },
  data () {
    return {
      index: 0
    }
  },
  computed: {
    session () {
      if (!this.$store.state.loaded) {
        return null
      }
      let session = this.$store.state.sessions.find(
        session => session.date == parseInt(this.$route.params.session)
      )
      return session
    },
    survey () {
      if (!this.$store.state.loaded) {
        return {
          grade: '',
          room: '',
          teacher: '',
          firstName: '',
          lastName: '',
          studentId: '',
          birthDate: '',
          checkList: [],
          babyTeeth: [],
          permanentTeeth: [],
          signature: [],
          date: 0
        }
      }
      this.$nextTick(function () {
        console.log(`Index: ${this.index}`)
        let prioritySet = new Set(this.survey.checkList.map(c => parseInt(c[0])))
        const followUp = (prioritySet.has(2) || prioritySet.has(3)) ? 'y' : 'n'
        document.title = `print:${followUp}:${this.survey.studentId}.${new Date(this.survey.date).toISOString().split('T')[0]}.pdf`
      })
      this.$store.commit('loadSurvey', {session: this.session.date, index: this.index})
      return this.$store.state.survey
    },
    siteName () {
      if (!this.$store.state.loaded) {
        return 'NOT LOADED'
      }
      return this.session.siteName
    }
  },
  components: {
    'view-survey': ViewSurvey
  }
}
</script>
