<template>
  <div class='d-flex flex-column flex-grow'>
    <div v-if='!hasActiveSession' class="inactive p-2 d-flex flex-grow">
      <h1>No Active Session</h1>
    </div>
    <div v-if='hasActiveSession' class="container p-4">
      <form>
        <legend>{{activeSession.siteName}}</legend>
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
          <label for="studentIdInput" class="col-1 col-form-label">ID:</label>
          <div class="col-5">
            <input class="form-control" v-model="studentId" type="text" id="studentIdInput"/>
          </div>
          <label for="birthDateInput" class="col-1 col-form-label">DoB:</label>
          <div class="col-5">
            <input class="form-control" v-model="birthDate" type="date" id="birthDateInput"/>
          </div>
        </div>
        <div class="form-group">
          <ol>
            <li v-for="checkLevel of checkLevels">
              <h6>{{checkLevel.title}}</h6>
              <div class="form-check" v-for="option of checkLevel.options">
                <label class="form-check-label">
                  <input v-model="checkList" class="form-check-input" type="checkbox" :value="option.value">
                  {{option.letter}}. {{option.text}}
                </label>
              </div>
            </li>
          </ol>
        </div>
        <div style="padding:20px">
          <sketch :lines="babyTeeth" :src="babyTeethUrl" :width="230" :height="300" @line="addBabyTeethLine" @clear="clearBabyTeeth"></sketch>
        </div>
        <div style="padding:20px">
          <sketch :lines="permanentTeeth" :src="permanentTeethUrl" :width="230" :height="300" @line="addPermanentTeethLine" @clear="clearPermanentTeeth"></sketch>
        </div>
        <div class="p-2">
          <button class="btn btn-primary" @click.prevent="verify">Verify</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Sketch from './Sketch'

function property(propertyName){
  return {
    get(){
      return this.$store.state.survey[propertyName]
    },
    set(value){
      this.$store.commit('updateSurvey', {[propertyName]:value})
    }
  }
}
export default {
  computed:{
    grade:property('grade'),
    room:property('room'),
    teacher:property('teacher'),
    firstName:property('firstName'),
    lastName:property('lastName'),
    studentId:property('studentId'),
    birthDate:property('birthDate'),
    checkList:property('checkList'),
    babyTeeth(){
      return this.$store.state.survey.babyTeeth
    },
    babyTeethUrl(){
      return this.$store.state.survey.babyTeethUrl
    },
    permanentTeeth(){
      return this.$store.state.survey.permanentTeeth
    },
    permanentTeethUrl(){
      return this.$store.state.survey.permanentTeethUrl
    },
    hasActiveSession(){
      return this.$store.state.activeSession >= 0
    },
    activeSession(){
      return this.$store.state.sessions.find(session=>this.$store.state.activeSession==session.date)
    },
    checkLevels(){
      return this.$store.state.checkLevels
    },
  },
  methods:{
    addBabyTeethLine(ev){
      this.$store.commit('addLine', {babyTeeth:ev})
    },
    addPermanentTeethLine(ev){
      this.$store.commit('addLine', {permanentTeeth:ev})
    },
    clearBabyTeeth(){
      this.$store.commit('updateSurvey', {babyTeeth:[]})
    },
    clearPermanentTeeth(){
      this.$store.commit('updateSurvey', {permanentTeeth:[]})
    },
    verify(){
      this.$router.push('/verify')
    }
  },
  components:{
    sketch:Sketch
  }
}
</script>
<style>
.inactive{
  color:rgb(100,100,100);
  background-color:rgb(200,200,200);
}
</style>
