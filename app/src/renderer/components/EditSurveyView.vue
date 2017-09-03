<template>
  <layout>
      <div class="d-flex flex-column">
        <div  id="deleteModal" class="modal fade">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Confirm Deletion</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete this survey?</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="deleteSurvey">Delete</button>
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
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
                  <button class="btn btn-primary"><octicon name="pencil"/>Edit</button>
                  &nbsp;
                  <button class="btn btn-danger" @click="startDelete(survey)"><octicon name="trashcan"/>Delete</button>
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

export default {
  data(){
    return {selectedSurvey:-1, studentId:''}
  },
  components: {
    layout: Layout
  },
  computed:{
    surveySummaries () {
      return this.$store.state.sessions.find(session => this.$store.state.activeSession == session.date).surveySummaries
    }
  },
  methods:{
    startDelete: function (item){
      this.$data.selectedSurvey = item.date;
      this.$data.studentId = item.studentId;
      $("#deleteModal").modal('show');
    },
    deleteSurvey: function(){
      this.$store.dispatch('deleteSurvey',
        {
          sessionId:this.$store.state.activeSession,
          surveyId:this.$data.selectedSurvey
        }).then(()=>{
          this.$data.selectedSurvey = -1
          $('#deleteModal').modal('hide')
          return this.$store.dispatch('setAlertWithTimeout', {
            state: 'success',
            message: `Delete survey successfully for student:${this.$data.studentId}`
          }).then(()=>{
            this.$data.studentId = ''
          })

        }).catch(error => {
          this.$store.commit('setAlert', {state: 'danger', message: error.message})
        })
    }
  }
}
</script>
