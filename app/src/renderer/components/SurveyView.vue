<template>
  <layout>
    <div class='d-flex flex-column flex-grow'>
      <div v-if='!hasActiveSession' class="inactive p-2 d-flex flex-grow">
        <h1>No Active Session</h1>
      </div>
      <div v-if='hasActiveSession' class="container p-4">
        <form>
          <legend>{{activeSession.siteName}}</legend>
          <div>
            <label v-show="!canSearch" for="studentIdInput" class="col-1 col-form-label">ID:</label>
            <div  v-show="!canSearch" class="col-11">
              <input :class="['form-control', studentErrorClass]" v-model="studentId" type="text" id="studentIdInput"/>
              <div class="invalid-feedback">{{validationError}}</div>
            </div>
            <label v-show="canSearch" for="studentIdSearch" class="col-1 col-form-label">ID:</label>
            <div v-show="canSearch" class="input-group mb-2 mr-sm-2 mb-sm-0 col-10">
              <input type="text" v-model="studentId" :class="['form-control', studentErrorClass]" id="studentIdSearch">
              <div class="invalid-feedback">{{validationError}}</div>
              <span class="input-group-btn">
                <button class="btn btn-primary" @click="search" type="button"><octicon name="search"/></button>
              </span>
            </div>
          </div>
          <div class="form-group row">
            <label for="gradeInput" class="col-1 col-form-label">Grade:</label>
            <div class="col-5">
              <input class="form-control" v-model="grade" type="text" id="gradeInput"/>
            </div>
            <label for="roomInput" class="col-1 col-form-label">Room:</label>
            <div class="col-5">
              <input class="form-control" v-model="room" type="text" id="roomInput"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="teacherInput" class="col-2 col-form-label">Teacher:</label>
            <div class="col-10">
              <input class="form-control" v-model="teacher" type="text" id="teacherInput"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="firstNameInput" class="col-1 col-form-label">First:</label>
            <div class="col-5">
              <input class="form-control" v-model="firstName" type="text" id="firstNameInput"/>
            </div>
            <label for="lastNameInput" class="col-1 col-form-label">Last:</label>
            <div class="col-5">
              <input class="form-control" v-model="lastName" type="text" id="lastNameInput"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="birthDateInput" class="col-1 col-form-label">DoB:</label>
            <div class="col-5">
              <input class="form-control" v-model="birthDate" type="date" id="birthDateInput"/>
            </div>
          </div>
          <div class="form-group">
            <ol start=0>
              <li v-for="checkLevel of checkLevels">
                <h6><span v-html="checkLevel.title"></span></h6>
                <div class="form-check" v-for="option of checkLevel.options">
                  <label class="form-check-label">
                    <input v-model="checkList" class="form-check-input" type="checkbox" :value="option.value">
                    {{option.letter}}. <span v-html="option.text"></span>
                  </label>
                </div>
              </li>
            </ol>
          </div>
          <div class="form-group">
            <label for="comment">Comments:</label>
            <textarea class="form-control" v-model="comment" rows="5" id="comment"></textarea>
          </div>
          <div style="padding:20px">
            <sketch :lines="babyTeeth" :src="babyTeethUrl" :width="230" :height="300" @line="addBabyTeethLine" @clear="clearBabyTeeth"></sketch>
          </div>
          <div style="padding:20px">
            <sketch :lines="permanentTeeth" :src="permanentTeethUrl" :width="230" :height="300" @line="addPermanentTeethLine" @clear="clearPermanentTeeth"></sketch>
          </div>
          <div class="p-2">
            <button v-show="isEditing" class="btn btn-secondary" @click="cancelEdit">Cancel</button>
            <button :disabled="!!validationError" class="btn btn-primary" @click.prevent="verify">Verify</button>
          </div>
        </form>
      </div>
    </div>
  </layout>
</template>
<script>
import Sketch from './Sketch'
import Layout from './Layout'
import Octicon from './Octicon'

function property (propertyName) {
  return {
    get () {
      return this.$store.state.survey[propertyName]
    },
    set (value) {
      this.$store.commit('updateSurvey', {[propertyName]: value})
    }
  }
}
export default {
  computed: {
    isEditing(){
      return this.$store.state.editMode;
    },
    studentErrorClass () {
      if (this.validationError && !this.isEditing) {
        return 'is-invalid'
      }
      return ''
    },
    validationError () {
      const studentId = this.$store.state.survey.studentId
      if (!studentId) {
        return 'Student Id required'
      }
      if (!this.$store.state.unique && !this.isEditing) {
        return 'Student Id must be unique'
      }
      return ''
    },
    grade: property('grade'),
    room: property('room'),
    teacher: property('teacher'),
    firstName: property('firstName'),
    lastName: property('lastName'),
    studentId: property('studentId'),
    birthDate: property('birthDate'),
    checkList: property('checkList'),
    comment: property('comment'),
    canSearch () {
      return this.activeSession.recordsLength > 0
    },
    babyTeeth () {
      return this.$store.state.survey.babyTeeth
    },
    babyTeethUrl () {
      return this.$store.state.survey.babyTeethUrl
    },
    permanentTeeth () {
      return this.$store.state.survey.permanentTeeth
    },
    permanentTeethUrl () {
      return this.$store.state.survey.permanentTeethUrl
    },
    hasActiveSession () {
      return this.$store.state.activeSession >= 0
    },
    activeSession () {
      return this.$store.state.sessions.find(session => this.$store.state.activeSession == session.date)
    },
    checkLevels () {
      return this.$store.state.checkLevels
    }
  },
  methods: {
    search (ev) {
      this.$store.dispatch('searchId')
    },
    addBabyTeethLine (ev) {
      this.$store.commit('addLine', {babyTeeth: ev})
    },
    addPermanentTeethLine (ev) {
      this.$store.commit('addLine', {permanentTeeth: ev})
    },
    clearBabyTeeth () {
      this.$store.commit('updateSurvey', {babyTeeth: []})
    },
    clearPermanentTeeth () {
      this.$store.commit('updateSurvey', {permanentTeeth: []})
    },
    verify () {
      this.$router.push('/verify')
    },
    cancelEdit(){
      this.$store.dispatch('cancelEdit')
    }
  },
  components: {
    sketch: Sketch,
    layout: Layout,
    octicon: Octicon
  }
}
</script>
<style>
.inactive{
  color:rgb(100,100,100);
  background-color:rgb(200,200,200);
}
</style>
