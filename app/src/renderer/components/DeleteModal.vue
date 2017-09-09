<template>
  <div ref="modal" class="modal fade">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{title}}</h5>
          <button type="button" class="close"  @click="dismiss" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot><p>Are you sure you want to delete this survey?</p></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="accept" data-dismiss="modal">Delete</button>
          <button type="button" class="btn btn-secondary" @click="dismiss" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      resolveCallback:null
    };
  },
  props:{
    title:String
  },
  methods:{
    show(){
      $(this.$refs.modal).modal('show')
      let promise = new Promise((resolve, reject)=>{
        this.$data.resolveCallback = resolve;
      });
      return promise;
    },
    accept(){
      this.$data.resolveCallback(true)
    },
    dismiss(){
      this.$data.resolveCallback(false)
    }
  }
}
</script>
