<template>
  <div ref="modal" class="modal fade">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close"  @click="dismiss" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot><p>Are you sure you want to delete this survey?</p></slot>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="accept" data-dismiss="modal">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
    };
  },
  props:{
    title:String
  },
  methods:{
    show(){
      $(this.$refs.modal).modal('show')
        this.$data.resolveCallback = resolve;
      });
      return promise;
    },
    accept(){
    },
    dismiss(){
    }
  }
}
</script>
