<template>
  <div id="loginDialog" class="modal fade">
    <div class="modal-dialog" role="dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Login to Salesforce</h5>
          <button type="button" class="close" @click="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>To import data please sign in to salesforce first.</p>
          <b-alert state="danger" :show="true">
            Alert
          </b-alert>
          <form>
            <div class="form-group">
              <label for="emailLoginInput">Email</label>
              <input type="text" class="form-control" id="emailLoginInput" placeholder="xxxx@gmail.com">
            </div>
            <div class="form-group">
              <label for="passwordInput">Password</label>
              <input type="password" class="form-control" id="passwordInput" placeholder="Password">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" >Login</button>
          <button type="button" class="btn btn-secondary" @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed:{
    show(){
      return this.$store.state.import.show
    }
  },
  watch:{
    show(newValue){
      if(newValue){
        $('#loginDialog').modal('show')
      } else {
        $('#loginDialog').modal('hide')
      }
    }
  },
  methods:{
    close(){
      this.$store.dispatch('closeLoginDialog')
    }
  }
}
</script>
