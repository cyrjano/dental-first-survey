<template>
  <layout>
    <div class="p-4">
      <ViewSurvey :for-print="true" :site-name="siteName" :survey="survey"></ViewSurvey>
      <div>
        <Sketch :width="300" :height="60" :lines="signatureLines" @line="addSignatureLine" @clear="clearSignature">
        </Sketch>
      </div>
      <div class="form-group row">
        <label for="teacherInput" class="col-2 col-form-label">Dentist Name:</label>
        <div class="col-8">
          <input class="form-control" v-model="dentist" type="text" id="teacherInput"/>
        </div>
      </div>
      <div>
        <button class="btn btn-primary" @click.prevent="accept">Accept</button>
        <button class="btn btn-default" @click.prevent="edit">Edit</button>
      </div>
    </div>
  </layout>
</template>
<script>
import ViewSurvey from './ViewSurvey'
import Sketch from './Sketch'
import Layout from './Layout'

export default {
  computed: {
    signatureLines () {
      return this.$store.state.survey.signature
    },
    dentist: {
      get () {
        return this.$store.state.survey.dentist
      },
      set (value) {
        this.$store.commit('updateSurvey', {dentist: value})
      }
    },
    survey () {
      return this.$store.state.survey
    },
    siteName () {
      return this.$store.state.sessions.find(
        session => session.date == this.$store.state.activeSession
      ).siteName
    }
  },
  methods: {
    addSignatureLine (ev) {
      this.$store.commit('addLine', {signature: ev})
    },
    clearSignature () {
      this.$store.commit('updateSurvey', {signature: []})
    },
    accept () {
      this.$store.dispatch('saveSurvey').then(function () {
        this.$router.push('/surveys')
        this.$store.dispatch('setAlertWithTimeout', {state: 'success', message: `Survey Captured`})
      }.bind(this))
    },
    edit () {
      this.$router.push('/surveys')
    }
  },
  components: {
    ViewSurvey,
    Sketch,
    layout: Layout
  }
}
</script>
