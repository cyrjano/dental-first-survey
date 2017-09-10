<template>
  <layout>
    <div class='d-flex flex-column flex-grow'>
      <div v-if='!canSearch' class="inactive p-2 d-flex flex-grow">
        <h1>Session has No Roster</h1>
      </div>
      <div v-if='canSearch' class="container p-4">
        <div class="row">
          <div class="col-10">
            <input class="form-control" type="text" v-model:value="query">
          </div>
          <div class="col-2">
            <button class="btn btn-primary" @click="findStudents">Search</button>
          </div>
        </div>
        <div class="row">
          <table class="table">
            <thead>
              <tr>
                <th>Student Id</td>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in records">
                <td>{{item.studentId}}</td>
                <td>{{item.firstName}} {{item.lastName}}</td>
                <td>{{item.birthDate}}</td>
                <td><button class="btn btn-primary" @click="selectStudent(item)">Select</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>
import Layout from './Layout'

export default {
  data(){
    return {
      records:[],
      query:''
    }
  },
  computed:{
    canSearch(){
      return this.activeSession.recordsLength > 0
    },
    activeSession () {
      return this.$store.state.sessions.find(session => this.$store.state.activeSession == session.date)
    },
  },
  methods:{
    async findStudents(){
      const students = await this.$store.dispatch('findStudents', this.$data.query)
      this.$data.records = students;
    },
    selectStudent(item){
      this.$data.query = ''
      this.$data.records = []
      this.$store.dispatch('selectStudent',{studentId:item.studentId})
      this.$router.push('/surveys')
    }
  },
  components: {
    layout:Layout
  }
}
</script>
