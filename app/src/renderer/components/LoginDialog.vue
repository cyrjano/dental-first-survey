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
          <b-alert state="danger" :show="showError">
            {{errorMessage}}
          </b-alert>
          <form>
            <div class="form-group">
              <label for="emailLoginInput">Email</label>
              <input type="text" class="form-control" @input="updateEmail" :value="email" id="emailLoginInput" placeholder="xxxx@gmail.com">
            </div>
            <div class="form-group">
              <label for="passwordInput">Password</label>
              <input type="password" class="form-control" @input="updatePassword" :value="password" id="passwordInput" placeholder="Password">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="login">Login</button>
          <button type="button" class="btn btn-secondary" @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      errorMessage: ''
    }
  },
  computed: {
    showError () {
      return !!this.errorMessage
    },
    show () {
      return this.$store.state.import.show
    },
    email () {
      return this.$store.state.import.email
    },
    password () {
      return this.$store.state.import.password
    }
  },
  watch: {
    show (newValue) {
      if (newValue) {
        this.errorMessage = ''
        $('#loginDialog').modal('show')
      } else {
        $('#loginDialog').modal('hide')
      }
    }
  },
  methods: {
    close () {
      this.$store.dispatch('closeLoginDialog')
    },
    updateEmail (e) {
      this.$store.commit('updateEmail', {email: e.target.value})
    },
    updatePassword (e) {
      this.$store.commit('updatePassword', {password: e.target.value})
    },
    login () {
      this.$store.dispatch('login').then(() => this.close()).catch((error) => this.errorMessage = error)
    }
  }
}
</script>
