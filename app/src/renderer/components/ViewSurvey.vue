<template>
  <div>
    <div class="page-title">
      <img width="80px" src="../assets/logo.jpg">
    </div>
    <div class="student py-0">
      Your child received a free dental screening. This screening consists of a
      visual exam performed by a licensed dental professional./ Su ni&ntilde;o
      recibi&oacute; un examen de detecci&oacute;n dental gratuita. Este examen
      de detecci&oacute;n consist&iacute;a en un examen visual realizado por un
      profesional licenciado en odontolog&iacute;a.
    </div>
    <div class="student p-1">
      <div>
        <em><strong>{{siteName}}</strong></em> <strong>Grade:</strong> {{survey.grade}} <strong>Room:</strong> {{survey.room}} {{survey.teacher}}
      </div>
      <div>
        <strong>Child's Name/ Nombre del Ni&ntilde;o:</strong> {{survey.firstName}} {{survey.lastName}} {{survey.studentId}}
      </div>
      <div>
        <strong>Date Of Birth/ Fecha de Nacimiento:</strong> {{survey.birthDate}}
      </div>
    </div>
    <div class="student" v-for="checkLevel of checkLevels" v-show="showLevel(checkLevel)">
      <dl class="m-0">
        <dt>{{checkLevel.index}}. <span v-html="checkLevel.title"></span></dt>
        <dd class="m-0" v-for="option of checkLevel.options" v-show="showOption(option.value)">
          {{option.letter}}. <span v-html="option.text"></span>
        </dd>
      </dl>
    </div>
    <div class="row" v-show="survey.comment">
      <div class="col-8">
        <strong>Comment/Comentario:</strong>
        <blockquote class="blockquote" style="font-size:.9em">
          <p class="mb-0 mt-0">{{survey.comment}}</p>
        </blockquote>
      </div>
    </div>
    <div>
      <Drawing  :lines="survey.babyTeeth" :src="babyTeethUrl" :width="230" :height="300"/>
      <Drawing  :lines="survey.permanentTeeth" :src="permanentTeethUrl" :width="230" :height="300"/>
    </div>
    <div v-show="forPrint" class="row">
      <div class="col">
        <Drawing class="decorated" :width="300" :height="60" :lines="survey.signature"/>
      </div>
      <div class="subline col"><div>{{survey.dentist}}</div>
        <div>{{formatDate(survey.date)}}</div>
        <div>Visit us at <a href="//www.hkidsf.org">www.hkidsf.org</a></div>
      </div>
    </div>
  </div>
</template>
<script>
import Drawing from './Drawing'
export default{
  props: {
    survey: {type: Object},
    siteName: {type: String},
    forPrint: {type: Boolean, default: false}
  },
  computed: {
    babyTeethUrl () {
      return this.$store.state.survey.babyTeethUrl
    },
    permanentTeethUrl () {
      return this.$store.state.survey.permanentTeethUrl
    },
    checkLevels () {
      return this.$store.state.checkLevels
    }
  },
  methods: {
    showLevel (checkLevel) {
      for (const option of checkLevel.options) {
        if (this.showOption(option.value)) {
          return true
        }
      }
      return false
    },
    showOption (value) {
      return this.survey.checkList.indexOf(value) >= 0
    },
    formatDate (value) {
      return new Date(value).toDateString()
    }
  },
  components: {
    Drawing
  }
}
</script>
<style>
.student{
  font-size:.8em
}
.page-title{
  text-align:center;
}
.subline{
  font-size:12px;
}
.footer{
  font-size:.7em;
  color:rgb(150,150,150)
}
</style>
