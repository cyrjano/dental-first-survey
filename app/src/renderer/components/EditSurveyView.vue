<template>
  <layout>
      <div class="d-flex flex-column">
        <modal ref="deleteModal" title="Delete Survey">
          <p>Are you sure you want to remove this survey?</p>
        </modal>
        <div>
          <table class="table">
            <thead>
              <tr>
                <th>Student Id</th>
                <th>Name</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="survey in surveySummaries">
                <td>{{survey.studentId}}</td>
                <td>{{survey.name}}</td>
                <td>
                  <button class="btn btn-primary" @click="editSurvey(survey)"><octicon name="pencil"/>Edit</button>
                  &nbsp;
                  <button class="btn btn-danger" @click="deleteSurvey(survey)"><octicon name="trashcan"/>Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </layout>
</template>
<script>
import Layout from './Layout'
import DeleteModal from './DeleteModal'

export default {
  components: {
    layout: Layout,
    modal: DeleteModal
  },
  computed:{
    surveySummaries () {
      return this.$store.state.sessions.find(session => this.$store.state.activeSession == session.date).surveySummaries
    }
  },
  methods:{
    editSurvey(item){
      this.$store.dispatch('editSurvey', {surveyId:item.date})
      this.$router.push('/surveys')
    },
    async deleteSurvey(item){
      const result = await this.$refs.deleteModal.show()
      try{
        if(result){
          await this.$store.dispatch('deleteSurvey',{
              sessionId:this.$store.state.activeSession,
              surveyId:item.date
            })
          await this.$store.dispatch('setAlertWithTimeout', {
            state: 'success',
            message: `Delete survey successfully for student:${item.studentId}`
          })
        }
      } catch(error){
        this.$store.commit('setAlert', {state: 'danger', message: error.message})
      }
    }
  }
}
</script>
