<template>
  <canvas ref="canvas" :width="width" :src="src" :height="height" :lines="lines"></canvas>
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    lines: {
      type: Array,
      default: []
    },
    src: {
      type: String,
      default: ''
    }
  },
  watch: {
    lines () {
      this.draw()
    }
  },
  mounted () {
    if (this.src) {
      let img = new Image()
      img.src = this.src
      img.onload = () => {
        this.image = img
        this.draw()
      }
    } else {
      this.draw()
    }
  },
  methods: {
    draw () {
      let g = this.$refs.canvas.getContext('2d')
      g.beginPath()
      g.rect(0, 0, this.width, this.height)
      g.fillStyle = 'rgb(255,255,255)'
      g.fill()
      if (this.image) {
        g.drawImage(this.image, 0, 0)
      }
      g.beginPath()
      for (let line of this.lines) {
        if (line.length > 1) {
          g.lineWidth = 1
          g.strokeStyle = 'rgb(255, 0, 0)'
          for (let i = 0; i < line.length; i++) {
            if (i == 0) {
              g.moveTo(line[i].x, line[i].y)
            } else {
              g.lineTo(line[i].x, line[i].y)
            }
          }
        }
      }
      g.stroke()
    }
  }
}
</script>
