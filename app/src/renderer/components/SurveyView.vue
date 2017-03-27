<template>
  <div class='d-flex flex-column flex-grow'>
    <div v-if='!hasActiveSession' class="inactive p-2 d-flex flex-grow">
      <h1>No Active Session</h1>
    </div>
    <div v-if='hasActiveSession' class="container">
      <form>
        <legend>{{activeSession.siteName}}</legend>
        <div class="form-group row">
          <label for="gradeInput" class="col-1 col-form-label">Grade:</label>
          <div class="col-5">
            <input class="form-control" type="text" id="gradeInput"/>
          </div>
          <label for="roomInput" class="col-1 col-form-label">Room:</label>
          <div class="col-5">
            <input class="form-control" type="text" id="roomInput"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="teacherInput" class="col-2 col-form-label">Teacher:</label>
          <div class="col-10">
            <input class="form-control" type="text" id="teacherInput"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="firstNameInput" class="col-1 col-form-label">First:</label>
          <div class="col-5">
            <input class="form-control" type="text" id="firstNameInput"/>
          </div>
          <label for="lastNameInput" class="col-1 col-form-label">Last:</label>
          <div class="col-5">
            <input class="form-control" type="text" id="lastNameInput"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="studentIdInput" class="col-1 col-form-label">ID:</label>
          <div class="col-5">
            <input class="form-control" type="text" id="studentIdInput"/>
          </div>
          <label for="birthDateInput" class="col-1 col-form-label">DoB:</label>
          <div class="col-5">
            <input class="form-control" type="date" id="birthDateInput"/>
          </div>
        </div>
        <div class="form-group">
          <ol>
            <li v-for="checkLevel of checkLevels">
              <h6>{{checkLevel.title}}</h6>
              <div class="form-check" v-for="option of checkLevel.options">
                <label class="form-check-label">
                  <input class="form-check-input" type="checkbox" value="option.value">
                  {{option.letter}}. {{option.text}}
                </label>
              </div>
            </li>
          </ol>
        </div>
      </form>
    </div>
    <div  v-if='hasActiveSession' style="padding:20px">
      <sketch></sketch>
    </div>
    <div   v-if='hasActiveSession' class="container p-2">
      <button class="btn btn-primary">Verify</button>
    </div>
  </div>
</template>
<script>
import Sketch from './Sketch'

export default {
  computed:{
    hasActiveSession(){
      return this.$store.state.activeSession >= 0
    },
    activeSession(){
      return this.$store.state.sessions.find(session=>this.$store.state.activeSession==session.date)
    },
    checkLevels(){
      return this.$store.state.checkLevels
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
